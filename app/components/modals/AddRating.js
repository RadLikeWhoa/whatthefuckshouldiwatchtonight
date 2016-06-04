/**
 * This component is responsible for letting users add ratings for movies.
 */

import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import request from 'superagent'
import Modal from 'react-modal'
import isEmpty from 'lodash.isempty'
import debounce from 'lodash.debounce'

const apiKey = '3b699b130bdb1b0397cd703da00dcbeb'

const Emotion = ({name, isSelected, onClick}) => (
    <li data-col="1-3">
        <button onClick={onClick} className={'selectable-emotion' + (isSelected ? ' is-selected' : '')}>{name}</button>
    </li>
)

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
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.6)'
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            movie: {},
            emotions: [],
            searchResults: []
        }

        this.getEmotions()

        this.searchInProgress = false

        this.search = debounce(this.search, 500)
    }

    getEmotions() {
        request.get('/api/emotions/')
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!err) {
                    const emotions = res.body.emotions

                    emotions.forEach((e, i) => emotions[i].selected = false)

                    this.setState({
                        emotions: emotions
                    })
                }
            })
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

    selectedSearchResult(id) {
        if (this.searchInProgress) return

        this.searchInProgress = true

        request.get(`http://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        movie: res.body
                    })
                }
            })
    }

    selectedEmotion(index) {
        const emotions = this.state.emotions

        emotions.forEach((e, i) => emotions[i].selected = false)
        emotions[index].selected = true

        this.setState({
            emotions: emotions
        })
    }

    saveRating() {
        const selectedEmotion = this.state.emotions.filter(e => e.selected)

        if (isEmpty(selectedEmotion)) return

        request.post('/api/movies/')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ ...this.state.movie, emotionId: selectedEmotion[0].id }))
            .end((err, res) => {
                if (!err) {
                    browserHistory.push(`/${selectedEmotion[0].emotion}/`)

                    if (this.props.addCallback) {
                        this.props.addCallback(selectedEmotion[0].emotion)
                    }
                }
            })
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
        const emotions = this.state.emotions

        emotions.forEach((e, i) => emotions[i].selected = false)

        this.setState({
            isOpen: false,
            movie: {},
            emotions: emotions,
            searchResults: []
        })

        this.searchInProgress = false
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} style={AddRating.modalStyle} onRequestClose={() => this.closeModal()} onAfterOpen={() => this.onAfterOpen()}>
                <section style={{ display: isEmpty(this.state.movie) ? 'block' : 'none' }}>
                    <input name="movie-name" type="text" className="text-input full-width search-box" placeholder="Search for a movie…" ref={i => this.searchBox = i} onChange={(ev) => this.search(ev.target.value)}/>
                    <section className="search-results">
                        <ul className="search-results-list unstyled-list">
                            {this.state.searchResults.map(r => <li className="search-result-item" key={r.id} onClick={() => this.selectedSearchResult(r.id)}>{r.title}{(() => { const date = (new Date(r.release_date)).getFullYear(); return !isNaN(date) ? ` (${date})` : '' })()}</li>)}
                        </ul>
                    </section>
                </section>
                <section style={{ display: !isEmpty(this.state.movie) ? 'block' : 'none' }}>
                    <section data-grid>
                        <section className="clearfix add-movie-information">
                            <div data-col="1-6">
                                <img className="result-poster" src={this.state.movie.poster_path ? `https://image.tmdb.org/t/p/w185${this.state.movie.poster_path}` : ''} />
                            </div>
                            <div data-col="5-6">
                                <h2 className="h3 detail-title"><span className="highlighted">{this.state.movie.title}</span>{(() => { const date = (new Date(this.state.movie.release_date)).getFullYear(); return !isNaN(date) ? ` (${date})` : '' })()}</h2>
                                {!isEmpty(this.state.movie.credits) ? <p>{this.state.movie.credits.crew.filter(c => c.job == "Director").map(c => c.name).join(', ')}</p> : null}
                            </div>
                        </section>
                        <ul className="unstyled-list clearfix selectable-emotions-list">
                            {this.state.emotions.map((e, i) => <Emotion name={e.emotion} isSelected={e.selected} key={i} onClick={() => this.selectedEmotion(i)} />)}
                        </ul>
                        <div data-col="1-2">
                            <button data-button="block secondary" onClick={() => this.closeModal()}>Cancel</button>
                        </div>
                        <div data-col="1-2">
                            <button data-button="block" onClick={() => this.saveRating()}>Save Rating</button>
                        </div>
                    </section>
                </section>
            </Modal>
        )
    }
}
