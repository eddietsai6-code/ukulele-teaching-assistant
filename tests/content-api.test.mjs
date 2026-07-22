import assert from "node:assert/strict";
import test from "node:test";

import { createSignature, verifySignedRequest } from "../functions/_lib/auth.js";
import { getCurrentRelease, getReleaseManifest, publishReleaseBatch, validatePublishBatchPayload } from "../functions/_lib/catalog.js";
import { onRequestPost as publishBatch } from "../functions/api/admin/publish-batch.js";

const song = {
  id: "dynamic-song",
  title: "Dynamic Song",
  artist: "Teacher",
  level: "g2",
  sortOrder: 20,
  source: "Teacher Upload",
  category: "曲目练习",
  style: "Fingerstyle",
  techniques: ["arpeggio"],
  audio: [{ title: "Full", src: "/media/release-20260723-a/dynamic-song/audio-01-full-123456789abc.mp3" }],
  scoreImages: [{ title: "Page 1", src: "/media/release-20260723-a/dynamic-song/score-01-page-123456789abc.png" }],
  teaching: {
    goal: "Play the piece.",
    focus: "Keep time.",
    practiceOrder: ["Count", "Play"],
    commonIssues: ["Rush"],
    passStandard: "Perform steadily."
  }
};

const payload = {
  releaseId: "release-20260723-a",
  createdAt: "2026-07-23T00:00:00.000Z",
  songs: [song],
  media: [
    {
      key: "release-20260723-a/dynamic-song/audio-01-full-123456789abc.mp3",
      sha256: "123456789abc0000000000000000000000000000000000000000000000000000",
      size: 5,
      contentType: "audio/mpeg"
    },
    {
      key: "release-20260723-a/dynamic-song/score-01-page-123456789abc.png",
      sha256: "123456789abc1111111111111111111111111111111111111111111111111111",
      size: 7,
      contentType: "image/png"
    }
  ]
};

function statement(sql, db) {
  const boundStatement = (values = []) => ({
    sql,
    values,
    async first() {
      return db.firstFor(sql, values);
    },
    async all() {
      return db.allFor(sql, values);
    }
  });

  return {
    bind(...values) {
      db.bound.push({ sql, values });
      return boundStatement(values);
    },
    async first() {
      return db.firstFor(sql, []);
    },
    async all() {
      return db.allFor(sql, []);
    }
  };
}

function mockDb(activeReleaseId = null) {
  const db = {
    activeReleaseId,
    bound: [],
    releases: new Set(),
    releaseMeta: new Map(),
    releaseSongs: new Map(),
    usedNonces: new Set(),
    async firstFor(sql, values) {
      if (sql.includes("SELECT value FROM site_state")) return db.activeReleaseId ? { value: db.activeReleaseId } : null;
      if (sql.includes("SELECT nonce FROM publish_nonces")) return db.usedNonces.has(values[0]) ? { nonce: values[0] } : null;
      if (sql.includes("SELECT id, created_at, published_at FROM catalog_releases")) {
        const meta = db.releaseMeta.get(values[0]);
        return meta || null;
      }
      if (sql.includes("SELECT id FROM catalog_releases")) {
        const id = values[0];
        return db.releases.has(id) ? { id } : null;
      }
      return null;
    },
    async allFor(sql, values) {
      if (sql.includes("SELECT song_json FROM catalog_release_songs")) {
        const songs = db.releaseSongs.get(values[0]) || [];
        return { results: songs.map((item) => ({ song_json: JSON.stringify(item) })) };
      }
      return { results: [] };
    },
    prepare(sql) {
      return statement(sql, db);
    },
    async batch(statements) {
      db.statements = statements;
      for (const statement of statements) {
        if (statement.sql?.includes("INSERT INTO catalog_releases")) {
          db.releases.add(statement.values[0]);
          db.releaseMeta.set(statement.values[0], {
            id: statement.values[0],
            created_at: statement.values[1] || payload.createdAt,
            published_at: statement.values[2] || payload.createdAt
          });
        }
        if (statement.sql?.includes("SELECT ?, song_id, level_id, sort_order")) {
          const [releaseId, previousReleaseId] = statement.values;
          const previousSongs = db.releaseSongs.get(previousReleaseId) || [];
          db.releaseSongs.set(releaseId, [...previousSongs]);
        }
        if (statement.sql?.includes("DELETE FROM catalog_release_songs WHERE release_id = ? AND song_id = ?")) {
          const [releaseId, songId] = statement.values;
          const list = db.releaseSongs.get(releaseId) || [];
          db.releaseSongs.set(releaseId, list.filter((item) => item.id !== songId));
        }
        if (statement.sql?.includes("INSERT INTO catalog_release_songs") && statement.values?.length === 5) {
          const [releaseId, , , , json] = statement.values;
          const list = db.releaseSongs.get(releaseId) || [];
          list.push(JSON.parse(json));
          db.releaseSongs.set(releaseId, list);
        }
        if (statement.sql?.includes("active_release_id")) {
          db.activeReleaseId = statement.values[0];
        }
        if (statement.sql?.includes("INSERT INTO publish_nonces")) {
          db.usedNonces.add(statement.values[0]);
        }
      }
    }
  };
  return db;
}

