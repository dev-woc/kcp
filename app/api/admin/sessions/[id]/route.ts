import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update session (verify, add notes, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { verified, adminNotes, therapistName } = body;

    const updatedSession = await prisma.session.update({
      where: { id: params.id },
      data: {
        verified: verified !== undefined ? verified : undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
        therapistName: therapistName !== undefined ? therapistName : undefined,
      },
    });

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error("Update session error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a session
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.session.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete session error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
