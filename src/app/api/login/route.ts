const { NextRequest, NextResponse } = require("next/server");
const { getDb } = require("../../../database");
const bcrypt = require("bcrypt");

async function POST(request) {
  const { username, password } = await request.json();

  const db = await getDb();
  const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);

  if (user && (await bcrypt.compare(password, user.password))) { // مقایسه رمز
    const response = NextResponse.json({ message: "ورود موفقیت‌آمیز | Login successful" }, { status: 200 });
    response.cookies.set("admin-auth", "supersecretpassword", { path: "/", maxAge: 3600 });
    return response;
  } else {
    return NextResponse.json({ error: "نام کاربری یا رمز اشتباه است | Invalid credentials" }, { status: 401 });
  }
}

module.exports = { POST };