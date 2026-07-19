import { z } from "zod";

const localizedTextSchema = z.object({
  en: z.string().min(1),
  pt: z.string().min(1),
});

const projectLinkSchema = z.string().url().optional();

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  description: localizedTextSchema,
  shortDescription: localizedTextSchema,
  longDescription: localizedTextSchema,
  status: z.enum(["live", "mvp", "development", "case", "internal", "demo"]),
  role: z.enum([
    "client-saas",
    "internal-tool",
    "agency-platform",
    "open-source",
    "game-social",
    "web3-audit",
    "ai-render",
  ]),
  audience: z.array(z.string().min(1)).min(1),
  proofLevel: z.enum(["public-live", "public-demo", "private-demo", "internal", "case-only"]),
  visualKind: z.enum([
    "product-screenshot",
    "ai-render",
    "dashboard",
    "terminal",
    "video-demo",
    "mixed",
    "branding",
    "github-repo",
  ]),
  scope: localizedTextSchema,
  dateRange: z.union([z.string().min(1), localizedTextSchema]),
  category: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  technologies: z.array(z.string().min(1)).min(1),
  problem: localizedTextSchema,
  solution: localizedTextSchema,
  metrics: z.array(
    z.object({
      value: z.string().min(1),
      label: localizedTextSchema,
      color: z.string().min(1),
      verified: z.boolean(),
    }),
  ).min(1),
  links: z.object({
    live: projectLinkSchema,
    github: projectLinkSchema,
    docs: projectLinkSchema,
    changelog: projectLinkSchema,
    status: projectLinkSchema,
  }),
  primaryCta: z.enum(["live", "github", "docs", "contact", "none"]),
  image: z.string().startsWith("/").optional(),
  coverImage: z.string().startsWith("/").optional(),
  assetReview: z.object({
    status: z.enum(["approved", "needs-recapture", "private-demo", "editorial-only"]),
    sourceUrl: z.string().url().optional(),
    reviewedAt: z.string().date().optional(),
    note: localizedTextSchema,
  }),
  video: z.string().startsWith("/").optional(),
  gallery: z.array(
    z.object({
      src: z.string().startsWith("/"),
      title: localizedTextSchema,
      description: localizedTextSchema,
    }),
  ).optional(),
  gradient: z.string().optional(),
  featured: z.boolean().optional(),
  casePriority: z.number().int().min(1),
});

export const projectCollectionSchema = z.array(projectSchema).min(1);
