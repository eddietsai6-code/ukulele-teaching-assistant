PRAGMA foreign_keys = ON;

-- The local admin workspace mirrors these responsibilities in workspace.json.
-- Keeping them as first-class D1 tables makes the Worker schema auditable and
-- leaves room for a future multi-user admin client without changing the public API.
CREATE TABLE IF NOT EXISTS draft_batches (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('open', 'published', 'discarded')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  release_id TEXT,
  changes_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(changes_json))
);

CREATE TABLE IF NOT EXISTS media_jobs (
  id TEXT PRIMARY KEY,
  song_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('audio', 'score')),
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed')),
  source_name TEXT,
  result_json TEXT CHECK (result_json IS NULL OR json_valid(result_json)),
  error_message TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS publish_jobs (
  id TEXT PRIMARY KEY,
  release_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'rolled_back')),
  song_ids_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(song_ids_json)),
  change_summary_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(change_summary_json)),
  error_message TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trash_entries (
  song_id TEXT PRIMARY KEY,
  trashed_at TEXT NOT NULL,
  previous_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS release_changes (
  release_id TEXT NOT NULL,
  song_id TEXT NOT NULL,
  change_kind TEXT NOT NULL,
  fields_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(fields_json)),
  PRIMARY KEY (release_id, song_id, change_kind)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT 'local-admin',
  entity_id TEXT,
  details_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(details_json)),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS media_jobs_song_status ON media_jobs (song_id, status, updated_at);
CREATE INDEX IF NOT EXISTS publish_jobs_status ON publish_jobs (status, updated_at);
CREATE INDEX IF NOT EXISTS audit_log_created_at ON audit_log (created_at);
