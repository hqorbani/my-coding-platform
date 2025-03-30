import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../database"; // بدون .ts
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!SECRET_KEY) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY);

    const { id, title, description, projectType }: { id: number; title: string; description?: string; projectType: string } = await request.json();
    if (!id || !title || !projectType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.run(
      "UPDATE portfolio SET title = ?, description = ?, projectType = ? WHERE id = ?",
      [title, description || "", projectType, id]
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