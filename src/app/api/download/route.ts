const { NextRequest, NextResponse } = require("next/server");
const { cookies } = require("next/headers");
const fs = require("fs").promises;
const path = require("path");

export async function GET(request) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin-auth");

  if (!authCookie || authCookie.value !== "supersecretpassword") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const filePath = url.searchParams.get("file");
  if (!filePath || !filePath.startsWith("/uploads/")) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  const absolutePath = path.join(process.cwd(), "uploads", path.basename(filePath));
  try {
    const fileBuffer = await fs.readFile(absolutePath);
    const fileName = path.basename(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}