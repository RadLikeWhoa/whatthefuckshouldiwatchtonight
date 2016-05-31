<?php

error_reporting(E_ALL);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../../vendor/autoload.php';
require 'config.php';

/**
 * connectDB() attempts to create a PDO connection to the database and throws an
 * error if it fails.
 *
 * @TODO Improve error handling
 */

function connectDB() {
    try {
        return new PDO('mysql:host=' . HOST . ';port=' . PORT . ';dbname=' . DB, USER, PWD);
    } catch (PDOException $e) {
        exit('Could not connect to database: ' . $e->getMessage());
    }
}

$app = new \Slim\App();

/**
 * /emotions/ lists all emotions from the database. There is no further
 * configuration.
 */

$app->get('/emotions/', function (Request $request, Response $response) {
    $db = connectDB();

    $results = $db->query('SELECT * FROM emotions')->fetchAll(PDO::FETCH_ASSOC);

    return $response->withJson([ 'emotions' => $results ]);
});

/**
 * /movies/{emotion}/ lists all movies that have been reviewed as matching a
 * given emotion. It includes the percentage of reviews that have the given
 * emotion.
 */

$app->get('/movies/{emotion:[a-z]+}/', function (Request $request, Response $response) {
    $db = connectDB();

    $query = $db->prepare('SELECT m.*, (SELECT COUNT(*) FROM reviews r WHERE r.emotion_id = (SELECT e.id FROM emotions e WHERE e.emotion = :emotion) AND r.movie_id = m.id) / (SELECT COUNT(*) FROM reviews r WHERE r.movie_id = m.id) AS percentage FROM movies m HAVING percentage > 0 LIMIT 102');
    $query->bindParam(':emotion', $request->getAttribute('emotion'));
    $query->execute();

    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    return $response->withJSON([ 'movies' => $results ]);
});

$app->get('/movies/{id:[0-9]+}/', function (Request $request, Response $response) {
    $db = connectDB();

    $query = $db->prepare('SELECT m.* FROM movies m where m.id = :id');
    $query->bindParam(':id', $request->getAttribute('id'));
    $query->execute();

    $result = $query->fetch(PDO::FETCH_ASSOC);

    $query = $db->prepare('SELECT e.emotion, COUNT(r.id) AS count FROM reviews r, emotions e WHERE r.movie_id = :id AND r.emotion_id = e.id GROUP BY r.emotion_id');
    $query->bindParam(':id', $request->getAttribute('id'));
    $query->execute();

    $emotions = $query->fetchAll(PDO::FETCH_ASSOC);

    $result['emotions'] = array_reduce($emotions, function ($c, $i) {
	    return array_merge($c, [ $i['emotion'] => $i['count'] ]);
    }, []);

    return $response->withJSON($result);
});

$app->run();
