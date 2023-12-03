
CREATE DATABASE IF NOT EXISTS social_media_db;
USE social_media_db;


CREATE TABLE IF NOT EXISTS pictures (
    picture_url VARCHAR(255) not null PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS users (
    user_id BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) not null PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_picture_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_picture_url) REFERENCES pictures(picture_url)
);

CREATE TABLE IF NOT EXISTS posts (
    post_id BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) not null PRIMARY KEY,
    user_id BINARY(16),
    content TEXT NOT NULL,
    post_picture_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_picture_url) REFERENCES pictures(picture_url)
);


CREATE TABLE IF NOT EXISTS comments (
    comment_id  BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) not null PRIMARY KEY,
    user_id BINARY(16),
    post_id BINARY(16),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);


CREATE TABLE IF NOT EXISTS likes (
    like_id  BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) not null PRIMARY KEY,
    user_id BINARY(16),
    post_id BINARY(16),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);


CREATE TABLE IF NOT EXISTS friendships (
    friendship_id  BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) not null PRIMARY KEY,
    user_id1 BINARY(16),
    user_id2 BINARY(16),
    status ENUM('pending', 'accepted') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id1) REFERENCES users(user_id),
    FOREIGN KEY (user_id2) REFERENCES users(user_id)
);


CREATE TABLE IF NOT EXISTS notifications (
    notification_id  BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) not null PRIMARY KEY,
    user_id BINARY(16),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
