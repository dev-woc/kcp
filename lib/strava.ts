import { prisma } from "./prisma";

const STRAVA_API_URL = "https://www.strava.com/api/v3";
const STRAVA_OAUTH_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  profile: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  average_speed?: number;
  max_speed?: number;
}

/**
 * Get Strava OAuth authorization URL
 */
export function getStravaAuthUrl(redirectUri: string, state?: string): string {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "read,activity:read_all",
    state: state || "",
  });

  return `${STRAVA_OAUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string
): Promise<StravaTokens & { athlete: StravaAthlete }> {
  const response = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  return response.json();
}

/**
 * Refresh an expired access token
 */
export async function refreshStravaToken(
  refreshToken: string
): Promise<StravaTokens> {
  const response = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
}

/**
 * Get valid access token for a user, refreshing if necessary
 */
export async function getValidAccessToken(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stravaAccessToken: true,
      stravaRefreshToken: true,
      stravaTokenExpiry: true,
    },
  });

  if (!user?.stravaAccessToken || !user?.stravaRefreshToken) {
    throw new Error("User has not connected Strava");
  }

  // Check if token is expired (with 5 minute buffer)
  const now = new Date();
  const expiryDate = user.stravaTokenExpiry || new Date(0);
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (expiryDate.getTime() - now.getTime() < bufferTime) {
    // Token is expired or about to expire, refresh it
    const tokens = await refreshStravaToken(user.stravaRefreshToken);

    // Update user with new tokens
    await prisma.user.update({
      where: { id: userId },
      data: {
        stravaAccessToken: tokens.access_token,
        stravaRefreshToken: tokens.refresh_token,
        stravaTokenExpiry: new Date(tokens.expires_at * 1000),
      },
    });

    return tokens.access_token;
  }

  return user.stravaAccessToken;
}

/**
 * Get athlete details from Strava
 */
export async function getAthleteDetails(
  accessToken: string
): Promise<StravaAthlete> {
  const response = await fetch(`${STRAVA_API_URL}/athlete`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch athlete details");
  }

  return response.json();
}

/**
 * Get athlete activities from Strava
 */
export async function getAthleteActivities(
  accessToken: string,
  after?: number,
  before?: number,
  page: number = 1,
  perPage: number = 30
): Promise<StravaActivity[]> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (after) params.append("after", after.toString());
  if (before) params.append("before", before.toString());

  const response = await fetch(
    `${STRAVA_API_URL}/athlete/activities?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  return response.json();
}

/**
 * Get a specific activity from Strava
 */
export async function getActivity(
  accessToken: string,
  activityId: number
): Promise<StravaActivity> {
  const response = await fetch(`${STRAVA_API_URL}/activities/${activityId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch activity");
  }

  return response.json();
}

/**
 * Check if an activity is a Wednesday ride
 */
export function isWednesdayRide(startDate: Date): boolean {
  return startDate.getDay() === 3; // 3 = Wednesday
}

/**
 * Convert meters to miles
 */
export function metersToMiles(meters: number): number {
  return meters * 0.000621371;
}

/**
 * Convert meters to feet
 */
export function metersToFeet(meters: number): number {
  return meters * 3.28084;
}

/**
 * Convert meters per second to miles per hour
 */
export function mpsToMph(mps: number): number {
  return mps * 2.23694;
}

/**
 * Format seconds to HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
