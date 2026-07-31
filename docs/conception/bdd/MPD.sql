-- Script SQL pour créer la table "pictures" dans la base de données.

CREATE TABLE pictures (
  id    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url   TEXT NOT NULL
);

CREATE TABLE before_after_pictures (
  id                 INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  position           INT NOT NULL DEFAULT 0,
  before_picture_id  INT NOT NULL REFERENCES pictures(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  after_picture_id   INT NOT NULL REFERENCES pictures(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
