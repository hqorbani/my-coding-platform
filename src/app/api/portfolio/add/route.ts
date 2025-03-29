import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../database";

async function POST(request: NextRequest) {
  const { title, description, projectType, timestamp } = await request.json();

  const db = await getDb();
  const result = await db.run(
    "INSERT INTO portfolio (title, description, projectType, timestamp) VALUES (?, ?, ?, ?)",
    [title, description, projectType, timestamp]
  );

  if (result.lastID) {
    return NextResponse.json({ id: result.lastID, title, description, projectType, timestamp }, { status: 200 });
  } else {
    return NextResponse.json({ error: "خطا در افزودن نمونه‌کار" }, { status: 400 });
  }
}

module.exports = { POST };