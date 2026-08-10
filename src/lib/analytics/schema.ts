import { z } from "zod";

const tokenSchema = z
  .string()
  .min(1)
  .max(96)
  .regex(/^[a-z0-9][a-z0-9._-]*$/);

const pathSchema = z.string().min(1).max(256).startsWith("/");

export const analyticsEventSchema = z
  .object({
    event: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
    path: pathSchema,
    pageType: z.enum(["home", "service", "project", "other"]).optional(),
    project: tokenSchema.optional(),
    service: tokenSchema.optional(),
    offer: tokenSchema.optional(),
    cta: tokenSchema.optional(),
    ctaLabel: z.string().trim().min(1).max(96).optional(),
    locale: z.enum(["pt", "en"]).optional(),
    source: tokenSchema.optional(),
    medium: tokenSchema.optional(),
    campaign: tokenSchema.optional(),
    content: tokenSchema.optional(),
    landingPath: pathSchema.optional(),
    referrerHost: z
      .string()
      .min(1)
      .max(253)
      .regex(/^[a-z0-9.-]+$/)
      .optional(),
    channel: z
      .enum(["whatsapp", "email", "github", "linkedin", "internal", "website", "other"])
      .optional(),
    destinationHost: z
      .string()
      .min(1)
      .max(253)
      .regex(/^[a-z0-9.-]+$/)
      .optional(),
    destinationPath: pathSchema.optional(),
  })
  .strict();

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

export type StoredAnalyticsEvent = AnalyticsEventInput & {
  timestamp: string;
  pageType: NonNullable<AnalyticsEventInput["pageType"]>;
  source: string;
  medium: string;
  landingPath: string;
};

export function normalizeAnalyticsEvent(
  input: AnalyticsEventInput,
  timestamp = new Date().toISOString(),
): StoredAnalyticsEvent {
  return {
    pageType: "other",
    source: "unknown",
    medium: "unknown",
    landingPath: input.path,
    ...input,
    timestamp,
  };
}
