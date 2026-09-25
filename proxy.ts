import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.hostname !== "ibuild.alejandrocamara.info") return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/ibuild";
  return NextResponse.rewrite(url);
}

export const config = { matcher: "/" };
