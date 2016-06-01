/**
 * The following components are responsible for rendering the movies page, i.e.
 * the page that lists an overview of all movies that have been reviewd as
 * matching a given emotion.
 */

import React, { Component } from 'react'
import request from 'superagent'
import Modal from 'react-modal'

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

export class Movies extends Component {
    constructor(props) {
        super(props)

        this.state = {
            movies: [],
            isDetailModalOpen: false,
            detail: {
                title: '',
                directors: [],
                cast: []
            }
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

    /**
     * Open the modal and fetch information about the selected movie.
     *
     * @param  id  integer
     */

    openModal(id) {
        request.get(`/api/movies/${id}/`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        isDetailModalOpen: true,
                        detail: res.body
                    })
                }
            })
    }

    /**
     * Close the modal and clear information about the previously selected
     * movie.
     */

    closeModal() {
        this.setState({
            isDetailModalOpen: false,
            detail: {
                title: '',
                directors: [],
                cast: []
            }
        })
    }

    render() {
        document.title = `Movies that'll make you feel ${this.props.params.emotion}!`

        // React Modal expects styling to be passed as inline styles.

        const modalStyle = {
            overlay: {
                backgroundColor: 'rgba(30, 30, 30, 0.85)'
            },
            content: {
                top: '50%',
                left: '50%',
                border: 0,
                backgroundColor: '#2c3641',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
                width: '50em',
                height: '25em',
                padding: 0,
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.8)'
            }
        }

        return (
            <main className="wrapper">
                <div data-grid="gutterless">
                    {this.state.movies.map(m => <Movie key={m.id} movie={m} onClick={() => this.openModal(m.id)} />)}
                </div>
                <Modal isOpen={this.state.isDetailModalOpen} style={modalStyle} onRequestClose={() => this.closeModal()}>
                    <div data-grid="gutterless">
                        <div data-col="1-3" className="detail-poster" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w396/${this.state.detail.poster_path})`}}></div>
                        <div data-col="2-3" className="detail-content">
                            <h2 className="h3">{this.state.detail.title} <span className="muted">({this.state.detail.release_year})</span></h2>
                            <p>Directed by {this.state.detail.directors.join(', ')}</p>
                            <p>Starring {this.state.detail.cast.join(', ')}</p>
                        </div>
                    </div>
                </Modal>
            </main>
        )
    }
}
