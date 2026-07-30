-- Subscriber table for Explore Excel.
-- Apply with:
--   npx wrangler d1 execute explore-excel-subscribers --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS subscribers (
  email             TEXT PRIMARY KEY,
  source            TEXT NOT NULL,
  subscribed_at     TEXT NOT NULL,
  consent_text      TEXT NOT NULL,
  unsubscribe_token TEXT NOT NULL UNIQUE,
  unsubscribed_at   TEXT
);

CREATE INDEX IF NOT EXISTS idx_token  ON subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_source ON subscribers(source);
