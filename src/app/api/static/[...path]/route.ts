import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    // مسیر بعد از /api/static/ رو می‌گیریم
    const filePathSegments = pathname.replace("/api/static/", "").split("/");
    const filePath = path.join(process.cwd(), ...filePathSegments);
    console.log("Serving file:", filePath); // دیباگ
    const fileBuffer = await fs.readFile(filePath);
    const mimeType = filePath.endsWith(".png") ? "image/png" : filePath.endsWith(".jpg") ? "image/jpeg" : "application/octet-stream";
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

export const dynamic = "force-dynamic"; // روت داینامیک