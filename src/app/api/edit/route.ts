// src/app/api/edit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../database"; // مسیر درست نسبت به src/app/api/edit
import { verifyToken } from "../../../lib/jwt"; // مسیر نسبت به src/app/api/edit

export async function POST(request: NextRequest) {
  // چک کردن توکن
  const token = request.cookies.get("jwt_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    verifyToken(token); // استفاده از تابع متمرکز
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // منطق اصلی
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