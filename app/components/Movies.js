/**
 * The following components are responsible for rendering the movies page, i.e.
 * the page that lists an overview of all movies that have been reviewd as
 * matching a given emotion.
 */

import React, { Component } from 'react'
import request from 'superagent'
import MovieDetail from './modals/MovieDetail'
import AddRating from './modals/AddRating'
import { Link } from 'react-router'

/**
 * Movie is the component that is responsible for rendering a single movie
 * inside the grid of all movies for a given emotion. It is a stateless
 * component, as such it was written using the shorthand notation.
 */

const Movie = ({movie, onClick}) => (
    <li className="movie-entry" data-col="1-6" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w396/${movie.poster_path})`}} onClick={onClick}>
        <h2 className="h3 movie-title">{movie.title}</h2>
        <div className="movie-emotion" style={{ opacity: movie.percentage }}>a</div>
    </li>
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

        this.getMovies()
    }

    /**
     * getMovies() gets a list of all movies that have been reviewed as matching
     * the given emotion. It updates the state once the data has been fetched.
     *
     * @param  emotion  string
     *
     * @TODO Check for valid emotion and redirect to 404 if invalid.
     */

    getMovies() {
        request.get(`/api/movies/${this.props.params.emotion}/`)
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
                <ul className="unstyled-list movies-list" data-grid="gutterless">
                    {this.state.movies.map(m => <Movie key={m.id} movie={m} onClick={() => this.movieDetail.openModal(m.id)} />)}
                </ul>
                <section data-grid className="options">
                    <div data-col="1-6">
                        <Link to="/"><button data-button="block">Change your mood</button></Link>
                    </div>
                    <div data-col="1-6">
                        <button data-button="block" onClick={() => this.addRating.openModal()}>Rate a movie</button>
                    </div>
                    <div data-col="3-6 empty"></div>
                    <div data-col="1-6">
                        <button data-button="block">Sort by</button>
                    </div>
                </section>
                <MovieDetail ref={m => this.movieDetail = m} />
                <AddRating ref={a => this.addRating = a} addCallback={() => { this.getMovies(); this.addRating.closeModal() }} />
            </main>
        )
    }
}
