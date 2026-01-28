import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

// GET - Fetch all rides (public) or with admin filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming") === "true";
    const completed = searchParams.get("completed");

    const where: { date?: { gte: Date }; isCompleted?: boolean } = {};

    if (upcoming) {
      where.date = { gte: new Date() };
    }

    if (completed !== null) {
      where.isCompleted = completed === "true";
    }

    const rides = await prisma.ride.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return NextResponse.json(rides);
  } catch (error) {
    console.error("Error fetching rides:", error);
    return NextResponse.json(
      { error: "Failed to fetch rides" },
      { status: 500 }
    );
  }
}

// POST - Create a new ride (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { rideNumber, date, location, checkInTime, rideTime, description, isSpecialEvent } = body;

    if (!rideNumber || !date || !location || !checkInTime || !rideTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const ride = await prisma.ride.create({
      data: {
        rideNumber: parseInt(rideNumber),
        date: new Date(date),
        location,
        checkInTime,
        rideTime,
        description: description || null,
        isSpecialEvent: isSpecialEvent || false,
      },
    });

    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    console.error("Error creating ride:", error);
    return NextResponse.json(
      { error: "Failed to create ride" },
      { status: 500 }
    );
  }
}

// PATCH - Update a ride (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Ride ID is required" },
        { status: 400 }
      );
    }

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    if (updateData.rideNumber) {
      updateData.rideNumber = parseInt(updateData.rideNumber);
    }

    const ride = await prisma.ride.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(ride);
  } catch (error) {
    console.error("Error updating ride:", error);
    return NextResponse.json(
      { error: "Failed to update ride" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a ride (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Ride ID is required" },
        { status: 400 }
      );
    }

    await prisma.ride.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ride:", error);
    return NextResponse.json(
      { error: "Failed to delete ride" },
      { status: 500 }
    );
  }
}
