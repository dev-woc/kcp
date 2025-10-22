import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validations/application";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate the data
    const validatedData = applicationSchema.parse(body);

    // Check deadline
    const deadline = new Date("2025-11-16T23:59:59");
    if (new Date() > deadline) {
      return NextResponse.json(
        { error: "Application deadline has passed" },
        { status: 400 }
      );
    }

    // Check if user already has an application
    const existingApplication = await prisma.application.findFirst({
      where: { userId: session.user.id },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already submitted an application" },
        { status: 400 }
      );
    }

    // Create the application
    const { consentAccepted, ...applicationData } = validatedData;
    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        consentAccepted: true,
        consentAcceptedAt: new Date(),
        ...applicationData,
      },
    });

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const application = await prisma.application.findFirst({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Fetch application error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
