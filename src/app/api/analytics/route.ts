import { NextResponse } from "next/server";
import {
  analyticsEventSchema,
  normalizeAnalyticsEvent,
} from "@/lib/analytics/schema";
import { persistAnalyticsEvent } from "@/lib/analytics/persistence";

const MAX_PAYLOAD_BYTES = 4_096;

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }

  let parsedBody: unknown = null;
  try {
    parsedBody = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "invalid event" }, { status: 400 });
  }

  const result = analyticsEventSchema.safeParse(parsedBody);
  if (!result.success) {
    return NextResponse.json({ error: "invalid event" }, { status: 400 });
  }

  const event = normalizeAnalyticsEvent(result.data);
  const persistence = await persistAnalyticsEvent(event);

  console.info(
    JSON.stringify({
      type: "portfolio-analytics",
      persistence: persistence.backend,
      ...event,
    }),
  );

  if (persistence.warning) {
    console.warn(
      JSON.stringify({
        type: "portfolio-analytics-persistence-warning",
        warning: persistence.warning,
        timestamp: event.timestamp,
      }),
    );
  }

  return new NextResponse(null, { status: 204 });
}
