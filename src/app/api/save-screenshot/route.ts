import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Dev-only endpoint to save screenshots from Chrome MCP into public/projects/gallery.
 * Receives multipart with `file` (Blob) and `name` (string).
 * Whitelisted filename pattern to prevent path traversal: alphanumeric + dash + underscore + .png/.jpg.
 */
const FILENAME_RE = /^[a-z0-9][a-z0-9_-]*\.(png|jpg|jpeg)$/i;

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "disabled in production" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const name = (form.get("name") as string | null) ?? "";
  const subdir = (form.get("subdir") as string | null) ?? "";

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "missing file" }, { status: 400 });
  }
  if (!FILENAME_RE.test(name)) {
    return NextResponse.json({ error: "bad name (must match a-z0-9_-.png)" }, { status: 400 });
  }
  if (subdir && !/^[a-z0-9][a-z0-9_-]*$/i.test(subdir)) {
    return NextResponse.json({ error: "bad subdir" }, { status: 400 });
  }

  const baseDir = path.join(process.cwd(), "public", "projects", subdir);
  await mkdir(baseDir, { recursive: true });

  const outPath = path.join(baseDir, name);
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(outPath, buf);

  return NextResponse.json({ ok: true, path: outPath, size: buf.length });
}
