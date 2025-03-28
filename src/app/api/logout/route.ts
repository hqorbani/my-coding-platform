const { NextResponse } = require("next/server");

async function POST() {
  const response = NextResponse.json({ message: "خروج موفقیت‌آمیز" }, { status: 200 });
  response.cookies.set("admin-auth", "", { path: "/", maxAge: 0 }); // پاک کردن کوکی
  return response;
}

module.exports = { POST };