test("publish payload requires hash-named media and complete teaching metadata", () => {
  const normalized = validatePublishBatchPayload(payload);

  assert.equal(normalized.releaseId, payload.releaseId);
  assert.equal(normalized.songs[0].teaching.goal, "Play the piece.");
  assert.throws(
    () => validatePublishBatchPayload({
      ...payload,
      media: [{ ...payload.media[0], key: "release-20260723-a/dynamic-song/audio-01-full.mp3" }]
    }),
    /must contain its SHA-256 hash prefix/
  );
  assert.throws(
    () => validatePublishBatchPayload({ ...payload, songs: [{ ...song, sortOrder: "x" }] }),
    /sortOrder/
  );
});

test("publish batch verifies R2 objects before atomically switching active release", async () => {
  const db = mockDb("release-old");
  const seenKeys = [];
  const bucket = {
    async head(key) {
      seenKeys.push(key);
      const item = payload.media.find((candidate) => candidate.key === key);
      return item ? { size: item.size, customMetadata: { sha256: item.sha256 } } : null;
    }
  };

  const result = await publishReleaseBatch({ db, bucket, payload, nonce: "nonce-1234567890" });

  assert.deepEqual(seenKeys, payload.media.map((item) => item.key));
  assert.equal(result.releaseId, payload.releaseId);
  assert.equal(result.previousReleaseId, "release-old");
  assert.equal(db.activeReleaseId, payload.releaseId);
  assert.equal(db.statements.some((item) => item.sql?.includes("SELECT ?, song_id, level_id, sort_order")), true);
});

test("current and release manifest readers return active release pointers", async () => {
  const db = mockDb();
  await db.batch([
    { sql: "INSERT INTO catalog_releases", values: [payload.releaseId] },
    { sql: "INSERT INTO catalog_release_songs", values: [payload.releaseId, song.id, song.level, song.sortOrder, JSON.stringify(song)] },
    { sql: "active_release_id", values: [payload.releaseId] }
  ]);

  assert.deepEqual(await getCurrentRelease(db), {
    releaseId: payload.releaseId,
    manifestUrl: `/api/catalog/releases/${payload.releaseId}`
  });
  const manifest = await getReleaseManifest(db, payload.releaseId);
  assert.equal(manifest.releaseId, payload.releaseId);
  assert.equal(manifest.songs[0].id, song.id);
});

test("admin publish endpoint requires signed protected requests", async () => {
  const secret = "test-secret";
  const body = JSON.stringify(payload);
  const timestamp = String(Date.now());
  const nonce = "nonce-abcdef123456";
  const signature = await createSignature({ secret, timestamp, nonce, body });
  const db = mockDb();
  const bucket = {
    async head(key) {
      const item = payload.media.find((candidate) => candidate.key === key);
      return item ? { size: item.size, customMetadata: { sha256: item.sha256 } } : null;
    }
  };

  const response = await publishBatch({
    request: new Request("https://example.com/api/admin/publish-batch", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-ukebook-timestamp": timestamp,
        "x-ukebook-nonce": nonce,
        "x-ukebook-signature": signature
      },
      body
    }),
    env: { CONTENT_PUBLISH_SECRET: secret, UKEBOOK_DB: db, UKEBOOK_MEDIA: bucket }
  });

  assert.equal(response.status, 201);
  const result = await response.json();
  assert.equal(result.releaseId, payload.releaseId);

  await assert.rejects(
    () => verifySignedRequest({
      request: new Request("https://example.com", {
        method: "POST",
        headers: {
          "x-ukebook-timestamp": timestamp,
          "x-ukebook-nonce": "nonce-missing-signature"
        },
        body
      }),
      secret
    }),
    /signature/
  );
});
