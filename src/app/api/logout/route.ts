// src/app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  response.cookies.set("jwt_token", "", {
    maxAge: 0, // حذف کوکی
    path: "/",
  });
  return response;
}