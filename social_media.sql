
CREATE DATABASE IF NOT EXISTS social_media_db;
USE social_media_db;


CREATE TABLE IF NOT EXISTS pictures (
    picture_url VARCHAR(255) not null PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(200) DEFAULT (UUID()) not null PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) DEFAULT '' NOT NULL,
    bio TEXT,
    profile_picture_url VARCHAR(255) DEFAULT 'defaultProfile.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_picture_url) REFERENCES pictures(picture_url)
);

CREATE TABLE IF NOT EXISTS posts (
    post_id VARCHAR(200) DEFAULT (UUID()) not null PRIMARY KEY,
    user_id VARCHAR(200),
    content TEXT NOT NULL,
    post_picture_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_picture_url) REFERENCES pictures(picture_url)
);


CREATE TABLE IF NOT EXISTS comments (
    comment_id  VARCHAR(200) DEFAULT (UUID()) not null PRIMARY KEY,
    user_id VARCHAR(200),
    post_id VARCHAR(200),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);


CREATE TABLE IF NOT EXISTS likes (
    like_id VARCHAR(200) DEFAULT (UUID()) not null PRIMARY KEY,
    user_id VARCHAR(200),
    post_id VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);


CREATE TABLE IF NOT EXISTS friendships (
    friendship_id VARCHAR(200) DEFAULT (UUID()) not null PRIMARY KEY,
    user_id1 VARCHAR(200),
    user_id2 VARCHAR(200),
    status ENUM('pending', 'accepted') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id1) REFERENCES users(user_id),
    FOREIGN KEY (user_id2) REFERENCES users(user_id)
);


CREATE TABLE IF NOT EXISTS notifications (
    notification_id  VARCHAR(200) DEFAULT (UUID()) not null PRIMARY KEY,
    user_id VARCHAR(200),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO pictures (picture_url) VALUE ('defaultProfile.png');