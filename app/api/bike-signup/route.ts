import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      instagramHandle,
      rideGroup,
      needsBikeRental,
      driversLicenseUrl,
      generalConsentAccepted,
      generalConsentAcceptedAt,
      rentalConsentAccepted,
      rentalConsentAcceptedAt,
    } = body;

    // Validate required fields
    if (!name || !email || !rideGroup) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!generalConsentAccepted) {
      return NextResponse.json(
        { error: "You must accept the general waiver" },
        { status: 400 }
      );
    }

    if (needsBikeRental && !driversLicenseUrl) {
      return NextResponse.json(
        { error: "Driver's license is required for bike rental" },
        { status: 400 }
      );
    }

    if (needsBikeRental && !rentalConsentAccepted) {
      return NextResponse.json(
        { error: "You must accept the rental agreement" },
        { status: 400 }
      );
    }

    // Create the bike signup record
    const bikeSignup = await prisma.bikeSignup.create({
      data: {
        name,
        email,
        instagramHandle: instagramHandle || null,
        rideGroup,
        needsBikeRental: needsBikeRental || false,
        driversLicenseUrl: driversLicenseUrl || null,
        generalConsentAccepted,
        generalConsentAcceptedAt: generalConsentAcceptedAt ? new Date(generalConsentAcceptedAt) : null,
        rentalConsentAccepted: rentalConsentAccepted || false,
        rentalConsentAcceptedAt: rentalConsentAcceptedAt ? new Date(rentalConsentAcceptedAt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      signupId: bikeSignup.id,
    });
  } catch (error) {
    console.error("Bike signup error:", error);
    return NextResponse.json(
      { error: "Failed to submit signup" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve signups (for admin use)
export async function GET(req: NextRequest) {
  try {
    const signups = await prisma.bikeSignup.findMany({
      orderBy: {
        submittedAt: "desc",
      },
    });

    return NextResponse.json({ signups });
  } catch (error) {
    console.error("Error fetching bike signups:", error);
    return NextResponse.json(
      { error: "Failed to fetch signups" },
      { status: 500 }
    );
  }
}
