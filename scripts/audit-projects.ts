#!/usr/bin/env tsx
/**
 * Project Presentation System — Asset & Schema Auditor (Fase 1)
 * Per docs/specs/2026-06-03-project-presentation-system.md
 *
 * Usage:
 *   npm run audit:projects
 *
 * What it checks:
 * - All projects have the new V2 required fields (shortDescription, role, proofLevel, visualKind, tags, primaryCta, casePriority, etc.)
 * - Media files (image, coverImage, video, gallery) actually exist on disk under public/
 * - No repeated generic covers (e.g. web3-security-cover.webp) used across different proofLevels/roles
 * - Basic heuristics for "proof real" vs landing/generic (reports suspicious ones)
 * - Reports per project + overall summary. Exits 1 on critical gaps.
 *
 * This is the foundation for the "Asset Auditor" + "Curador de Projetos" agents.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { projects } from '../src/data/projects.js'; // works with tsx / ts-node esm
import type { ProjectV2 } from '../src/types/project.js';
import { projectCollectionSchema } from '../src/data/project-schema.js';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');

type Gap = { project: string; field: string; message: string; severity: 'error' | 'warn' };

const gaps: Gap[] = [];
const coverUsage = new Map<string, string[]>(); // coverPath -> slugs

function addGap(slug: string, field: string, message: string, severity: 'error' | 'warn' = 'error') {
  gaps.push({ project: slug, field, message, severity });
}

function fileExists(rel: string | undefined): boolean {
  if (!rel) return false;
  const full = path.join(PUBLIC, rel.replace(/^\//, ''));
  return fs.existsSync(full);
}

async function checkImageQuality(slug: string, field: string, rel: string) {
  const full = path.join(PUBLIC, rel.replace(/^\//, ''));
  if (!fs.existsSync(full)) return;

  const stats = fs.statSync(full);
  const metadata = await sharp(full).metadata();

  if ((metadata.width ?? 0) < 1200 || (metadata.height ?? 0) < 675) {
    addGap(slug, field, `Asset below 1200x675: ${metadata.width ?? '?'}x${metadata.height ?? '?'}`, 'warn');
  }
  if (stats.size < 20 * 1024) {
    addGap(slug, field, `Asset is unusually small (${Math.round(stats.size / 1024)} KB); inspect for blank/error state`, 'warn');
  }
}

async function checkMedia(slug: string, p: ProjectV2) {
  if (p.image && !fileExists(p.image)) {
    addGap(slug, 'image', `Missing file: ${p.image}`, 'error');
  }
  if (p.coverImage && !fileExists(p.coverImage)) {
    addGap(slug, 'coverImage', `Missing file: ${p.coverImage}`, 'error');
  }
  if (p.video && !fileExists(p.video)) {
    addGap(slug, 'video', `Missing file: ${p.video}`, 'warn');
  }
  if (p.gallery && p.gallery.length > 0) {
    p.gallery.forEach((g, i) => {
      if (!fileExists(g.src)) {
        addGap(slug, `gallery[${i}]`, `Missing file: ${g.src}`, 'warn');
      }
    });
  }

  if (p.image && p.coverImage && p.image === p.coverImage) {
    addGap(slug, 'image', 'Primary proof cannot be the same file as the editorial cover', 'error');
  }

  if (p.assetReview.status === 'approved' && !p.image) {
    addGap(slug, 'assetReview', 'Approved project must have a real primary image', 'error');
  }
  if (p.assetReview.status === 'editorial-only' && p.image) {
    addGap(slug, 'assetReview', 'Editorial-only project cannot expose a cover as primary proof', 'error');
  }
  if (p.assetReview.status === 'needs-recapture') {
    addGap(slug, 'assetReview', p.assetReview.note.en, 'warn');
  }

  if (p.image) await checkImageQuality(slug, 'image', p.image);
  if (p.coverImage) await checkImageQuality(slug, 'coverImage', p.coverImage);

  // Track cover usage for duplicate generic detection
  if (p.coverImage) {
    const list = coverUsage.get(p.coverImage) || [];
    list.push(slug);
    coverUsage.set(p.coverImage, list);
  }
}

function checkV2Fields(slug: string, p: ProjectV2) {
  const required: (keyof ProjectV2)[] = [
    'shortDescription', 'role', 'audience', 'proofLevel', 'visualKind',
    'tags', 'primaryCta', 'casePriority'
  ];
  const priorityCaseSlugs = new Set(['archscene', 'arremata-radar', 'fullcommerce360']);

  for (const f of required) {
    const val = p[f];
    if (val === undefined || val === null || (Array.isArray(val) && val.length === 0)) {
      addGap(slug, String(f), `Missing or empty required V2 field: ${f}`, 'error');
    }
  }

  if (priorityCaseSlugs.has(slug) && !p.deliveryRecord) {
    addGap(slug, 'deliveryRecord', 'Priority case must declare responsibility, architecture, current state and proof limitations', 'error');
  }

  // proofLevel + primaryCta consistency
  if (p.proofLevel === 'public-live' && p.links.live && p.primaryCta !== 'live') {
    addGap(slug, 'primaryCta', `public-live project should prefer primaryCta="live" when links.live exists`, 'warn');
  }
  if ((p.proofLevel === 'internal' || p.proofLevel === 'case-only') && p.primaryCta === 'live' && !p.links.live) {
    addGap(slug, 'primaryCta', `Internal/case-only project has primaryCta="live" but no links.live`, 'warn');
  }

  // visualKind vs proofLevel sanity
  if (p.proofLevel === 'public-live' && (p.visualKind === 'branding' || p.visualKind === 'github-repo')) {
    addGap(slug, 'visualKind', `public-live should use product-screenshot / dashboard / ai-render / video-demo, not just ${p.visualKind}`, 'warn');
  }

  p.metrics.forEach((metric, index) => {
    if (!metric.verified) {
      addGap(slug, `metrics[${index}]`, `Unverified public claim: ${metric.value} ${metric.label.en}`, 'error');
    }
  });
}

async function checkLinks() {
  if (!process.argv.includes('--check-links')) return;

  const urls = new Map<string, string>();
  projects.forEach((project) => {
    Object.values(project.links).forEach((url) => {
      if (url) urls.set(url, project.slug);
    });
  });

  for (const [url, slug] of urls) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(12_000),
        headers: { 'user-agent': 'JE4NDEV-Portfolio-Auditor/1.0' },
      });
      if (!response.ok) addGap(slug, 'links', `${url} returned ${response.status}`, 'error');
    } catch (error) {
      addGap(slug, 'links', `${url} failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  }
}

function checkDuplicatePriorities() {
  const usage = new Map<number, string[]>();
  for (const project of projects) {
    const slugs = usage.get(project.casePriority) ?? [];
    slugs.push(project.slug);
    usage.set(project.casePriority, slugs);
  }

  for (const [priority, slugs] of usage.entries()) {
    if (slugs.length > 1) {
      addGap('MULTIPLE', 'casePriority', `Priority ${priority} used by: ${slugs.join(', ')}`, 'error');
    }
  }
}

function checkDuplicateCovers() {
  for (const [cover, slugs] of coverUsage.entries()) {
    if (slugs.length > 1) {
      // Flag the generic web3 one especially hard
      const isGeneric = cover.includes('web3-security-cover');
      const sev = isGeneric ? 'error' : 'warn';
      addGap('MULTIPLE', 'coverImage', `Cover "${cover}" used by ${slugs.length} projects: ${slugs.join(', ')}. ${isGeneric ? 'GENERIC WEB3 COVER — replace with per-project editorial covers.' : ''}`, sev);
    }
  }
}

async function main() {
  console.log('🔍 Project Presentation System — Asset & Schema Auditor (Fase 1)\n');
  console.log(`Loaded ${projects.length} projects from src/data/projects.ts\n`);

  const parsed = projectCollectionSchema.safeParse(projects);
  if (!parsed.success) {
    parsed.error.issues.forEach((issue) => {
      addGap(String(issue.path[0] ?? 'COLLECTION'), issue.path.slice(1).join('.') || 'schema', issue.message, 'error');
    });
  }

  for (const p of projects) {
    const proj = p as ProjectV2;
    console.log(`→ ${proj.slug} [${proj.proofLevel}] [priority:${proj.casePriority}]`);

    checkV2Fields(proj.slug, proj);
    await checkMedia(proj.slug, proj);
  }

  checkDuplicateCovers();
  checkDuplicatePriorities();
  await checkLinks();

  // Summary
  const errors = gaps.filter(g => g.severity === 'error');
  const warns = gaps.filter(g => g.severity === 'warn');

  console.log('\n' + '='.repeat(60));
  console.log(`SUMMARY: ${gaps.length} gaps (${errors.length} errors, ${warns.length} warnings)`);
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('\n❌ ERRORS (must fix):');
    errors.forEach(g => console.log(`  [${g.project}] ${g.field}: ${g.message}`));
  }

  if (warns.length > 0) {
    console.log('\n⚠️  WARNINGS (recommended):');
    warns.forEach(g => console.log(`  [${g.project}] ${g.field}: ${g.message}`));
  }

  if (errors.length === 0) {
    console.log('\n✅ No blocking errors. Good base for Fase 2 (Hub) and Fase 3 (CaseStudyHero).');
  } else {
    console.log('\n🛑 Blocking errors found. Fix before moving to UI redesign phases.');
  }

  // Exit code for CI / pre-commit
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
