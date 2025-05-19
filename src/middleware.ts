import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { adminAuthMiddleware } from "./utils/supabase/admin-middleware";

export async function middleware(request: NextRequest) {
  // Update session first
  const sessionResponse = await updateSession(request);
  if (sessionResponse) return sessionResponse;

  // // Check if the request is for an admin API endpoint
  // if (request.nextUrl.pathname.startsWith("/api/admin")) {
  //   return await adminAuthMiddleware(request);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
