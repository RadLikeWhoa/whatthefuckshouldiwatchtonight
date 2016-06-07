/**
 * The following components are responsible for rendering the movies page, i.e.
 * the page that lists an overview of all movies that have been reviewd as
 * matching a given emotion.
 */

import React, { Component, PropTypes } from 'react'
import Alert from 'react-s-alert'
import { browserHistory } from 'react-router'
import request from 'superagent'

import MovieDetail from '../components/modals/MovieDetail'
import AddRating from '../components/modals/AddRating'
import Options from '../components/movies/Options'
import Movie from '../components/movies/Movie'
import { handleRequest } from '../utils'

/**
 * Movies is the container Component for the movie overview. It is responsible
 * for handling the state of the movies and fetching them. It controls the
 * rendering of the movies page.
 */

class Movies extends Component {
    static propTypes = {
        params: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)

        this.state = {
            movies: [],
            order: {
                by: 'date-added',
                direction: 'descending'
            }
        }

        this.getMovies(this.state.order.by, this.state.order.direction)
    }

    /**
     * Reload the list of movies whenever the order criteria has changed.
     *
     * @param   {object}  nextProps  The props after the component was updated.
     * @param   {object}  nextState  The state after the component was updated.
     *
     * @return  {void}
     */

    componentWillUpdate(nextProps, nextState) {
        if (this.state.order != nextState.order) {
            this.getMovies(nextState.order.by, nextState.order.direction)
        } else if (this.props.params.emotion != nextProps.params.emotion) {
            this.getMovies(nextState.order.by, nextState.order.direction)
            this.movieDetail.closeModal()
            this.addRating.closeModal()
        }
    }

    /**
     * getMovies() gets a list of all movies that have been reviewed as matching
     * the given emotion. It updates the state once the data has been fetched.
     *
     * @param   {string}  orderBy         The criteria to use for sorting the
     *                                    list of movies.
     * @param   {string}  orderDirection  The direction in which the list of
     *                                    movies should be ordered (asc / desc).
     *
     * @return  {void}
     */

    getMovies(orderBy, orderDirection) {
        this.moviesRequest = request.get(`/api/movies/${this.props.params.emotion}/${orderBy}/${orderDirection}/`)
            .set('Accept', 'application/json')
            .end((err, res) => handleRequest(err, res, res => {
                this.setState({
                    movies: res.body.movies
                })

                this.moviesRequest = null
            }, err => {
                if (err.status == 404) {
                    browserHistory.push('/')
                } else {
                    Alert.error('Could not retrieve movies for the current emotion. Please try again.')
                }

                this.moviesRequest = null
            }))
    }

    /**
     * Update the list of movies whenever a rating has been cast inside the
     * detail modal. The old entry for the movie is replaced with a new object
     * containing the new percentage. This affects only the list of movies, not
     * the detail modal.
     *
     * @param   {integer}  movieId     The ID of the movie that was udpated.
     * @param   {float}    percentage  The new percentage of the movie that was
     *                                 updated.
     * @param   {boolean}  hasChanged  Determines whether there was a new vote
     *                                 for the movie.
     *
     * @return  {void}
     */

    updateMovieEmotion(movieId, percentage, hasChanged) {
        if (!hasChanged) return

        const movie = this.state.movies.filter(m => m.id == movieId)[0]
        const index = this.state.movies.map(m => m.id).indexOf(movieId)

        // If a vote was cast we want to update the movie's timestamp in order
        // to list it at the top of the list if the order matches.

        const d = new Date()
        const timestamp = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`

        // Make use of the spread operator to avoid Object.assign and
        // Array.concat.

        this.setState({
            movies: [
                ...this.state.movies.slice(0, index),
                {
                    ...movie,
                    latest_review_date: timestamp || movie.latest_review_date,
                    percentage: percentage
                },
                ...this.state.movies.slice(index + 1)
            ].sort((m1, m2) => {
                if (this.state.order.by == 'date-added' && this.state.order.direction == 'descending') {

                    // Order the movies by their latest review date. These need
                    // to be parsed from the MySQL timestamp. This is only
                    // relevant if the list is sorted descending.

                    const df1 = m1.latest_review_date.split(/[: -]/)
                    const df2 = m2.latest_review_date.split(/[: -]/)

                    const d1 = new Date(df1[0], df1[1] - 1, df1[2], df1[3], df1[4], df1[5])
                    const d2 = new Date(df2[0], df2[1] - 1, df2[2], df2[3], df2[4], df2[5])

                    return d2 - d1
                } else if (this.state.order.by == 'match') {

                    // Order the movies by their emotional match, either
                    // ascending or descending.

                    const modifier = this.state.order.direction == 'descending' ? 1 : -1
                    return ((+m2.percentage) - (+m1.percentage)) * modifier
                }
            })
        })
    }

    /**
     * Cancel all requests before the component is unmounted.
     *
     * @return  {void}
     */

    componentWillUnmount() {
        if (this.moviesRequest) {
            this.moviesRequest.abort()
            this.moviesRequest = null
        }
    }

    render() {

        // Set the document title based on the current emotion.

        document.title = `Movies that'll make you feel ${this.props.params.emotion}!`

        return (
            <main className="wrapper">
                <ul className="unstyled-list movies-list"
                    data-grid="gutterless">
                    {this.state.movies.map(m => (
                        <Movie key={m.id}
                               title={m.title}
                               posterPath={m.poster_path}
                               percentage={m.percentage}
                               onClick={() => this.movieDetail.openModal(m.id)}
                               emotion={this.props.params.emotion} />
                    ))}
                </ul>
                <Options ref={o => this.options = o}
                         emotion={this.props.params.emotion}
                         onClickRate={() => this.addRating.openModal()}
                         order={this.state.order}
                         orderChangeCallback={o => this.setState({ order: o })} />
                <MovieDetail ref={m => this.movieDetail = m}
                             emotion={this.props.params.emotion}
                             rateCallback={(m, p, h) => this.updateMovieEmotion(m, p, h)} />
                <AddRating ref={a => this.addRating = a}
                           addCallback={() => { this.getMovies(this.state.order.by, this.state.order.direction); this.addRating.closeModal() }} />
                <Alert stack={{ limit: 1 }}
                       position="top"
                       effect="stackslide"
                       timeout={3500} />
            </main>
        )
    }
}

export default Movies
