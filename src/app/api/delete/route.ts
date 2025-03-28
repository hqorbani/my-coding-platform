const { NextRequest, NextResponse } = require("next/server");
const { getDb } = require("../../../database");
const fs = require("fs").promises;
const path = require("path");

async function POST(request) {
  const { id } = await request.json();

  const db = await getDb();
  const project = await db.get("SELECT files FROM projects WHERE id = ?", [id]);
  
  if (project) {
    // پاک کردن فایل‌ها از دیسک
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

module.exports = { POST };