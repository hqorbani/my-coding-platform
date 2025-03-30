import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../database"; // بدون .ts

export async function POST(request: NextRequest) {
  try {
    const { id, projectName, projectType, description }: { id: number; projectName: string; projectType: string; description?: string } = await request.json();
    if (!id || !projectName || !projectType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.run(
      "UPDATE projects SET projectName = ?, projectType = ?, description = ? WHERE id = ?",
      [projectName, projectType, description || "", id]
    );

    if (result && typeof result.changes === "number" && result.changes > 0) {
      return NextResponse.json({ message: "پروژه با موفقیت ویرایش شد" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "پروژه پیدا نشد یا خطا در ویرایش" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error in EDIT route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}