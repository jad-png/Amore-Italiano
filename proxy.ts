import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/sign-in")) {
    return;
  }

  const authState = await auth();

  if (!authState.userId) {
    return authState.redirectToSignIn({ returnBackUrl: request.url });
  }

  const metadata = (authState.sessionClaims as {
    metadata?: { role?: string };
  } | null)?.metadata;
  const isAdmin =
    authState.userId === process.env.ADMIN_USER_ID || metadata?.role === "admin";

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/admin/sign-in", request.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
