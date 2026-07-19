import { NextResponse } from "next/server";
import { z } from "zod";

const analyticsEventSchema = z.object({
  event: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  path: z.string().min(1).max(256).startsWith("/"),
  project: z.string().max(64).regex(/^[a-z0-9-]+$/).optional(),
  cta: z.string().max(64).regex(/^[a-z0-9-]+$/).optional(),
  locale: z.enum(["pt", "en"]).optional(),
});

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4_096) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }

  const result = analyticsEventSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "invalid event" }, { status: 400 });
  }

  console.info(
    JSON.stringify({
      type: "portfolio-analytics",
      timestamp: new Date().toISOString(),
      ...result.data,
    }),
  );

  return new NextResponse(null, { status: 204 });
}
