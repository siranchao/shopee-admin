import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/api/:path*"]
});
 
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", 
    "/", 
    "/(api|trpc)(.*)",
    "/api/:path*"
  ]
};
 

export function middleware() {
  // retrieve the current response
  const res = NextResponse.next()

  // add the CORS headers to the response
  res.headers.append('Access-Control-Allow-Origin', '*')
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  res.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return res
}
