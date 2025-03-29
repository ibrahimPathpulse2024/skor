import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const guestRoutes = ["/login", "/signup"];
const authRoutes = ["/games"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = await getToken({ req: request });

  if (guestRoutes.includes(path)) {
    if (token) {
      return NextResponse.redirect(new URL("/games", request.url));
    }
    return NextResponse.next();
  }

  if (authRoutes.includes(path)) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/games"],
};
