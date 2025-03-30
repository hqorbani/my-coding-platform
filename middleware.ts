// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./src/lib/jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("jwt_token")?.value;

  if (pathname.startsWith("/fa/admin") || pathname.startsWith("/en/admin")) {
    if (!token) {
      const locale = pathname.startsWith("/fa") ? "fa" : "en";
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
    try {
      verifyToken(token);
    } catch {
      const locale = pathname.startsWith("/fa") ? "fa" : "en";
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:locale/admin"],
};