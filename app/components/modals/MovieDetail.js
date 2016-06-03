/**
 * This component is responsible for showing detailed information about a single
 * movie inside a modal.
 */

import React, { Component } from 'react'
import request from 'superagent'
import Modal from 'react-modal'
import isEmpty from 'lodash.isempty'

export default class MovieDetail extends Component {

    // React Modal expects styling to be passed as inline styles.

    static modalStyle = {
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
                        isOpen: true,
                        detail: res.body,
                        totalRatings: res.body.emotions.reduce((acc, el) => acc + +el.count, 0)
                    })
                }
            })
    }

    /**
     * @todo document
     */

    addRating(emotionId) {
        request.post('/api/reviews/')
            .set('Content-Type', 'application/json')
            .send(`{ "movieId": ${this.state.detail.id}, "emotionId": ${emotionId} }`)
            .end((err, res) => {
                if (!err) {
                    const emotions = this.state.detail.emotions
                    const count = emotions[emotions.indexOf(emotions.filter(e => e.id == emotionId)[0])].count
                    emotions[emotions.indexOf(emotions.filter(e => e.id == emotionId)[0])].count = +count + 1

                    this.setState({
                        detail: Object.assign({}, this.state.detail, emotions),
                        totalRatings: this.state.totalRatings + 1
                    })
                }
            })
    }

    /**
     * Close the modal and clear information about the previously selected
     * movie.
     */

    closeModal() {
        this.props.rateCallback(this.state.detail.id, this.state.detail.emotions.filter(e => e.emotion == this.props.emotion)[0].count / +this.state.totalRatings)

        this.setState({
            isOpen: false,
            detail: {},
            totalRatings: 0
        })
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} style={MovieDetail.modalStyle} onRequestClose={() => this.closeModal()}>
                <section data-grid="gutterless">
                    <div data-col="1-3" className="detail-poster" style={{ backgroundImage: this.state.detail.poster_path ? `url(https://image.tmdb.org/t/p/w396/${this.state.detail.poster_path})` : 'none'}}></div>
                    <div data-col="2-3" className="detail-content">
                        <h2 className="h3 detail-title"><span className="highlighted">{this.state.detail.title}</span> ({this.state.detail.release_year})</h2>
                        <p>{!isEmpty(this.state.detail.directors) ? `by ${this.state.detail.directors.join(', ')} — ` : null}{this.state.detail.runtime} mins</p>
                        {!isEmpty(this.state.detail.cast) ? <p>Cast: {this.state.detail.cast.join(', ')}</p> : null}
                        <ul className="unstyled-list percentage-list">
                            {!isEmpty(this.state.detail.emotions) ? this.state.detail.emotions.map(e => <li key={e.id} data-col="1-3" className="percentage"><span style={{ opacity: Math.min(1, (e.count / this.state.totalRatings) + 0.2) }} onClick={(ev) => { const target = ev.target; target.classList.add('is-highlighted'); this.addRating(e.id); setTimeout(() => target.classList.remove('is-highlighted'), 500) }}>{Math.round(e.count / +this.state.totalRatings * 100)}% {e.emotion}</span></li>) : null}
                        </ul>
                    </div>
                </section>
            </Modal>
        )
    }
}
