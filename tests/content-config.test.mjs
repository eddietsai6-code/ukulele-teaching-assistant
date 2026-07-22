import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("Cloudflare config defines independent UkuleleBook content bindings", () => {
  const wrangler = read("wrangler.toml");
  const pkg = JSON.parse(read("package.json"));
  const routes = read("_routes.json");
  const workflow = read(".github/workflows/deploy-pages.yml");

  assert.match(wrangler, /^name = "ukulele-teaching-assistant"$/m);
  assert.match(wrangler, /^pages_build_output_dir = "\.\/dist"$/m);
  assert.match(wrangler, /binding = "UKEBOOK_DB"[\s\S]*database_name = "ukulelebook-content"/);
  assert.match(wrangler, /binding = "UKEBOOK_MEDIA"[\s\S]*bucket_name = "ukulelebook-media"/);
  assert.doesNotMatch(wrangler, /guitarbook/i);
  assert.equal(pkg.scripts.build, "node scripts/build-site.mjs");
  assert.equal(pkg.scripts["content:publish"], "node scripts/publish-content.mjs");
  assert.equal(pkg.scripts["content:activate"], "node scripts/publish-content.mjs --activate");
  assert.deepEqual(JSON.parse(routes), { version: 1, include: ["/api/*", "/media/*"], exclude: [] });
  assert.match(workflow, /wrangler-action@v3/);
  assert.match(workflow, /pages deploy dist --project-name ukulele-teaching-assistant --branch main/);
  assert.doesNotMatch(workflow, /CONTENT_PUBLISH_SECRET|UKEBOOK_PUBLISH_SECRET/);
});

test("D1 migrations preserve release history and active release state", () => {
  const catalog = read("migrations/0001_content_catalog.sql");
  const admin = read("migrations/0002_content_admin_jobs.sql");

  for (const expected of [
    "CREATE TABLE IF NOT EXISTS catalog_releases",
    "CREATE TABLE IF NOT EXISTS catalog_release_songs",
    "CREATE TABLE IF NOT EXISTS site_state",
    "CREATE TABLE IF NOT EXISTS publish_nonces",
    "active_release_id"
  ]) {
    assert.ok(catalog.includes(expected), `missing catalog schema token: ${expected}`);
  }

  for (const expected of [
    "CREATE TABLE IF NOT EXISTS draft_batches",
    "CREATE TABLE IF NOT EXISTS publish_jobs",
    "CREATE TABLE IF NOT EXISTS release_changes",
    "CREATE TABLE IF NOT EXISTS audit_log"
  ]) {
    assert.ok(admin.includes(expected), `missing admin schema token: ${expected}`);
  }
});
