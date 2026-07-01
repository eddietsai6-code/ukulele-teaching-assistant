import { spawnSync } from "node:child_process";

const files = [
  "assets/app.js",
  "assets/data.js",
  "assets/lesson-metronome.js",
  "assets/professional-metronome-core.js",
  "assets/ukulele-tuner.js",
  "assets/tuner-core.js",
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
