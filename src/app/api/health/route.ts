import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "je4ndev-portfolio",
    timestamp: new Date().toISOString(),
  });
}
