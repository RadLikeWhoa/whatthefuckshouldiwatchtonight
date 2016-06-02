/**
 * The following components are responsible for rendering the movies page, i.e.
 * the page that lists an overview of all movies that have been reviewd as
 * matching a given emotion.
 */

import React, { Component } from 'react'
import request from 'superagent'
import MovieDetail from './modals/MovieDetail'
import AddRating from './modals/AddRating'

/**
 * Movie is the component that is responsible for rendering a single movie
 * inside the grid of all movies for a given emotion. It is a stateless
 * component, as such it was written using the shorthand notation.
 */

const Movie = ({movie, onClick}) => (
    <div className="movie-entry" data-col="1-6" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w396/${movie.poster_path})`}} onClick={onClick}>
        <div className="movie-title">{movie.title}</div>
        <div className="movie-emotion" style={{ opacity: movie.percentage }}>a</div>
    </div>
)

/**
 * Movies is the container Component for the movie overview. It is responsible
 * for handling the state of the movies and fetching them. It controls the
 * rendering of the movies page.
 */

export default class Movies extends Component {
    constructor(props) {
        super(props)

        this.state = {
            movies: []
        }

        // Grab the emotion name from the request params.

        this.getMoviesForEmotion(this.props.params.emotion)
    }

    /**
     * getMoviesForEmotion() gets a list of all movies that have been reviewed
     * as matching the given emotion. It updates the state once the data has
     * been fetched.
     *
     * @param  emotion  string
     *
     * @TODO Check for valid emotion and redirect to 404 if invalid.
     */

    getMoviesForEmotion(emotion) {
        request.get(`/api/movies/${emotion}/`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        movies: res.body.movies
                    })
                }
            })
    }

    render() {
        document.title = `Movies that'll make you feel ${this.props.params.emotion}!`

        return (
            <main className="wrapper">
                <div data-grid="gutterless">
                    {this.state.movies.map(m => <Movie key={m.id} movie={m} onClick={() => this.movieDetail.openModal(m.id)} />)}
                </div>
                <MovieDetail ref={m => this.movieDetail = m} />
                <AddRating ref={a => this.addRating = a} />
            </main>
        )
    }
}
