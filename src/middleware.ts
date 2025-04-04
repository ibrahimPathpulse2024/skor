import { NextRequest, NextResponse } from "next/server";

const guestRoutes = ["/login", "/signup"];
const authRoutes = ["/games", "/profile", "/sharescreen"];
const DEFAULT_LOGIN = "/login";
const AUTH_CALLBACK_PATTERN = /\/api\/auth\/signin\//;

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const idToken = request.cookies.get("next-auth.session-token")?.value || null;

  // Handle guest routes (login/signup)
  if (guestRoutes.includes(path)) {
    if (idToken) {
      let fromUrl = request.nextUrl.searchParams.get("from");

      // Check if coming from auth provider callback
      if (fromUrl && AUTH_CALLBACK_PATTERN.test(fromUrl)) {
        return NextResponse.redirect(new URL("/profile", request.url));
      }

      // Default redirect logic
      const redirectPath = fromUrl || "/games";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (authRoutes.includes(path)) {
    if (!idToken) {
      const loginUrl = new URL(DEFAULT_LOGIN, request.url);
      loginUrl.searchParams.set("from", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/games", "/profile", "/sharescreen"],
};
