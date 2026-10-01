export const FLAGSHIP_SLUGS = [
  "mepmail",
  "archscene",
  "fullcommerce360",
  "urlpivot",
] as const;

export type FlagshipSlug = (typeof FLAGSHIP_SLUGS)[number];
