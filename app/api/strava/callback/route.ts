import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeCodeForToken } from "@/lib/strava";

/**
 * GET /api/strava/callback
 * Handles Strava OAuth callback
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // This is the user ID
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/dashboard?strava_error=access_denied", req.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard?strava_error=missing_params", req.url)
    );
  }

  try {
    // Exchange code for tokens
    const data = await exchangeCodeForToken(code);

    // Update user with Strava credentials
    await prisma.user.update({
      where: { id: state },
      data: {
        stravaAthleteId: data.athlete.id.toString(),
        stravaAccessToken: data.access_token,
        stravaRefreshToken: data.refresh_token,
        stravaTokenExpiry: new Date(data.expires_at * 1000),
        stravaConnectedAt: new Date(),
      },
    });

    // Redirect back to dashboard with success message
    return NextResponse.redirect(
      new URL("/dashboard?strava_connected=true", req.url)
    );
  } catch (error) {
    console.error("Error handling Strava callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard?strava_error=connection_failed", req.url)
    );
  }
}
