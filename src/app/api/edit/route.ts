const { NextRequest, NextResponse } = require("next/server");
const { getDb } = require("../../../database");

async function POST(request) {
  const { id, projectName, projectType } = await request.json();

  const db = await getDb();
  const result = await db.run(
    "UPDATE projects SET projectName = ?, projectType = ? WHERE id = ?",
    [projectName, projectType, id]
  );

  if (result.changes > 0) {
    return NextResponse.json({ message: "پروژه با موفقیت ویرایش شد" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "خطا در ویرایش پروژه" }, { status: 400 });
  }
}

module.exports = { POST };