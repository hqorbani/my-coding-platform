import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  if (username === "admin" && password === "123") {
    const token = jwt.sign({ username: "admin" }, SECRET_KEY, { expiresIn: "1h" });
    return NextResponse.json({ token }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}