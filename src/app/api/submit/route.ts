import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../database";

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log("Received project:", data);

  const db = await getDb();
  await db.run(
    "INSERT INTO projects (projectName, projectType, locale, timestamp) VALUES (?, ?, ?, ?)",
    [data.projectName, data.projectType, data.locale, new Date().toISOString()]
  );

  return NextResponse.json(
    { message: "پروژه با موفقیت دریافت شد | Project received successfully", data },
    { status: 200 }
  );
}