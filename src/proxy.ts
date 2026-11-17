import { NextResponse, type NextRequest } from "next/server";

/** Old cdl1000.com URLs → new routes (exact, case-sensitive match). */
const legacy: Record<string, string> = {
  "/Home": "/",
  "/Truckload": "/truckload",
  "/Drayage": "/drayage",
  "/Carriers": "/carriers",
  "/Agency": "/agency",
  "/Technology": "/technology",
  "/Career": "/careers",
  "/Contacts": "/contact",
  "/Apply": "/apply",
  "/Login": "/login",
  "/privacy-policy": "/legal/privacy",
  "/terms-and-conditions": "/legal/terms",
  "/code-of-ethics": "/legal/code-of-ethics",
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const target = legacy[pathname];
  if (target) return NextResponse.redirect(new URL(target, req.url), 308);

  // Optimistic check only — the page verifies the signed cookie itself.
  if (pathname.startsWith("/dashboard") && !req.cookies.has("cdl_session")) {
    const login = new URL("/login", req.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  // Must be static. Keep in sync with `legacy` above.
  matcher: [
    "/dashboard/:path*",
    "/Home",
    "/Truckload",
    "/Drayage",
    "/Carriers",
    "/Agency",
    "/Technology",
    "/Career",
    "/Contacts",
    "/Apply",
    "/Login",
    "/privacy-policy",
    "/terms-and-conditions",
    "/code-of-ethics",
  ],
};
