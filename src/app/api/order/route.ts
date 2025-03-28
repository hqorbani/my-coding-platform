const { NextRequest, NextResponse } = require("next/server");
const { getDb } = require("../../../database");
const fs = require("fs").promises;
const path = require("path");

export async function POST(request) {
  const formData = await request.formData();
  const projectName = formData.get("projectName");
  const description = formData.get("description");
  const projectType = formData.get("projectType");
  const locale = formData.get("locale");
  const timestamp = formData.get("timestamp");
  const files = formData.getAll("files");

  // اعتبارسنجی ورودی‌ها
  if (!projectName || !projectType || !locale || !timestamp) {
    return NextResponse.json({ error: "فیلدهای ضروری پر نشده‌اند" }, { status: 400 });
  }

  // مدیریت آپلود فایل‌ها
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePaths = [];

  for (const file of files) {
    if (file instanceof File) {
      // محدودیت نوع فایل (مثلاً فقط PDF و تصویر)
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "نوع فایل مجاز نیست" }, { status: 400 });
      }
      // محدودیت اندازه (مثلاً حداکثر 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "حجم فایل بیش از حد مجاز است" }, { status: 400 });
      }

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
      filePaths.push(`/uploads/${fileName}`);
    }
  }

  // ذخیره توی دیتابیس
  const db = await getDb();
  const result = await db.run(
    "INSERT INTO projects (projectName, description, files, projectType, locale, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
    [projectName, description, JSON.stringify(filePaths), projectType, locale, timestamp]
  );

  if (result.lastID) {
    return NextResponse.json({ message: "سفارش با موفقیت ثبت شد" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "خطا در ثبت سفارش" }, { status: 500 });
  }
}