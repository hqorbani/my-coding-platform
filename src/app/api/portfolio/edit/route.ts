const { NextRequest, NextResponse } = require("next/server");
const { getDb } = require("../../../../database");

async function POST(request) {
  const { id, title, description, projectType } = await request.json();

  const db = await getDb();
  const result = await db.run(
    "UPDATE portfolio SET title = ?, description = ?, projectType = ? WHERE id = ?",
    [title, description, projectType, id]
  );

  if (result.changes > 0) {
    return NextResponse.json({ message: "نمونه‌کار با موفقیت ویرایش شد" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "خطا در ویرایش نمونه‌کار" }, { status: 400 });
  }
}

module.exports = { POST };