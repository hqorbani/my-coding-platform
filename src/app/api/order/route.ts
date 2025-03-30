import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../database";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const projectName = formData.get("projectName") as string | null;
    const description = formData.get("description") as string | null;
    const projectType = formData.get("projectType") as string | null;
    const locale = formData.get("locale") as string | null;
    const timestamp = formData.get("timestamp") as string | null;
    const files = formData.getAll("files") as File[];

    if (!projectName || !projectType || !locale || !timestamp) {
      return NextResponse.json({ error: "فیلدهای ضروری پر نشده‌اند" }, { status: 400 });
    }

    // تغییر مسیر به پوشه خصوصی
    const uploadDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePaths: string[] = [];

    for (const file of files) {
      if (file instanceof File) {
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json({ error: "نوع فایل مجاز نیست" }, { status: 400 });
        }
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "حجم فایل بیش از حد مجاز است" }, { status: 400 });
        }

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        filePaths.push(`/uploads/${fileName}`);
      }
    }

    const db = await getDb();
    const result = await db.run(
      "INSERT INTO projects (projectName, description, files, projectType, locale, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
      [projectName, description, JSON.stringify(filePaths), projectType, locale, timestamp]
    );

    if (result && typeof result.lastID === "number" && result.lastID > 0) {
      return NextResponse.json({ message: "سفارش با موفقیت ثبت شد" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "خطا در ثبت سفارش" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in ORDER route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}