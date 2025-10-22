import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/journal
 * Save a journal entry
 */
export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prompt, category, entry } = body;

    if (!prompt || !category || !entry) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate word count
    const wordCount = entry.trim().split(/\s+/).length;

    // Save journal entry
    const journalEntry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        prompt,
        category,
        entry,
        wordCount,
      },
    });

    return NextResponse.json({ success: true, journalEntry });
  } catch (error) {
    console.error("Error saving journal entry:", error);
    return NextResponse.json(
      { error: "Failed to save journal entry" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/journal
 * Get journal entries for the current user
 */
export async function GET() {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        prompt: true,
        category: true,
        entry: true,
        wordCount: true,
        createdAt: true,
      },
    });

    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, e) => sum + e.wordCount, 0);

    return NextResponse.json({
      entries,
      totalEntries,
      totalWords,
    });
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    );
  }
}
