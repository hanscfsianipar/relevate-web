import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - /_next (Next.js internals)
    // - /studio (Sanity Studio)
    // - /api (API routes)
    // - files with extensions (e.g. favicon.ico)
    "/((?!_next|studio|api|upload|.*\\..*).*)",
  ],
};
