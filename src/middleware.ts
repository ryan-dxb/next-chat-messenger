import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req, res) {
    const pathname = req.nextUrl.pathname;

    // Route Protection
    const isAuth = await getToken({ req });

    const isLoginPage = pathname.startsWith("/login");

    const sensitiveRoutes = ["/dashboard", "/dashboard/:path"];

    const isSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isLoginPage && isAuth)
      return NextResponse.redirect(new URL("/dashboard", req.url));

    if (!isAuth && isSensitiveRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/", "/login", "/dashboard/:path", "/dashboard"],
};
