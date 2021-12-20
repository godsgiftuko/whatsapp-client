CREATE DATABASE whatsapp_bot;
USE whatsapp_bot;

CREATE TABLE chats (
  identifier varchar(50),
  user varchar(50),
  messages text(50),
  PRIMARY KEY (identifier)
)