import { NextRequest, NextResponse } from "next/server";
import {getDb} from "../../../database";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET_KEY);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { id } = await request.json();
  const db = await getDb();
  const project = await db.get("SELECT files FROM projects WHERE id = ?", [id]);

  if (project) {
    const filePaths = JSON.parse(project.files || "[]");
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
  if (result.changes > 0) {
    return NextResponse.json({ message: "سفارش با موفقیت حذف شد" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "خطا در حذف سفارش" }, { status: 400 });
  }
}