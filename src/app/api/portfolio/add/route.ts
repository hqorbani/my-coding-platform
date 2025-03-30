import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../database";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("Content-Type") || "unknown";
    console.log("Received Content-Type:", contentType);
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: `Content-Type must be multipart/form-data, received: ${contentType}` },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const projectType = formData.get("projectType") as string | null;
    const timestamp = formData.get("timestamp") as string | null;
    const files = formData.getAll("files") as File[];

    if (!title || !projectType || !timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // آپلود فایل‌ها
    const uploadDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePaths: string[] = [];

    for (const file of files) {
      if (file instanceof File) {
        const allowedTypes = ["image/jpeg", "image/png"]; // بعداً می‌تونی تغییر بدی
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json({ error: "نوع فایل مجاز نیست" }, { status: 400 });
        }
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "حجم فایل بیش از 5 مگابایت است" }, { status: 400 });
        }

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        filePaths.push(`/uploads/${fileName}`);
      }
    }

    const db = await getDb();
    const result = await db.run(
      "INSERT INTO portfolio (title, description, projectType, files, timestamp) VALUES (?, ?, ?, ?, ?)",
      [title, description || "", projectType, JSON.stringify(filePaths), timestamp]
    );

    if (result && typeof result.lastID === "number" && result.lastID > 0) {
      return NextResponse.json(
        { id: result.lastID, title, description, projectType, files: filePaths, timestamp },
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