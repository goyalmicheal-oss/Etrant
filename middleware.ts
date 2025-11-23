import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

const publicRoutes = [
  "/",
  "/auth",
  "/pricing",
  "/how-it-works",
  "/privacy-policy",
  "/terms-and-conditions",
];

const protectedRoutes = [
  "/articles",
  "/ai-questions",
  "/leaderboard",
  "/subscription",
  "/user",
  "/interest",
  "/daily-digest",
  "/user-feedback",
  "/file-analyzer",
  "/groups",
];

// Routes that should be excluded from middleware processing
const excludedPaths = [
  "/_next",
  "/api/auth",
  "/favicon.ico",
  "/static",
  "/ingest",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for excluded paths
  if (excludedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Add security headers to response
  const response = NextResponse.next();

  // Add CSP header for additional security
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://us.i.posthog.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com; " +
    "frame-src https://checkout.razorpay.com;"
  );

  const session = await auth();

  // Logged-in users should not see public pages
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/articles", req.url));
  }

  // Guests should not see protected pages
  if (!session && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return response;
}

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

