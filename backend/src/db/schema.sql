CREATE DATABASE IF NOT EXISTS factorfiction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE factorfiction;

CREATE TABLE IF NOT EXISTS rooms (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code                VARCHAR(12)  NOT NULL UNIQUE,
  creator             VARCHAR(64)  NOT NULL,
  status              ENUM('waiting','writing','voting','finished') NOT NULL DEFAULT 'waiting',
  interval_sec        INT UNSIGNED NOT NULL DEFAULT 60,
  vote_sec            INT UNSIGNED NOT NULL DEFAULT 30,
  current_round_index INT UNSIGNED NOT NULL DEFAULT 0,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_players (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id    INT UNSIGNED NOT NULL,
  nickname   VARCHAR(64)  NOT NULL,
  avatar_idx TINYINT UNSIGNED NOT NULL DEFAULT 0,
  socket_id  VARCHAR(128),
  status     ENUM('connected','disconnected') NOT NULL DEFAULT 'connected',
  joined_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_room_nick (room_id, nickname),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS round_order (
  id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id  INT UNSIGNED NOT NULL,
  position TINYINT UNSIGNED NOT NULL,
  nickname VARCHAR(64) NOT NULL,
  UNIQUE KEY uq_room_pos (room_id, position),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stories (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id      INT UNSIGNED NOT NULL,
  author       VARCHAR(64)  NOT NULL,
  text         TEXT         NOT NULL,
  is_truth     TINYINT(1)   NOT NULL DEFAULT 0,
  submitted_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS votes (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id      INT UNSIGNED NOT NULL,
  round_author VARCHAR(64)  NOT NULL,
  voter        VARCHAR(64)  NOT NULL,
  story_id     INT UNSIGNED NOT NULL,
  voted_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_vote (room_id, round_author, voter),
  FOREIGN KEY (room_id)  REFERENCES rooms(id)   ON DELETE CASCADE,
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS results (
  id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id  INT UNSIGNED NOT NULL,
  nickname VARCHAR(64)  NOT NULL,
  score    INT UNSIGNED NOT NULL DEFAULT 0,
  UNIQUE KEY uq_result (room_id, nickname),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_history (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_code     VARCHAR(12)  NOT NULL,
  winner        VARCHAR(64),
  total_players INT UNSIGNED NOT NULL DEFAULT 0,
  finished_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);
