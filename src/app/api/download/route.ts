import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request: NextRequest) {
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

  const url = new URL(request.url);
  const filePath = url.searchParams.get("file");
  if (!filePath || !filePath.startsWith("/uploads/")) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  const absolutePath = path.join(process.cwd(), "uploads", path.basename(filePath));
  try {
    const fileBuffer = await fs.readFile(absolutePath);
    const fileName = path.basename(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}