import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getValidAccessToken, getAthleteActivities, isWednesdayRide } from "@/lib/strava";

/**
 * POST /api/strava/sync
 * Manually sync user's Strava activities
 */
export async function POST() {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        stravaAccessToken: true,
        stravaRefreshToken: true,
      },
    });

    if (!user?.stravaAccessToken) {
      return NextResponse.json(
        { error: "Strava not connected" },
        { status: 400 }
      );
    }

    // Get valid access token
    const accessToken = await getValidAccessToken(session.user.id);

    // Get activities from the last 90 days
    const ninetyDaysAgo = Math.floor(
      (Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000
    );

    const activities = await getAthleteActivities(
      accessToken,
      ninetyDaysAgo,
      undefined,
      1,
      100 // Get up to 100 activities
    );

    let newActivities = 0;
    let updatedActivities = 0;

    for (const activity of activities) {
      // Only process Ride activities
      if (activity.type !== "Ride") continue;

      const startDate = new Date(activity.start_date);

      const existing = await prisma.activity.findUnique({
        where: { stravaActivityId: activity.id.toString() },
      });

      if (existing) {
        // Update existing activity
        await prisma.activity.update({
          where: { stravaActivityId: activity.id.toString() },
          data: {
            activityType: activity.type,
            name: activity.name,
            distance: activity.distance,
            movingTime: activity.moving_time,
            elapsedTime: activity.elapsed_time,
            totalElevationGain: activity.total_elevation_gain,
            startDate: startDate,
            averageSpeed: activity.average_speed,
            maxSpeed: activity.max_speed,
            isWednesdayRide: isWednesdayRide(startDate),
          },
        });
        updatedActivities++;
      } else {
        // Create new activity
        await prisma.activity.create({
          data: {
            userId: session.user.id,
            stravaActivityId: activity.id.toString(),
            activityType: activity.type,
            name: activity.name,
            distance: activity.distance,
            movingTime: activity.moving_time,
            elapsedTime: activity.elapsed_time,
            totalElevationGain: activity.total_elevation_gain,
            startDate: startDate,
            averageSpeed: activity.average_speed,
            maxSpeed: activity.max_speed,
            isWednesdayRide: isWednesdayRide(startDate),
          },
        });
        newActivities++;
      }
    }

    return NextResponse.json({
      success: true,
      newActivities,
      updatedActivities,
      totalProcessed: activities.length,
    });
  } catch (error) {
    console.error("Error syncing Strava activities:", error);
    return NextResponse.json(
      { error: "Failed to sync activities" },
      { status: 500 }
    );
  }
}
