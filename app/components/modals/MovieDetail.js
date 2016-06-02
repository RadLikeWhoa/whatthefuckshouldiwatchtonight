/**
 * This component is responsible for showing detailed information about a single
 * movie inside a modal.
 */

import React, { Component } from 'react'
import request from 'superagent'
import Modal from 'react-modal'

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
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.8)'
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            detail: {
                title: '',
                directors: [],
                cast: []
            }
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
            isOpen: false,
            detail: {
                title: '',
                directors: [],
                cast: []
            }
        })
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} style={MovieDetail.modalStyle} onRequestClose={() => this.closeModal()}>
                <section data-grid="gutterless">
                    <div data-col="1-3" className="detail-poster" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w396/${this.state.detail.poster_path})`}}></div>
                    <div data-col="2-3" className="detail-content">
                        <h2 className="h3 detail-title">{this.state.detail.title} <span className="muted">({this.state.detail.release_year})</span></h2>
                        <p>by {this.state.detail.directors.join(', ')}</p>
                        <p>Cast: {this.state.detail.cast.join(', ')}</p>
                    </div>
                </section>
            </Modal>
        )
    }
}
