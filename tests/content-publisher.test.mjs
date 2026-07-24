import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildPublishPlan } from "../scripts/publish-content.mjs";

async function makeFixture() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ukebook-publish-"));
  await fs.writeFile(path.join(dir, "full.mp3"), Buffer.from([0xff, 0xfb, 0x90, 0x64]));
  await fs.writeFile(path.join(dir, "score.png"), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  const manifestPath = path.join(dir, "song.json");
  await fs.writeFile(
    manifestPath,
    JSON.stringify({
      song: {
        id: "dynamic-song",
        title: "Dynamic Song",
        artist: "Teacher",
        level: "g2",
        sortOrder: 20,
        teaching: {
          goal: "Play the piece.",
          focus: "Keep time.",
          practiceOrder: ["Count", "Play"],
          commonIssues: ["Rush"],
          passStandard: "Perform steadily."
        }
      },
      audio: [{ title: "Full", file: "full.mp3" }],
      scores: [{ title: "Page 1", file: "score.png" }]
    }),
    "utf8"
  );
  return { dir, manifestPath };
}

test("local publisher builds immutable hash-addressed upload plans", async () => {
  const { manifestPath } = await makeFixture();
  const plan = await buildPublishPlan(manifestPath, {
    now: new Date("2026-07-23T00:00:00.000Z"),
    releaseSuffix: "abcdef123456"
  });

  assert.equal(plan.payload.releaseId, "release-20260723-000000-abcdef123456");
  assert.equal(plan.uploads.length, 2);
  assert.equal(plan.payload.songs[0].id, "dynamic-song");
  assert.equal(plan.payload.songs[0].audio[0].src.startsWith("/media/release-20260723-000000-abcdef123456/dynamic-song/"), true);
  assert.match(plan.uploads[0].key, /^release-20260723-000000-abcdef123456\/dynamic-song\/audio-01-full-[a-f0-9]{12}\.mp3$/);
  assert.match(plan.uploads[1].key, /^release-20260723-000000-abcdef123456\/dynamic-song\/score-01-score-[a-f0-9]{12}\.png$/);
  assert.equal(plan.uploads[0].contentType, "audio/mpeg");
  assert.equal(plan.uploads[1].contentType, "image/png");
  assert.equal(plan.uploads.every((item) => item.size > 0 && /^[a-f0-9]{64}$/.test(item.sha256)), true);

  const fixedPlan = await buildPublishPlan(manifestPath, { releaseId: "release-manual-retry-123" });
  assert.equal(fixedPlan.payload.releaseId, "release-manual-retry-123");
  assert.match(fixedPlan.uploads[0].key, /^release-manual-retry-123\/dynamic-song\/audio-01-full-[a-f0-9]{12}\.mp3$/);
});

test("local publisher supports dry-run plans and rejects files outside manifest directory", async () => {
  const { dir, manifestPath } = await makeFixture();
  const outside = path.join(os.tmpdir(), "outside.mp3");
  await fs.writeFile(outside, "outside");
  const badManifest = path.join(dir, "bad-song.json");
  await fs.writeFile(
    badManifest,
    JSON.stringify({
      song: {
        id: "bad-song",
        title: "Bad Song",
        artist: "Teacher",
        level: "g1",
        sortOrder: 5,
        teaching: {
          goal: "Goal",
          focus: "Focus",
          practiceOrder: ["One"],
          commonIssues: ["Two"],
          passStandard: "Three"
        }
      },
      audio: [{ title: "Bad", file: "../outside.mp3" }],
      scores: []
    }),
    "utf8"
  );

  const plan = await buildPublishPlan(manifestPath, { dryRun: true });
  assert.equal(plan.dryRun, true);
  await assert.rejects(() => buildPublishPlan(badManifest), /must stay inside the manifest directory/);
});
