// src/lib/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// تایپ مشخص برای payload
interface JwtPayload {
  id: number; // فعلاً فقط id رو می‌ذاریم چون تو login استفاده می‌شه
}

export function signToken(payload: JwtPayload, options: jwt.SignOptions = { expiresIn: "1h" }) {
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new Error("Invalid token");
  }
}