import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActivity, isWednesdayRide } from "@/lib/strava";

/**
 * GET /api/strava/webhook
 * Handles Strava webhook subscription validation
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Verify the token matches our verification token
  const VERIFY_TOKEN = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN || "STRAVA_VERIFY";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return NextResponse.json({ "hub.challenge": challenge });
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

/**
 * POST /api/strava/webhook
 * Handles Strava webhook events
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Received Strava webhook event:", body);

    // Strava webhook event structure:
    // {
    //   object_type: "activity" | "athlete",
    //   object_id: number,
    //   aspect_type: "create" | "update" | "delete",
    //   owner_id: number,
    //   subscription_id: number,
    //   event_time: number
    // }

    const { object_type, object_id, aspect_type, owner_id } = body;

    // We only care about activity events
    if (object_type !== "activity") {
      return NextResponse.json({ success: true });
    }

    // Find user by Strava athlete ID
    const user = await prisma.user.findFirst({
      where: { stravaAthleteId: owner_id.toString() },
    });

    if (!user) {
      console.log(`User not found for Strava athlete ID: ${owner_id}`);
      return NextResponse.json({ success: true });
    }

    if (aspect_type === "create") {
      // Fetch the activity details from Strava
      try {
        // Get a valid access token (will refresh if needed)
        const { getValidAccessToken } = await import("@/lib/strava");
        const accessToken = await getValidAccessToken(user.id);

        const activity = await getActivity(accessToken, object_id);

        // Only store Ride activities
        if (activity.type === "Ride") {
          const startDate = new Date(activity.start_date);

          await prisma.activity.create({
            data: {
              userId: user.id,
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

          console.log(`Created activity ${activity.id} for user ${user.id}`);
        }
      } catch (error) {
        console.error("Error fetching/storing activity:", error);
      }
    } else if (aspect_type === "update") {
      // Update existing activity
      try {
        const { getValidAccessToken } = await import("@/lib/strava");
        const accessToken = await getValidAccessToken(user.id);

        const activity = await getActivity(accessToken, object_id);
        const startDate = new Date(activity.start_date);

        await prisma.activity.updateMany({
          where: {
            userId: user.id,
            stravaActivityId: activity.id.toString(),
          },
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

        console.log(`Updated activity ${activity.id} for user ${user.id}`);
      } catch (error) {
        console.error("Error updating activity:", error);
      }
    } else if (aspect_type === "delete") {
      // Delete activity
      await prisma.activity.deleteMany({
        where: {
          userId: user.id,
          stravaActivityId: object_id.toString(),
        },
      });

      console.log(`Deleted activity ${object_id} for user ${user.id}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
