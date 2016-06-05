/**
 * This component is responsible for showing detailed information about a single
 * movie inside a modal.
 */

import React, { Component, PropTypes } from 'react'
import request from 'superagent'
import Modal from 'react-modal'
import isEmpty from 'lodash/isempty'

import { PercentageEmotion } from '../emotions/Emotion'

export default class MovieDetail extends Component {
    static propTypes = {
        rateCallback: PropTypes.func.isRequired,
        emotion: PropTypes.string.isRequired
    }

    // React Modal expects styling to be passed as inline styles.

    static modalStyle = {
        overlay: {
            zIndex: 2
        },
        content: {
            top: '50%',
            left: '50%',
            border: 0,
            backgroundColor: '#2c3641',
            right: 'auto',
            bottom: 'auto',
            width: '50em',
            marginLeft: '-25em',
            height: '25em',
            marginTop: '-12.5em',
            padding: 0,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.6)'
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            detail: {},
            totalRatings: 0
        }

        this.hasChanged = false
    }

    /**
     * Open the modal and fetch information about the selected movie.
     *
     * @param   {integer}  movieId  The ID of the movie to load information
     *                              about.
     *
     * @return  {void}
     */

    openModal(movieId) {
        request.get(`/api/movies/${movieId}/`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        isOpen: true,
                        detail: res.body,
                        totalRatings: res.body.emotions.reduce((acc, el) => acc + +el.count, 0)
                    })
                }
            })
    }

    /**
     * addRating() adds a new rating for the currently displayed movie with the
     * given emotionId. The modal is updated with the new percentages of
     * emotional matches.
     *
     * @param   {integer}  emotionId  The emotion to use for the rating.
     *
     * @return  {void}
     */

    addRating(emotionId) {
        request.post('/api/reviews/')
            .set('Content-Type', 'application/json')
            .send(`{ "movieId": ${this.state.detail.id}, "emotionId": ${emotionId} }`)
            .end(err => {
                if (!err) {
                    this.hasChanged = true

                    // Update the count of the just selected emotion. The
                    // totalRatings count is also updated so the percentages all
                    // work correctly.

                    const emotions = this.state.detail.emotions
                    const count = emotions[emotions.indexOf(emotions.filter(e => e.id == emotionId)[0])].count
                    emotions[emotions.indexOf(emotions.filter(e => e.id == emotionId)[0])].count = +count + 1

                    this.setState({
                        detail: { ...this.state.detail, emotions },
                        totalRatings: this.state.totalRatings + 1
                    })
                }
            })
    }

    /**
     * Close the modal and clear information about the previously selected
     * movie. A rateCallback() function is called so other components are
     * informed about the changes to the movie's percentage of emotional
     * matches.
     *
     * @return  {void}
     */

    closeModal() {
        this.props.rateCallback(this.state.detail.id, this.state.detail.emotions.filter(e => e.emotion == this.props.emotion)[0].count / +this.state.totalRatings, this.hasChanged)

        this.hasChanged = false

        this.setState({
            isOpen: false
        })

        // Only reset the state of the modal after the animation has finished.

        setTimeout(() => this.setState({
            detail: {},
            totalRatings: 0
        }), 250)
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen}
                   style={MovieDetail.modalStyle}
                   onRequestClose={() => this.closeModal()}
                   closeTimeoutMS={350}>
                <section data-grid="gutterless">
                    <div data-col="1-3"
                         className="detail-poster"
                         style={{ backgroundImage: this.state.detail.poster_path ? `url(https://image.tmdb.org/t/p/w396/${this.state.detail.poster_path})` : 'none'}}></div>
                    <div data-col="2-3"
                         className="detail-content">
                        <h2 className="h3 detail-title">
                            <span className="highlighted">{this.state.detail.title}</span>
                            ({this.state.detail.release_year})
                        </h2>
                        <p>{!isEmpty(this.state.detail.directors) && `by ${this.state.detail.directors.join(', ')} — `}{this.state.detail.runtime} mins</p>
                        {!isEmpty(this.state.detail.cast) &&
                            <p>Cast: {this.state.detail.cast.join(', ')}</p>
                        }
                        <ul className="unstyled-list percentage-list">
                            {!isEmpty(this.state.detail.emotions) &&
                                this.state.detail.emotions.map(e => (
                                    <PercentageEmotion key={e.id}
                                                       percentage={e.count / +this.state.totalRatings}
                                                       emotion={e.emotion}
                                                       id={e.id}
                                                       onClick={i => this.addRating(i)} />
                                ))
                            }
                        </ul>
                    </div>
                </section>
            </Modal>
        )
    }
}
