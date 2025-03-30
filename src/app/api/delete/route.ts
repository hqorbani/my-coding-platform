import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../database";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

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

    const { id }: { id: number } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const db = await getDb();
    const project = await db.get<{ files: string }>("SELECT files FROM projects WHERE id = ?", [id]);

    if (project) {
      const filePaths: string[] = JSON.parse(project.files || "[]");
      for (const filePath of filePaths) {
        const absolutePath = path.join(process.cwd(), "uploads", path.basename(filePath));
        try {
          await fs.unlink(absolutePath);
        } catch (error) {
          console.error(`Failed to delete file ${absolutePath}:`, error);
        }
      }
    }

    const result = await db.run("DELETE FROM projects WHERE id = ?", [id]);
    if (result && typeof result.changes === "number" && result.changes > 0) {
      return NextResponse.json({ message: "سفارش با موفقیت حذف شد" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "سفارش پیدا نشد یا خطا در حذف" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error in DELETE route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}