import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../database";

export async function POST(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const db = await getDb();
  await db.run("DELETE FROM projects WHERE id = ?", [id]);

  return NextResponse.json({ message: "پروژه حذف شد | Project deleted" }, { status: 200 });
}