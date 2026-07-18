-- Script SQL pour créer la table "pictures" dans la base de données.

DROP TABLE IF EXISTS pictures CASCADE;

CREATE TABLE pictures (
  id                INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  before_url        TEXT NOT NULL,
  before_public_id  TEXT NOT NULL,
  after_url         TEXT NOT NULL,
  after_public_id   TEXT NOT NULL,
  position          INT NOT NULL DEFAULT 0
)