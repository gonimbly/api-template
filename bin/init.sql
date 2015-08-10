CREATE TABLE IF NOT EXISTS tokens (
    userId           BIGSERIAL,
    externalUserId   TEXT,
    token            TEXT NOT NULL UNIQUE,
    created          TIMESTAMP DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS projects (
    id           BIGSERIAL,
    userId       BIGINT,
    name         TEXT,
    description  TEXT,
    deleted      BOOLEAN
  );