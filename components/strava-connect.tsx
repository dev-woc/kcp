"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StravaConnectProps {
  isConnected: boolean;
  connectedAt?: Date | null;
}

export default function StravaConnect({ isConnected, connectedAt }: StravaConnectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/strava/connect");
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error connecting to Strava:", error);
      alert("Failed to connect to Strava");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/strava/sync", { method: "POST" });
      const data = await response.json();

      if (data.success) {
        alert(`Synced ${data.newActivities} new activities and updated ${data.updatedActivities} existing ones`);
        router.refresh();
      }
    } catch (error) {
      console.error("Error syncing Strava:", error);
      alert("Failed to sync Strava activities");
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Strava? Your activity history will be preserved.")) {
      return;
    }

    setDisconnecting(true);
    try {
      const response = await fetch("/api/strava/disconnect", { method: "POST" });
      const data = await response.json();

      if (data.success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error disconnecting Strava:", error);
      alert("Failed to disconnect Strava");
    } finally {
      setDisconnecting(false);
    }
  };

  if (isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Strava Connected</h3>
              <p className="text-sm text-gray-500">
                Connected {connectedAt ? new Date(connectedAt).toLocaleDateString() : "recently"}
              </p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
          >
            {disconnecting ? "Disconnecting..." : "Disconnect"}
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Your Strava activities are automatically synced. You can also manually sync to get the latest data.
        </p>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
        >
          {syncing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Sync Activities</span>
            </>
          )}
        </button>

        <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-blue-800">
          <p className="font-medium mb-1">Automatic Tracking Enabled</p>
          <p>New cycling activities will be automatically imported from Strava when you complete them.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Connect Strava</h3>
          <p className="text-sm text-gray-500">Track your rides automatically</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">
        Connect your Strava account to automatically track your cycling activities and Wednesday rides with the Keep Pedaling Foundation community.
      </p>

      <button
        onClick={handleConnect}
        disabled={loading}
        className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2 font-semibold"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
            </svg>
            <span>Connect with Strava</span>
          </>
        )}
      </button>

      <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-3 text-sm text-green-800">
        <p className="font-medium mb-1">Why Connect Strava?</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Automatically track your Wednesday rides</li>
          <li>See your progress and statistics</li>
          <li>Contribute to community ride metrics</li>
        </ul>
      </div>
    </div>
  );
}
