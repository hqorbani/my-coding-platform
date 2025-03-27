import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const projectsFilePath = path.join(process.cwd(), "projects.json");

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log("Received project:", data);

  // خوندن فایل فعلی
  const fileContent = await fs.readFile(projectsFilePath, "utf-8");
  const projects = JSON.parse(fileContent);

  // اضافه کردن پروژه جدید
  projects.push({ ...data, timestamp: new Date().toISOString() });

  // نوشتن به فایل
  await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2));

  return NextResponse.json({ message: "پروژه با موفقیت دریافت شد | Project received successfully", data }, { status: 200 });
}