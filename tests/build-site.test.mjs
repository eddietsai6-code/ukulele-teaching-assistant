import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildSite } from "../scripts/build-site.mjs";

test("site build copies only public static assets to dist", async () => {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const outputRoot = path.join(projectRoot, "tmp", "test-build-dist");
  await fs.rm(outputRoot, { recursive: true, force: true });
  const result = await buildSite({ outputRoot });
  const entries = await fs.readdir(outputRoot);

  assert.ok(entries.includes("index.html"));
  assert.ok(entries.includes("assets"));
  assert.ok(entries.includes("_routes.json"));
  assert.equal(entries.includes("tests"), false);
  assert.equal(entries.includes("functions"), false);
  assert.equal(entries.includes(".env.ukebook-content"), false);
  assert.equal(result.fileCount > 10, true);
});
