import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Better Auth session cookie names (local and production secure variants)
  const sessionToken = request.cookies.get("better-auth.session_token") || 
                       request.cookies.get("__Secure-better-auth.session_token") ||
                       request.cookies.get("better-auth.session_token_sec") ||
                       request.cookies.get("__better-auth-session-token");
  
  const { pathname } = request.nextUrl;

  // 1. Protect Dashboard UI Routes
  if (pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // 2. Protect Admin API Routes (CMS & Management)
  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/setup") {
      return NextResponse.next();
    }

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized access to admin API" }, 
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// Optimization: Only run proxy on dashboard and admin API routes
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/api/admin/:path*"
  ],
};
