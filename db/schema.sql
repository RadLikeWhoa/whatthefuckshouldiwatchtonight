CREATE DATABASE IF NOT EXISTS wtfsiwt;
USE wtfsiwt;

DROP TABLE IF EXISTS movie_persons;
DROP TABLE IF EXISTS persons;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS emotions;

CREATE TABLE movies (
    id            INT(9),
    title         VARCHAR(100)  NOT NULL,
    poster_path   VARCHAR(100)  NOT NULL,
    runtime       INT(5)        NOT NULL,
    release_year  INT(4)        NOT NULL,
    PRIMARY KEY (id)
) ENGINE = INNODB CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE persons (
    id            INT(9),
    full_name     VARCHAR(100)  NOT NULL,
    PRIMARY KEY (id)
) ENGINE = INNODB CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE emotions (
    id       INT(9)       AUTO_INCREMENT,
    emotion  VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id)
) ENGINE = INNODB CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE reviews (
    id           INT(9)     AUTO_INCREMENT,
    movie_id     INT(9)     NOT NULL,
    emotion_id   INT(9)     NOT NULL,
    review_date  TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (emotion_id) REFERENCES emotions (id)
) ENGINE = INNODB CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE movie_persons (
    movie_id      INT(9)  NOT NULL,
    person_id     INT(9)  NOT NULL,
    credit_order  INT(3)  NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (person_id) REFERENCES persons (id),
    CONSTRAINT unique_mp UNIQUE (movie_id, person_id)
) ENGINE = INNODB CHARACTER SET utf8 COLLATE utf8_general_ci;
