#!/usr/bin/env tsx

import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const token = z.string().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/).max(96);

const linkSchema = z.object({
  id: token,
  locale: z.enum(["pt", "en"]),
  channel: token,
  destination: token,
  source: token,
  medium: token,
  content: token,
  url: z.string().url(),
});

const fileSchema = z.object({
  campaign: token,
  generatedAt: z.string().date(),
  links: z.array(linkSchema).min(1),
});

const inputPath = path.join(process.cwd(), "docs", "distribution-links-2026-08-10.json");
const parsed = fileSchema.parse(JSON.parse(fs.readFileSync(inputPath, "utf8")));
const allowedParams = ["utm_source", "utm_medium", "utm_campaign", "utm_content"].sort();
const ids = new Set<string>();
const urls = new Set<string>();
const failures: string[] = [];

for (const link of parsed.links) {
  const url = new URL(link.url);
  const actualParams = [...url.searchParams.keys()].sort();

  if (ids.has(link.id)) failures.push(`${link.id}: duplicate id`);
  if (urls.has(link.url)) failures.push(`${link.id}: duplicate URL`);
  ids.add(link.id);
  urls.add(link.url);

  if (url.protocol !== "https:" || url.hostname !== "je4ndev.com") {
    failures.push(`${link.id}: destination must use https://je4ndev.com`);
  }
  if (!url.pathname.startsWith(`/${link.locale}`)) {
    failures.push(`${link.id}: URL path does not match locale ${link.locale}`);
  }
  if (actualParams.join(",") !== allowedParams.join(",")) {
    failures.push(`${link.id}: expected only ${allowedParams.join(", ")}`);
  }

  const expected = {
    utm_source: link.source,
    utm_medium: link.medium,
    utm_campaign: parsed.campaign,
    utm_content: link.content,
  };

  for (const [key, value] of Object.entries(expected)) {
    if (url.searchParams.get(key) !== value) {
      failures.push(`${link.id}: ${key} does not match structured value`);
    }
    if (!token.safeParse(value).success) {
      failures.push(`${link.id}: ${key} contains an invalid analytics token`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Campaign link validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const channels = [...new Set(parsed.links.map((link) => link.channel))].sort();
console.log(`Campaign links valid: ${parsed.links.length}`);
console.log(`Campaign: ${parsed.campaign}`);
console.log(`Channels: ${channels.join(", ")}`);
