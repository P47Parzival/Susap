import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has("session");

  // Public paths that don't require authentication
  const publicPaths = ["/sign-up", "/sign-in"];
  const isPublicPath = publicPaths.includes(pathname);

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to sign-up page
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 