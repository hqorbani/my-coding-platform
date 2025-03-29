import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../database";

async function POST(request: NextRequest) {
  const { id, projectName, projectType, description } = await request.json();

  const db = await getDb();
  const result = await db.run(
    "UPDATE projects SET projectName = ?, projectType = ?, description = ? WHERE id = ?",
    [projectName, projectType, description, id]
  );

  if (result.changes > 0) {
    return NextResponse.json({ message: "پروژه با موفقیت ویرایش شد" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "خطا در ویرایش پروژه" }, { status: 400 });
  }
}

module.exports = { POST };