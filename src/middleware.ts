import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasAdminAccess } from "@/app/lib/auth/admin";

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute = pathname.startsWith("/simulator") || pathname.startsWith("/lesson");
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminUnauthorizedPage = pathname === "/admin/unauthorized";
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  const { userId, orgRole, sessionClaims } = await auth();

  if (!userId && (isAdminRoute || isProtectedRoute)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_url", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (!isAdminRoute) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (isAdminUnauthorizedPage) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (!hasAdminAccess({ orgRole, sessionClaims })) {
    return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
