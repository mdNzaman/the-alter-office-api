DROP DATABASE IF EXISTS the_atler_office;

CREATE DATABASE the_atler_office CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE the_atler_office;

DROP TABLE IF EXISTS
users,
url_alias,
analytics,
origins,
platforms,
devices,
sessions
;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(64) NOT NULL,
  active BOOL NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  PRIMARY KEY(id),
  UNIQUE INDEX user_id(id) USING HASH
);

CREATE TABLE url_alias (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  long_url VARCHAR(256) NOT NULL,
  alias VARCHAR(256) NOT NULL,
  topic VARCHAR(256) NULL,
  active BOOL NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  UNIQUE INDEX urls_id(id) USING HASH,
  INDEX urls_user_id(user_id) USING HASH
);

CREATE TABLE analytics (
  id INT NOT NULL AUTO_INCREMENT,
  url_id INT NOT NULL,
  ip_address VARCHAR(100) NULL,
  user_agent VARCHAR(100) NOT NULL,
  os_type VARCHAR(100) NULL,
  device_type VARCHAR(100) NULL,,
  active BOOL NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(url_id) REFERENCES urls(id),
  UNIQUE INDEX urls_id(id) USING HASH,
  INDEX urls_url_id(url_id) USING HASH
);

CREATE TABLE origins (
  id INT NOT NULL AUTO_INCREMENT,
  origin VARCHAR(32) NOT NULL,
  active BOOL NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  PRIMARY KEY(id),
  UNIQUE INDEX origin_id(id) USING HASH
);

CREATE TABLE platforms (
  id INT NOT NULL AUTO_INCREMENT,
  platform VARCHAR(32) NOT NULL,
  active BOOL NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  PRIMARY KEY(id),
  UNIQUE INDEX platform_id(id) USING HASH
);

CREATE TABLE devices (
  id INT NOT NULL AUTO_INCREMENT,
  identifier VARCHAR(256) NOT NULL,
  origin_id INT NOT NULL,
  platform_id INT NOT NULL,
  app_version INT NOT NULL,
  user_agent VARCHAR(256) NULL,
  push_token VARCHAR(256) NULL,
  active BOOL NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(origin_id) REFERENCES origins(id),
  FOREIGN KEY(platform_id) REFERENCES platforms(id),
  UNIQUE INDEX device_id(id) USING HASH,
  INDEX device_origin_id(origin_id) USING HASH,
  INDEX device_platform_id(platform_id) USING HASH,
  UNIQUE INDEX device_identifier_origin_platform(identifier, origin_id, platform_id) USING HASH
);

CREATE TABLE sessions (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(256) NOT NULL,
  device_id INT NOT NULL,
  expiry DATETIME NOT NULL DEFAULT NOW(),
  active BOOL NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(device_id) REFERENCES devices(id),
  UNIQUE INDEX session_id(id) USING HASH,
  INDEX session_user_id(user_id) USING HASH,
  INDEX session_device_id(device_id) USING HASH
);

# Data initialisation
INSERT INTO origins (id, origin) VALUES (1, 'admin');

INSERT INTO platforms (id, platform) VALUES (1, 'Web');

INSERT INTO devices (id, identifier, origin_id, platform_id, app_version, user_agent)
VALUES (1, 'web', 1, 1, 1, 'DefaultUserAgent');
