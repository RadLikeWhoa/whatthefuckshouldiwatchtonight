/**
 * This component is responsible for letting users add ratings for movies.
 */

import React, { Component } from 'react'
import request from 'superagent'
import Modal from 'react-modal'
import { debounce } from 'lodash'

const apiKey = '3b699b130bdb1b0397cd703da00dcbeb'

export default class AddRating extends Component {

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
            width: '40em',
            height: '30em',
            padding: '1.5em',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.8)'
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            movie: {},
            searchResults: []
        }

        this.search = debounce(this.search, 300)
    }

    search(query) {
        if (query) {
            request.get(`http://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
                .set('Accept', 'application/json')
                .end((err, res) => {
                    if (!err) {
                        this.setState({
                            searchResults: res.body.results
                        })
                    }
                })
        } else {
            this.setState({
                searchResults: []
            })
        }
    }

    openModal() {
        this.setState({
            isOpen: true
        })
    }

    onAfterOpen() {
        this.searchBox.focus()
    }

    closeModal() {
        this.setState({
            isOpen: false,
            searchResults: []
        })
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} style={AddRating.modalStyle} onRequestClose={() => this.closeModal()} onAfterOpen={() => this.onAfterOpen()}>
                <input name="movie-name" type="text" className="text-input full-width search-box" placeholder="Search for a movie…" ref={i => this.searchBox = i} onChange={(ev) => this.search(ev.target.value)}/>
                <section className="search-results">
                    <ul className="search-results-list unstyled-list">
                        {this.state.searchResults.map(r => <li className="search-result-item" key={r.id}>{r.title} ({(new Date(r.release_date)).getFullYear()})</li>)}
                    </ul>
                </section>
            </Modal>
        )
    }
}
