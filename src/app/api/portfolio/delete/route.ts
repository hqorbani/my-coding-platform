import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../database"; // بدون .ts

export async function POST(request: NextRequest) {
  try {
    const { id }: { id: number } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.run("DELETE FROM portfolio WHERE id = ?", [id]);

    if (result && typeof result.changes === "number" && result.changes > 0) {
      return NextResponse.json({ message: "نمونه‌کار با موفقیت حذف شد" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "نمونه‌کار پیدا نشد یا خطا در حذف" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error in DELETE portfolio route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}