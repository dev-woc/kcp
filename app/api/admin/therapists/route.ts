import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");

    const where = isActive === "true" ? { isActive: true } : isActive === "false" ? { isActive: false } : {};

    const therapists = await prisma.therapist.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ therapists });
  } catch (error) {
    console.error("Fetch therapists error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, specialization, licenseNumber, bio } = body;

    if (!name || !email || !phone || !specialization) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if therapist with email already exists
    const existingTherapist = await prisma.therapist.findUnique({
      where: { email },
    });

    if (existingTherapist) {
      return NextResponse.json(
        { error: "Therapist with this email already exists" },
        { status: 400 }
      );
    }

    const therapist = await prisma.therapist.create({
      data: {
        name,
        email,
        phone,
        specialization,
        licenseNumber: licenseNumber || null,
        bio: bio || null,
      },
    });

    return NextResponse.json({ therapist });
  } catch (error) {
    console.error("Create therapist error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
