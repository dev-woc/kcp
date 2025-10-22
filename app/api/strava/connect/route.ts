import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getStravaAuthUrl } from "@/lib/strava";

/**
 * GET /api/strava/connect
 * Initiates Strava OAuth flow
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the base URL from the request
    const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const redirectUri = `${baseUrl}/api/strava/callback`;

    // Use user ID as state for security
    const state = session.user.id;

    const authUrl = getStravaAuthUrl(redirectUri, state);

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error("Error initiating Strava connect:", error);
    return NextResponse.json(
      { error: "Failed to initiate Strava connection" },
      { status: 500 }
    );
  }
}
