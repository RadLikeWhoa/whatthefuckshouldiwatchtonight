<?php

error_reporting(E_ALL);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../../vendor/autoload.php';
require 'config.php';

/**
 * Attempt to create a new PDO connection using the values entered in the
 * config file.
 *
 * @return  PDO
 */

function connect() {
    try {
        $db = new PDO('mysql:host=' . HOST . ';port=' . PORT . ';dbname=' . DB, USER, PWD);
    } catch (PDOException $e) {
        return [];
    }

    $db->exec('SET NAMES UTF8');
    return $db;
}

/**
 * Query the database using a prepared statement with optional parameter
 * bindings.
 *
 * @param   $statement  string
 * @param   $params     [string => string]
 *
 * @return  [string => string]
 */

function query($statement, $params = []) {
    $db = connect();
    $query = $db->prepare($statement);

    // Bind the given parameters to their values.

    foreach ($params as $key => $val) {
        $query->bindParam(':' . $key, $val);
    }

    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);

    return count($result) > 0 ? $result : [];
}

/**
 * Convenience method for retrieving a single row from the database.
 *
 * @see query($statement, $params)
 */

function querySingle($statement, $params = []) {
    $result = query($statement, $params);
    return count($result) > 0 ? $result[0] : null;
}

/**
 * Insert each row of data in a single statement. The transaction is rolled back
 * if there are any errors. A boolean is returned indicating whether the
 * insertion was successful or not.
 *
 * @param   $statement  string
 * @param   $params     [AnyObject]
 *
 * @return  boolean
 */

function insert($statement, $values = []) {
    $db = connect();
    $db->beginTransaction();

    $query = $db->prepare($statement);

    try {
        foreach ($values as $value) {
            $query->execute($value);
        }
    } catch (Exception $e) {
        $db->rollBack();
        return false;
    }

    $db->commit();
    return true;
}

$app = new \Slim\App();

/**
 * /emotions/ lists all emotions from the database. There is no further
 * configuration.
 */

$app->get('/emotions/', function (Request $request, Response $response) {
    $emotions = query('SELECT * FROM emotions');

    return $response->withJson([ 'emotions' => $emotions ]);
});

/**
 * /movies/{emotion}/ lists all movies that have been reviewed as matching a
 * given emotion. It includes the share of reviews for the given emotion.
 *
 * Invalid emotion names return a 404 status code.
 */

$app->get('/movies/{emotion:[a-z]+}/{orderBy}/{direction}/', function (Request $request, Response $response) {
    // Return with a 404 status code if the emotion does not exist

    if (querySingle('SELECT EXISTS(SELECT * FROM emotions WHERE emotion = :emotion) AS ex', [ 'emotion' => $request->getAttribute('emotion') ])['ex'] == '0') {
        return $response->withStatus(404);
    }

    $query = 'SELECT m.*, (SELECT COUNT(*) FROM reviews r WHERE r.emotion_id = (SELECT e.id FROM emotions e WHERE e.emotion = :emotion) AND r.movie_id = m.id) / (SELECT COUNT(*) FROM reviews r WHERE r.movie_id = m.id) AS percentage, (SELECT r.review_date FROM reviews r WHERE r.movie_id = m.id ORDER BY r.review_date DESC LIMIT 1) AS latest_review_date, (SELECT r.review_date FROM reviews r WHERE r.movie_id = m.id ORDER BY r.review_date ASC LIMIT 1) AS first_review_date FROM movies m HAVING percentage > 0';

    $orderBy = $request->getAttribute('orderBy');
    $direction = $request->getAttribute('direction');

    // Determine the order criteria based on the URL.

    if ($orderBy == 'date-added') {
        $query .= ' ORDER BY ' . ($direction == 'ascending' ? 'first_review_date' : 'latest_review_date');
    } else if ($orderBy == 'release-date') {
        $query .= ' ORDER BY m.release_year';
    } else if ($orderBy == 'match') {
        $query .= ' ORDER BY percentage';
    }

    // We limit the movies to 102 to have a smaller set of data and to emphasize
    // the ephermal nature of our tool.

    $query .= ($direction == 'ascending' ? ' ASC' : ' DESC') . ' LIMIT 102';

    $movies = query($query, [
        'emotion' => $request->getAttribute('emotion')
    ]);

    return $response->withJSON([ 'movies' => $movies ]);
});

