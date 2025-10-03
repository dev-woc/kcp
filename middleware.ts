export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/apply/:path*", "/admin/:path*"],
};
