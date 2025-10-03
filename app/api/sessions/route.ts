import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get all sessions for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      orderBy: { checkInTime: "desc" },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Fetch sessions error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST - Create a new session check-in
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionNumber, notes, therapistName } = body;

    if (!sessionNumber || sessionNumber < 1 || sessionNumber > 4) {
      return NextResponse.json(
        { error: "Invalid session number. Must be between 1 and 4." },
        { status: 400 }
      );
    }

    // Check if user has an approved application
    const application = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        status: "approved",
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "You must have an approved application to check in to sessions" },
        { status: 403 }
      );
    }

    // Check if this session number already exists
    const existingSession = await prisma.session.findFirst({
      where: {
        userId: session.user.id,
        sessionNumber: sessionNumber,
      },
    });

    if (existingSession) {
      return NextResponse.json(
        { error: `You have already checked in for session ${sessionNumber}` },
        { status: 400 }
      );
    }

    // Create the session check-in
    const newSession = await prisma.session.create({
      data: {
        userId: session.user.id,
        sessionNumber,
        notes: notes || null,
        therapistName: therapistName || null,
      },
    });

    return NextResponse.json({ session: newSession });
  } catch (error) {
    console.error("Session check-in error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