/**
 * /movies/{id}/ retrieves information about a single movie. Included is the
 * number of reviews posted for each emotion and the list of directors and cast.
 */

$app->get('/movies/{id:[0-9]+}/', function (Request $request, Response $response) {
    $movie = querySingle('SELECT m.* FROM movies m WHERE m.id = :id', [
        'id' => $request->getAttribute('id')
    ]);

    // Return with a 404 status code if no movie was found for the given ID.

    if (is_null($movie)) {
        return $response->withStatus(404);
    }

    $emotions = query('SELECT e.id, e.emotion, (SELECT COUNT(r.id) FROM reviews r WHERE r.movie_id = :id AND r.emotion_id = e.id) AS count FROM emotions e', [
        'id' => $request->getAttribute('id')
    ]);

    $crew = query('SELECT p.*, mp.credit_order FROM persons p, movie_persons mp WHERE mp.person_id = p.id AND mp.movie_id = :id ORDER BY mp.credit_order', [
        'id' => $request->getAttribute('id')
    ]);

    // Include emotions and their rating percentage in the movie response.

    $movie['emotions'] = $emotions;

    // Directors don't have a credit order. We only need their full name.

    $movie['directors'] = array_map(function ($e) {
        return $e['full_name'];
    }, array_values(array_filter($crew, function ($e) {
        return $e['credit_order'] == 0;
    })));

    // Cast members have a credit order. We only need their full name.

    $movie['cast'] = array_map(function ($e) {
        return $e['full_name'];
    }, array_values(array_filter($crew, function ($e) {
        return $e['credit_order'] > 0;
    })));

    return $response->withJSON($movie);
});

/**
 * @todo document
 */

$app->post('/movies/', function (Request $request, Response $response) {
    $body = $request->getParsedBody();

    // Check if the movie already exists in the database.

    $exists = query('SELECT EXISTS(SELECT * FROM movies WHERE id = :id) AS ex', [
        'id' => $body['id']
    ]);

    if ($exists['ex'] == 0) {

        // Insert a new record for the movie using the information from TMDB.

        $i1 = insert('INSERT INTO movies (id, title, poster_path, runtime, release_year) VALUES (?, ?, ?, ?, ?)', [
            [ $body['id'], $body['title'], $body['poster_path'], $body['runtime'], substr($body['release_date'], 0, 4) ]
        ]);

        // Insert the top 5 cast members and all directors for the movie.

        $cast = array_map(function ($c) {
            return [ $c['id'], $c['name'], $c['order'] + 1 ];
        }, array_slice($body['credits']['cast'], 0, 5));

        $crew = array_map(function ($c) {
            return [ $c['id'], $c['name'], 0 ];
        }, array_values(array_filter($body['credits']['crew'], function ($c) {
            return $c['job'] == 'Director';
        })));

        $i2 = insert('INSERT INTO persons (id, full_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = id', array_map(function ($c) {
            return [ $c[0], $c[1] ];
        }, array_merge($cast, $crew)));

        // Assign persons to the newly created movie.

        $i3 = insert('INSERT INTO movie_persons (movie_id, person_id, credit_order) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE movie_id = movie_id', array_map(function ($c) use ($body) {
            return [ $body['id'], $c[0], $c[2] ];
        }, array_merge($cast, $crew)));
    }

    // Add a review for the movie, regardless of whether it previously existed
    // or not.

    $i4 = insert('INSERT INTO reviews (movie_id, emotion_id) VALUES (?, ?)', [
        [ $body['id'], $body['emotionId'] ]
    ]);

    // Return with a 201 status code if the request was successful or with a 500
    // code if there was an error during one of the insertions.

    return $response->withStatus($i1 && $i2 && $i3 && $i4 ? 201 : 500);
});

/**
 * @todo document
 */

$app->post('/reviews/', function (Request $request, Response $response) {
    $body = $request->getParsedBody();

    $i1 = insert('INSERT INTO reviews (movie_id, emotion_id) VALUES (?, ?)', [
        [ $body['movieId'], $body['emotionId'] ]
    ]);

    // Return with a 201 status code if the request was successful or with a 500
    // code if there was an error during the insertions.

    return $response->withStatus($i1 ? 201 : 500);
});

$app->run();
