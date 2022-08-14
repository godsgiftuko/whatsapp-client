CREATE DATABASE IF NOT EXISTS whatsapp_bot COLLATE = utf8mb4_general_ci;
USE whatsapp_bot;

CREATE TABLE IF NOT EXISTS chats (
  msgId int not null auto_increment,
  identifier varchar(50),
  user varchar(50),
  messages LONGTEXT,
  timestamp varchar(50),
  unreadCount INT,
  type varchar(50),
  codec VARCHAR(50)
  PRIMARY KEY (msgId)
) ENGINE=InnoDB COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS sessions (
  sessionId INT NOT NULL DEFAULT 0,
  session JSON,
  PRIMARY KEY (sessionId)
) ENGINE=InnoDB COLLATE utf8mb4_general_ci;

INSERT INTO chats (`identifier`, `user`, `messages`, `timestamp`, `unreadCount`) VALUES (234000000000, 'John doe', 'Hello world', 'Dec 25, 2021 11:23 AM',0)
