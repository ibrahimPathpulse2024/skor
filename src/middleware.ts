import { NextRequest, NextResponse } from "next/server";

const guestRoutes = ["/login", "/signup"];
const authRoutes = ["/games", "/profile", "/sharescreen"];
const DEFAULT_LOGIN = "/login";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const idToken = request.cookies.get("next-auth.session-token")?.value || null;

  // Handle guest routes (login/signup)
  if (guestRoutes.includes(path)) {
    if (idToken) {
      // Get redirect path from query parameter or default
      const fromUrl = request.nextUrl.searchParams.get("from");
      console.log("from url", fromUrl);
      const redirectPath = fromUrl || "/games";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (authRoutes.includes(path)) {
    if (!idToken) {
      // Redirect to login with original path as 'from' parameter
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
