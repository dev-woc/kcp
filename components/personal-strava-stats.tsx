"use client";

import { useState, useEffect } from "react";

interface Activity {
  id: string;
  name: string;
  distance: string;
  elevation: string;
  movingTime: number;
  startDate: string;
  isWednesdayRide: boolean;
  averageSpeed: string | null;
}

interface StravaStats {
  totalRides: number;
  totalDistanceMiles: string;
  totalElevationFeet: string;
  totalMovingTimeSeconds: number;
  totalMovingTimeFormatted: string;
  wednesdayRides: number;
  longestRide: {
    name: string;
    distance: string;
    date: string;
  } | null;
  recentActivities: Activity[];
}

export default function PersonalStravaStats() {
  const [stats, setStats] = useState<StravaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/strava/stats");

      if (response.status === 400) {
        // User doesn't have Strava connected
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stats");
      }

      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading ride statistics...</p>
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  if (!stats) {
    return null; // User doesn't have Strava connected
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Ride Statistics</h2>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.totalRides}</div>
          <div className="text-sm text-gray-600 mt-1">Total Rides</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.totalDistanceMiles}</div>
          <div className="text-sm text-gray-600 mt-1">Miles</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.totalElevationFeet}</div>
          <div className="text-sm text-gray-600 mt-1">Feet Climbed</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.wednesdayRides}</div>
          <div className="text-sm text-gray-600 mt-1">Wednesday Rides</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Riding Time</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.totalMovingTimeFormatted}</div>
        </div>

        {stats.longestRide && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500 mb-1">Longest Ride</div>
            <div className="text-2xl font-semibold text-gray-900">{stats.longestRide.distance} mi</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.longestRide.name} • {new Date(stats.longestRide.date).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      {/* Recent Activities */}
      {stats.recentActivities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activities</h3>
          <div className="space-y-2">
            {stats.recentActivities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{activity.name}</h4>
                    {activity.isWednesdayRide && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                        Wednesday
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{activity.distance} mi</div>
                  <div className="text-xs text-gray-500">{activity.elevation} ft</div>
                </div>
              </div>
            ))}
          </div>

          {stats.recentActivities.length > 5 && (
            <p className="text-sm text-gray-500 text-center mt-3">
              Showing 5 of {stats.recentActivities.length} recent rides
            </p>
          )}
        </div>
      )}

      {stats.totalRides === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-2">No rides recorded yet</p>
          <p className="text-sm text-gray-500">
            Your cycling activities from Strava will appear here
          </p>
        </div>
      )}
    </div>
  );
}
