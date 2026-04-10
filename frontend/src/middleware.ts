import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // public 경로는 통과
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 쿠키에서 토큰 확인
  const token = req.cookies.get("onetask_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // /admin은 마스터 쿠키 확인
  if (pathname.startsWith("/admin")) {
    const isMaster = req.cookies.get("onetask_is_master")?.value;
    if (isMaster !== "true") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.png).*)"],
};
