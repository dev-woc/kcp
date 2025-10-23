import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all users with aggregated data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        stravaAthleteId: true,
        stravaConnectedAt: true,
        applications: {
          select: {
            id: true,
            status: true,
            submittedAt: true,
          },
        },
        sessions: {
          select: {
            id: true,
          },
        },
        activities: {
          select: {
            id: true,
            distance: true,
          },
        },
        journalEntries: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data to include counts
    const usersWithStats = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      stravaConnected: !!user.stravaAthleteId,
      stravaConnectedAt: user.stravaConnectedAt,
      applicationStatus: user.applications[0]?.status || "none",
      applicationSubmittedAt: user.applications[0]?.submittedAt || null,
      totalSessions: user.sessions.length,
      totalActivities: user.activities.length,
      totalDistance: user.activities.reduce((sum, a) => sum + a.distance, 0) * 0.000621371, // Convert to miles
      totalJournalEntries: user.journalEntries.length,
    }));

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
