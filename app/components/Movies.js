/**
 * The following components are responsible for rendering the movies page, i.e.
 * the page that lists an overview of all movies that have been reviewd as
 * matching a given emotion.
 */

import React, { Component } from 'react'
import { browserHistory } from 'react-router'
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
            movies: [],
            order: {
                by: 'date-added',
                direction: 'descending'
            },
            isOrderPopoverOpen: false
        }

        this.getMovies()
    }

    /**
     * Reload the list of movies whenever the order criteria has changed.
     *
     * @param  nextProps  object
     * @param  nextState  object
     */

    componentWillUpdate(nextProps, nextState) {
        if (this.state.order.by != nextState.order.by || this.state.order.direction != nextState.order.direction) {
            this.getMovies(nextState.order.by, nextState.order.direction)
        }
    }

    /**
     * getMovies() gets a list of all movies that have been reviewed as matching
     * the given emotion. It updates the state once the data has been fetched.
     *
     * @param  emotion         string
     * @param  orderBy         string
     * @param  orderDirection  string
     */

    getMovies(orderBy, orderDirection) {
        request.get(`/api/movies/${this.props.params.emotion}/${orderBy || this.state.order.by}/${orderDirection || this.state.order.direction}/`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        movies: res.body.movies
                    })
                } else if (res.statusCode == 404) {
                    browserHistory.push('/')
                }
            })
    }

    /**
     * @todo document
     */

    updateMovieEmotion(movieId, percentage) {
        const movie = this.state.movies.filter(m => m.id == movieId)[0]
        const index = this.state.movies.map(m => m.id).indexOf(movieId)

        this.setState({ movies: this.state.movies.slice(0, index).concat(Object.assign({}, movie, { percentage: percentage } )).concat(this.state.movies.slice(index + 1))})
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
                        <Link to="/"><button data-button="block" className="popover-container">
                            Change your mood
                            <div className="popover popover-informational">
                                Tired of feeling {this.props.params.emotion}?
                            </div>
                        </button></Link>
                    </div>
                    <div data-col="1-6">
                        <button data-button="block" onClick={() => this.addRating.openModal()}>Rate a movie</button>
                    </div>
                    <div data-col="3-6 empty"></div>
                    <div data-col="1-6">
                        <button data-button="block" className="popover-container" onClick={() => this.setState({ isOrderPopoverOpen: !this.state.isOrderPopoverOpen })}>
                            Sort by
                            <ul className={'unstyled-list popover' + (this.state.isOrderPopoverOpen ? ' is-visible' : '')}>
                                <li className={'popover-item' + (this.state.order.by == 'date-added' ? ' is-selected' : '')} onClick={() => this.setState({ order: { by: 'date-added', direction: this.state.order.direction } })}>Date added</li>
                                <li className={'popover-item' + (this.state.order.by == 'match' ? ' is-selected' : '')} onClick={() => this.setState({ order: { by: 'match', direction: this.state.order.direction } })}>Emotion match</li>
                                <li className={'popover-item' + (this.state.order.by == 'release-date' ? ' is-selected' : '')} onClick={() => this.setState({ order: { by: 'release-date', direction: this.state.order.direction } })}>Release date</li>
                                <div data-grid="gutterless">
                                    <div data-col="1-2">
                                        <li title="Sort descending" className={'popover-item centered-text' + (this.state.order.direction == 'descending' ? ' is-selected' : '')} onClick={() => this.setState({ order: { by: this.state.order.by, direction: 'descending' } })}><span data-icon="descending"></span></li>
                                    </div>
                                    <div data-col="1-2">
                                        <li title="Sort ascending" className={'popover-item centered-text' + (this.state.order.direction == 'ascending' ? ' is-selected' : '')} onClick={() => this.setState({ order: { by: this.state.order.by, direction: 'ascending' } })}><span data-icon="ascending"></span></li>
                                    </div>
                                </div>
                            </ul>
                        </button>
                    </div>
                </section>
                <MovieDetail ref={m => this.movieDetail = m} emotion={this.props.params.emotion} rateCallback={(m, p) => this.updateMovieEmotion(m, p)} />
                <AddRating ref={a => this.addRating = a} addCallback={() => { this.getMovies(); this.addRating.closeModal() }} />
            </main>
        )
    }
}
