import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../database";
import { signToken } from "../../../lib/jwt";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  const db = await getDb();
  const user = await db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = signToken({ id: user.id });
  const response = NextResponse.json({ token }, { status: 200 });
  response.cookies.set("jwt_token", token, {
    httpOnly: true,
    maxAge: 60 * 60,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}