-- Anime App database
-- run it with:  "C:/xampp/mysql/bin/mysql.exe" -u root < schema.sql

CREATE DATABASE IF NOT EXISTS anime_app
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE anime_app;
-- if not exisy so it doesn't duplicate
-- user accounts. password is stored as a bcrypt hash, never the real password
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  first_name    VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- one row = one anime a user saved
CREATE TABLE IF NOT EXISTS watchlist (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT           NOT NULL,
  mal_id     INT           NOT NULL,
  title      VARCHAR(255),
  image_url  VARCHAR(500),
  status     VARCHAR(100),
  added_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  -- same user can't save the same anime twice
  UNIQUE KEY uniq_user_anime (user_id, mal_id),
  -- links each row to a user; if the user is deleted their rows go too
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- cache of anime we've fetched from Jikan, so we can still serve them when
-- Jikan is down. Columns are nullable because Jikan data is often incomplete.
CREATE TABLE IF NOT EXISTS anime_details (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  mal_id     INT           NOT NULL UNIQUE,   -- UNIQUE so INSERT IGNORE dedupes
  title      VARCHAR(255),
  image_url  VARCHAR(500),
  status     VARCHAR(100),
  rating     VARCHAR(100),                    -- Jikan rating is text, e.g. "PG-13 - Teens 13 or older"
  year       INT,
  synopsis   TEXT,
  trailer_url VARCHAR(500)                     -- YouTube embed url, for "Play Trailer"
);
