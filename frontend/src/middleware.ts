import { NextResponse, NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const bypass = process.env.NEXT_PUBLIC_ALLOW_ADMIN_BYPASS === "true"
  const token = req.cookies.get("access_token")?.value || req.headers.get("authorization")?.replace("Bearer ", "")
  const role = req.cookies.get("role")?.value || req.headers.get("x-role") || "user"

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (bypass) return NextResponse.next()
    if (!token || role !== "admin") {
      const url = new URL("/login", req.url)
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Require login on checkout
  if (pathname.startsWith("/checkout")) {
    if (!token) {
      const url = new URL("/login", req.url)
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/checkout"],
}


