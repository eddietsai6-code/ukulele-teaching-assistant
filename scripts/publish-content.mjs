import { spawnSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { createSignature } from "../functions/_lib/auth.js";
import { validatePublishBatchPayload } from "../functions/_lib/catalog.js";

const MIME_BY_EXTENSION = new Map([
  [".mp3", "audio/mpeg"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"]
]);

function compactTimestamp(date) {
  return date.toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveReleaseId(options, now) {
  if (options.releaseId) {
    const value = String(options.releaseId).trim();
    if (!/^release-[a-z0-9-]+$/i.test(value)) throw new Error(`Invalid release id: ${value}`);
    return value;
  }
  const suffix = options.releaseSuffix || randomBytes(6).toString("hex");
  return `release-${compactTimestamp(now)}-${suffix}`;
}

function safeLocalFile(baseDirectory, fileValue) {
  const raw = String(fileValue || "").trim();
  if (!raw) throw new Error("Every audio and score item needs a file path.");
  const absolutePath = path.resolve(baseDirectory, raw);
  const relativePath = path.relative(baseDirectory, absolutePath);
  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Content files must stay inside the manifest directory: ${raw}`);
  }
  return absolutePath;
}

function slugPart(value) {
  return String(value || "media")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "media";
}

async function compileMedia(items, kind, manifestDirectory, releaseId, songId) {
  if (!Array.isArray(items)) throw new Error(`${kind} must be an array.`);
  const uploads = [];
  const records = [];
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const filePath = safeLocalFile(manifestDirectory, item.file);
    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_BY_EXTENSION.get(extension);
    if (!contentType || (kind === "audio" && contentType !== "audio/mpeg") || (kind === "score" && !contentType.startsWith("image/"))) {
      throw new Error(`Unsupported ${kind} file type: ${extension || "none"}`);
    }
    const bytes = await fs.readFile(filePath);
    if (!bytes.length) throw new Error(`Content file is empty: ${filePath}`);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const name = `${kind}-${String(index + 1).padStart(2, "0")}-${slugPart(path.basename(filePath, extension))}-${sha256.slice(0, 12)}${extension}`;
    const key = `${releaseId}/${songId}/${name}`;
    const title = String(item.title || `${kind === "audio" ? "Audio" : "Score"} ${index + 1}`).trim();
    uploads.push({ filePath, key, sha256, size: bytes.length, contentType });
    records.push({
      ...(kind === "audio" ? { id: String(item.id || `audio-${index + 1}`) } : {}),
      title,
      src: `/media/${key}`
    });
  }
  return { uploads, records };
}

export async function buildPublishPlan(manifestPathValue, options = {}) {
  const manifestPaths = (Array.isArray(manifestPathValue) ? manifestPathValue : [manifestPathValue])
    .filter(Boolean)
    .map((item) => path.resolve(item));
  if (!manifestPaths.length) throw new Error("Usage: npm run content:publish -- <path-to-song.json> [more-song.json ...]");
  const now = options.now || new Date();
  const releaseId = resolveReleaseId(options, now);

  const uploads = [];
  const songs = [];
  for (const manifestPath of manifestPaths) {
    const manifestDirectory = path.dirname(manifestPath);
    const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    const song = manifest.song || {};
    const audio = await compileMedia(manifest.audio || [], "audio", manifestDirectory, releaseId, song.id);
    const scores = await compileMedia(manifest.scores || [], "score", manifestDirectory, releaseId, song.id);
    uploads.push(...audio.uploads, ...scores.uploads);
    songs.push({
      ...song,
      source: song.source || "Teacher Upload",
      category: song.category || "Teaching Piece",
      style: song.style || "Ukulele",
      techniques: song.techniques || [],
      audio: audio.records,
      scoreImages: scores.records
    });
  }
  if (!uploads.length) throw new Error("A publication must contain at least one audio or score file.");

  const payload = validatePublishBatchPayload({
    releaseId,
    createdAt: now.toISOString(),
    songs,
    media: uploads.map(({ key, sha256, size, contentType }) => ({ key, sha256, size, contentType })),
    replaceAll: options.replaceAll === true
  });

  return { manifestPath: manifestPaths[0], manifestPaths, uploads, payload, dryRun: options.dryRun === true };
}

function runWranglerUpload({ bucket, upload }) {
  const wranglerArgs = [
    "--yes",
    "wrangler@latest",
    "r2",
    "object",
    "put",
    `${bucket}/${upload.key}`,
    "--file",
    upload.filePath,
    "--content-type",
    upload.contentType,
    "--remote"
  ];
  const executable = process.platform === "win32" ? "cmd.exe" : "npx";
  const args = process.platform === "win32" ? ["/d", "/c", "npx.cmd", ...wranglerArgs] : wranglerArgs;
  const maxAttempts = Number(process.env.UKEBOOK_UPLOAD_ATTEMPTS || 4);
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = spawnSync(
      executable,
      args,
      { cwd: process.cwd(), env: process.env, encoding: "utf8" }
    );
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (!result.error && result.status === 0) return;
    if (attempt === maxAttempts) {
      if (result.error) throw new Error(`R2 upload failed: ${upload.key}; ${result.error.message}`);
      throw new Error(`R2 upload failed: ${upload.key}`);
    }
    const waitMs = attempt * 2000;
    console.warn(`R2 upload failed for ${upload.key}; retrying ${attempt + 1}/${maxAttempts} in ${waitMs}ms.`);
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, waitMs);
  }
}

async function signedPost({ siteUrl, endpoint, secret, payload }) {
  const body = JSON.stringify(payload);
  const maxAttempts = Number(process.env.UKEBOOK_API_ATTEMPTS || 6);
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const timestamp = String(Date.now());
      const nonce = randomBytes(18).toString("base64url");
      const signature = await createSignature({ secret, timestamp, nonce, body });
      const response = await fetch(new URL(endpoint, siteUrl), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-ukebook-timestamp": timestamp,
          "x-ukebook-nonce": nonce,
          "x-ukebook-signature": signature
        },
        body
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return result;
      const error = new Error(result.error || `Publish API failed with HTTP ${response.status}.`);
      error.retryable = response.status >= 500;
      throw error;
    } catch (error) {
      if (error?.retryable === false || attempt === maxAttempts) throw error;
      const waitMs = attempt * 2000;
      console.warn(`Publish API request failed; retrying ${attempt + 1}/${maxAttempts} in ${waitMs}ms.`);
      await sleep(waitMs);
    }
  }
  throw new Error("Publish API request failed.");
}

function parseCliArgs(args) {
  const options = { dryRun: false, replaceAll: false, skipUpload: false };
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--replace-all") {
      options.replaceAll = true;
    } else if (arg === "--skip-upload") {
      options.skipUpload = true;
    } else if (arg === "--release-id") {
      const value = args[index + 1];
      if (!value) throw new Error("Usage: --release-id <release-id>");
      options.releaseId = value;
      index += 1;
    } else if (arg === "--activate") {
      positional.push(arg);
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }
  return { options, positional };
}

async function loadLocalEnvironment() {
  try {
    const source = await fs.readFile(path.resolve(".env.ukulelebook-content"), "utf8");
    for (const line of source.split(/\r?\n/)) {
      const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

async function main() {
  await loadLocalEnvironment();
  const { options, positional } = parseCliArgs(process.argv.slice(2));
  const [commandOrManifest, value] = positional;
  const secret = process.env.UKEBOOK_PUBLISH_SECRET;
  const siteUrl = process.env.UKEBOOK_SITE_URL || "https://ukulele-teaching-assistant.pages.dev";

  if (commandOrManifest === "--activate") {
    if (!secret) throw new Error("Set UKEBOOK_PUBLISH_SECRET before publishing content.");
    if (!value) throw new Error("Usage: npm run content:activate -- <release-id>");
    const result = await signedPost({ siteUrl, endpoint: "/api/admin/activate", secret, payload: { releaseId: value } });
    console.log(`Activated ${result.releaseId}; previous release was ${result.previousReleaseId || "none"}.`);
    return;
  }

  if (!commandOrManifest) throw new Error("Usage: npm run content:publish -- <path-to-song.json> [more-song.json ...]");
  const bucket = process.env.UKEBOOK_R2_BUCKET || "ukulelebook-media";
  const plan = await buildPublishPlan(positional, options);
  if (plan.dryRun) {
    console.log(JSON.stringify({
      releaseId: plan.payload.releaseId,
      songs: plan.payload.songs.map((song) => song.id),
      uploads: plan.uploads.map(({ key, size, contentType, sha256 }) => ({ key, size, contentType, sha256 }))
    }, null, 2));
    return;
  }
  if (!secret) throw new Error("Set UKEBOOK_PUBLISH_SECRET before publishing content.");
  if (!options.skipUpload) {
    for (const upload of plan.uploads) runWranglerUpload({ bucket, upload });
  }
  const result = await signedPost({ siteUrl, endpoint: "/api/admin/publish-batch", secret, payload: plan.payload });
  console.log(`Published ${(result.songIds || plan.payload.songs.map((song) => song.id)).join(", ")} as ${result.releaseId}.`);
  console.log(`${siteUrl.replace(/\/$/, "")}/api/catalog/releases/${result.releaseId}`);
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
