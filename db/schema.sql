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
    tagline       VARCHAR(250),
    poster_path   VARCHAR(100)  NOT NULL,
    runtime       INT(5)        NOT NULL,
    release_date  DATETIME      NOT NULL,
    imdb_id       VARCHAR(20),
    PRIMARY KEY (id)
);

CREATE TABLE persons (
    id            INT(9),
    full_name     VARCHAR(100)  NOT NULL,
    credit_order  INT(3)        NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE emotions (
    id       INT(9),
    emotion  VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE reviews (
    id           INT(9),
    emotion_id   INT(9)    NOT NULL,
    review_date  DATETIME  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (emotion_id) REFERENCES emotions (id)
);

CREATE TABLE movie_persons (
    movie_id  INT(9) NOT NULL,
    person_id INT(9) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (person_id) REFERENCES persons (id)
);
