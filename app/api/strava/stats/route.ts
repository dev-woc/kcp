import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/strava/stats
 * Get personal Strava statistics for the current user
 */
export async function GET() {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if user has Strava connected
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stravaAthleteId: true },
    });

    if (!user?.stravaAthleteId) {
      return NextResponse.json(
        { error: "Strava not connected" },
        { status: 400 }
      );
    }

    // Get all activities for the user
    const activities = await prisma.activity.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: "desc" },
    });

    // Calculate statistics
    const totalRides = activities.length;
    const totalDistanceMeters = activities.reduce((sum, a) => sum + a.distance, 0);
    const totalDistanceMiles = totalDistanceMeters * 0.000621371;
    const totalElevationMeters = activities.reduce((sum, a) => sum + a.totalElevationGain, 0);
    const totalElevationFeet = totalElevationMeters * 3.28084;
    const totalMovingTimeSeconds = activities.reduce((sum, a) => sum + a.movingTime, 0);
    const wednesdayRides = activities.filter((a) => a.isWednesdayRide).length;

    // Find longest ride
    const longestRide = activities.length > 0
      ? activities.reduce((max, a) => (a.distance > max.distance ? a : max))
      : null;

    // Get recent activities (last 10)
    const recentActivities = activities.slice(0, 10).map((a) => ({
      id: a.id,
      name: a.name,
      distance: (a.distance * 0.000621371).toFixed(2), // miles
      elevation: (a.totalElevationGain * 3.28084).toFixed(0), // feet
      movingTime: a.movingTime,
      startDate: a.startDate,
      isWednesdayRide: a.isWednesdayRide,
      averageSpeed: a.averageSpeed ? (a.averageSpeed * 2.23694).toFixed(1) : null, // mph
    }));

    return NextResponse.json({
      totalRides,
      totalDistanceMiles: totalDistanceMiles.toFixed(1),
      totalElevationFeet: totalElevationFeet.toFixed(0),
      totalMovingTimeSeconds,
      totalMovingTimeFormatted: formatDuration(totalMovingTimeSeconds),
      wednesdayRides,
      longestRide: longestRide
        ? {
            name: longestRide.name,
            distance: (longestRide.distance * 0.000621371).toFixed(2),
            date: longestRide.startDate,
          }
        : null,
      recentActivities,
    });
  } catch (error) {
    console.error("Error fetching Strava stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

/**
 * Format seconds to HH:MM:SS or MM:SS
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
}
