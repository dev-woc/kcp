import { auth } from "@/lib/auth";

export default auth((req) => {
  // Auth middleware will protect these routes
  const isAuthenticated = !!req.auth;

  if (!isAuthenticated) {
    const url = new URL("/login", req.url);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/home/:path*", "/dashboard/:path*", "/apply/:path*", "/admin/:path*"],
};
