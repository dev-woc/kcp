import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/strava/disconnect
 * Disconnects user's Strava account
 */
export async function POST() {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Clear Strava credentials from user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        stravaAthleteId: null,
        stravaAccessToken: null,
        stravaRefreshToken: null,
        stravaTokenExpiry: null,
        stravaConnectedAt: null,
      },
    });

    // Note: We're not deleting activities so we preserve historical data
    // If you want to delete activities too, uncomment:
    // await prisma.activity.deleteMany({
    //   where: { userId: session.user.id },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Strava:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Strava" },
      { status: 500 }
    );
  }
}
