export const FLAGSHIP_SLUGS = [
  "archscene",
  "arremata-radar",
  "fullcommerce360",
] as const;

export type FlagshipSlug = (typeof FLAGSHIP_SLUGS)[number];
