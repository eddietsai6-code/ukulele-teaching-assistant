import { spawnSync } from "node:child_process";

const files = [
  "assets/app.js",
  "assets/bootstrap.js",
  "assets/catalog-runtime.js",
  "assets/data.js",
  "assets/lesson-metronome.js",
  "assets/professional-metronome-core.js",
  "assets/ukulele-tuner.js",
  "assets/tuner-core.js",
  "functions/_lib/auth.js",
  "functions/_lib/catalog.js",
  "functions/_lib/http.js",
  "functions/api/admin/activate.js",
  "functions/api/admin/publish.js",
  "functions/api/admin/publish-batch.js",
  "functions/api/catalog/current.js",
  "functions/api/catalog/releases/[releaseId].js",
  "functions/media/[[path]].js",
  "scripts/build-site.mjs",
  "scripts/publish-content.mjs",
];

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
