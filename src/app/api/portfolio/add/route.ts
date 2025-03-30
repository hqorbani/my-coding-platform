import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../database"; // بدون .ts

export async function POST(request: NextRequest) {
  try {
    const { title, description, projectType, timestamp }: { title: string; description?: string; projectType: string; timestamp: string } = await request.json();
    if (!title || !projectType || !timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.run(
      "INSERT INTO portfolio (title, description, projectType, timestamp) VALUES (?, ?, ?, ?)",
      [title, description || "", projectType, timestamp]
    );

    if (result && typeof result.lastID === "number" && result.lastID > 0) {
      return NextResponse.json(
        { id: result.lastID, title, description, projectType, timestamp },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "خطا در افزودن نمونه‌کار" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in ADD portfolio route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}