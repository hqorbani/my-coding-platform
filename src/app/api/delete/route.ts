const { NextRequest, NextResponse } = require("next/server");
const { getDb } = require("../../../database");

async function POST(request) {
  const { id } = await request.json();

  const db = await getDb();
  const result = await db.run("DELETE FROM projects WHERE id = ?", [id]);

  if (result.changes > 0) {
    return NextResponse.json({ message: "سفارش با موفقیت حذف شد" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "خطا در حذف سفارش" }, { status: 400 });
  }
}

module.exports = { POST };