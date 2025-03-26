import { NextRequest, NextResponse } from "next/server";

const locales = ["fa", "en"];
const defaultLocale = "fa";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware running for pathname:", pathname);
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    console.log("Pathname has locale, proceeding:", pathname);
    return NextResponse.next();
  }

  console.log("Redirecting to:", `/${defaultLocale}${pathname}`);
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};