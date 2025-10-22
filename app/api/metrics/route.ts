import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get total number of approved applications
    const totalApprovedApplications = await prisma.application.count({
      where: { status: "approved" },
    });

    // Get total number of check-in sessions
    const totalCheckInSessions = await prisma.session.count();

    // Get total number of all applications
    const totalApplications = await prisma.application.count();

    // Get total number of pending applications
    const pendingApplications = await prisma.application.count({
      where: { status: "pending" },
    });

    // Get total number of therapists
    const totalTherapists = await prisma.therapist.count({
      where: { isActive: true },
    });

    // Get total number of Wednesday rides tracked via Strava
    const totalWednesdayRides = await prisma.activity.count({
      where: { isWednesdayRide: true },
    });

    // Get total number of all activities
    const totalActivities = await prisma.activity.count();

    // Get aggregate statistics for all activities
    const activityStats = await prisma.activity.aggregate({
      _sum: {
        distance: true,
        movingTime: true,
        totalElevationGain: true,
      },
      _avg: {
        distance: true,
        averageSpeed: true,
      },
    });

    // Get number of connected Strava users
    const stravaConnectedUsers = await prisma.user.count({
      where: { stravaAthleteId: { not: null } },
    });

    // Calculate fallback estimated rides if no Strava data
    const foundationStartDate = new Date("2024-01-01");
    const currentDate = new Date();
    const weeksPassed = Math.floor(
      (currentDate.getTime() - foundationStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
    );
    const estimatedRides = totalWednesdayRides > 0 ? totalWednesdayRides : weeksPassed;

    return NextResponse.json({
      totalApprovedApplications,
      totalCheckInSessions,
      totalApplications,
      pendingApplications,
      totalTherapists,
      estimatedRides,
      totalWednesdayRides,
      totalActivities,
      totalDistanceMeters: activityStats._sum.distance || 0,
      totalDistanceMiles: ((activityStats._sum.distance || 0) * 0.000621371).toFixed(2),
      totalMovingTimeSeconds: activityStats._sum.movingTime || 0,
      totalElevationMeters: activityStats._sum.totalElevationGain || 0,
      totalElevationFeet: ((activityStats._sum.totalElevationGain || 0) * 3.28084).toFixed(2),
      averageDistanceMeters: activityStats._avg.distance || 0,
      averageDistanceMiles: ((activityStats._avg.distance || 0) * 0.000621371).toFixed(2),
      averageSpeedMps: activityStats._avg.averageSpeed || 0,
      averageSpeedMph: ((activityStats._avg.averageSpeed || 0) * 2.23694).toFixed(2),
      stravaConnectedUsers,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
