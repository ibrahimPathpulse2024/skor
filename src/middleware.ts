import { NextRequest, NextResponse } from "next/server";

const guestRoutes = ["/login", "/signup"];
const authRoutes = ["/games", "/profile"];
const DEFAULT_LOGIN = "/login";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const idToken = request.cookies.get("next-auth.session-token")?.value || null;

  // Debug logging (remove in production)
  console.log("Middleware triggered for:", path);
  console.log("Token exists:", !!idToken);

  // Redirect logged-in users from auth pages
  if (guestRoutes.includes(path)) {
    if (idToken) {
      console.log("Redirecting authenticated user from", path, "to /games");
      return NextResponse.redirect(new URL("/games", request.url));
    }
    return NextResponse.next();
  }

  // Protect authenticated routes
  if (authRoutes.includes(path)) {
    if (!idToken) {
      console.log("Redirecting unauthenticated user from", path, "to login");
      return NextResponse.redirect(new URL(DEFAULT_LOGIN, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/games", "/profile"],
};
