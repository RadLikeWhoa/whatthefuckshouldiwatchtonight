/**
 * This component is responsible for letting users add ratings for movies.
 */

import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import request from 'superagent'
import Modal from 'react-modal'
import isEmpty from 'lodash.isempty'
import debounce from 'lodash.debounce'

// The API key is used when communicating with the TMDB API.

const apiKey = '3b699b130bdb1b0397cd703da00dcbeb'

/**
 * Emotion is a component that is rendered when giving the user the option to
 * select an emotion for the movie they are currently rating. It is a stateless
 * component, as such it was written using the shorthand notation.
 */

const Emotion = ({name, isSelected, onClick}) => (
    <li data-col="1-3">
        <button onClick={onClick} className={`selectable-emotion ${isSelected ? ' is-selected' : ''}`}>
            <img src={`/dist/svg/${name}.svg`} />
            {name}
        </button>
    </li>
)

Emotion.propTypes = {
    name: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
}

export default class AddRating extends Component {
    static propTypes = {
        addCallback: PropTypes.func
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
            width: '40em',
            marginLeft: '-20em',
            height: '30em',
            marginTop: '-15em',
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
            searchResults: [],
            searching: false
        }

        this.getEmotions()

        // selectedMovie prevents the user from selecting two movies from the
        // list of search results.

        this.selectedMovie = false

        // In order to not overload the TMDB API request, the search function is
        // debounced. That means that it is only called every 500ms at most.

        this.search = debounce(this.search, 500)
    }

    /**
     * Retrieve the list of emotions the user will be able to select after
     * choosing a movie.
     *
     * @return  {void}
     */

    getEmotions() {
        request.get('/api/emotions/')
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!err) {
                    const emotions = res.body.emotions

                    // Add a `selected` flag to each emotion.

                    emotions.forEach((e, i) => emotions[i].selected = false)

                    this.setState({
                        emotions: emotions
                    })
                }
            })
    }

    /**
     * Search for a given query on the TMDB API. It returns a list of movies.
     * The state is updated after movies have been fetched.
     *
     * @param   {string}  query  The query to use when fetching movies from the
     *                           search endpoint.
     *
     * @return  {void}
     */

    search(query) {
        if (query) {
            request.get(`http://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
                .set('Accept', 'application/json')
                .end((err, res) => {
                    if (!err) {

                        // Only include movies that actually have a poster path
                        // defined. Otherwise they would not make much sense in
                        // this application.

                        this.setState({
                            searchResults: res.body.results.filter(m => m.poster_path),
                            searching: false
                        })
                    }
                })
        } else {

            // Remove all movies if the query is empty.

            this.setState({
                searchResults: [],
                searching: false
            })
        }
    }

    /**
     * selectedSearchResult() creates a transition from the search results view
     * to the movie view. This method loads information about the movie itself
     * and about its cast and combines them in a single response.
     *
     * @param   {integer}  The ID of the movie to load information about.
     *
     * @return  {void}
     */

    selectedSearchResult(movieId) {

        // Prevent the user from selecting two different movies.

        if (this.selectedMovie) return
        this.selectedMovie = true

        request.get(`http://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        movie: res.body
                    })
                }
            })
    }

    /**
     * selectedEmotion() marks a single emotion as selected and sets the flag on
     * all other emotions to false.
     *
     * @param   {integer}  index  The index of the emotion inside the state
     *                            array.
     *
     * @return  {void}
     */

    selectedEmotion(index) {
        const emotions = this.state.emotions

        // Completely reset and then set the flag.

        emotions.forEach((e, i) => emotions[i].selected = false)
        emotions[index].selected = true

        this.setState({
            emotions: emotions
        })
    }

    /**
     * saveRating() saves the current movie along with the selected emotion.
     * Once the request is done, the user is redirected to the page of the
     * emotion they've just selected. If an addCallback() is defined, it is
     * called here.
     *
     * @return  {void}
     */

    saveRating() {
        const selectedEmotion = this.state.emotions.filter(e => e.selected)

        if (isEmpty(selectedEmotion)) return

        request.post('/api/movies/')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ ...this.state.movie, emotionId: selectedEmotion[0].id }))
            .end(err => {
                if (!err) {
                    browserHistory.push(`/${selectedEmotion[0].emotion}/`)

                    // Call the callback function with the just selected
                    // emotion.

                    if (this.props.addCallback) {
                        this.props.addCallback(selectedEmotion[0].emotion)
                    }
                }
            })
    }

    /**
     * Open and display the modal.
     *
     * @return  {void}
     */

    openModal() {
        this.setState({
            isOpen: true
        })
    }

    /**
     * Automatically focus the search box once the modal has been opened and all
     * refs have been synchronized.
     *
     * @return  {void}
     */

    onAfterOpen() {
        this.searchBox.focus()
    }

    /**
     * Close the modal and reset all its information. The modal retains
     * information about the emotions as they don't need to be refetched every
     * time the modal is opened.
     *
     * @return  {void}
     */

    closeModal() {
        const emotions = this.state.emotions

        this.setState({
            isOpen: false
        })

        // Only reset the state of the modal after the animation has finished.

        setTimeout(() => {
            this.setState({
                movie: {},
                emotions: emotions,
                searchResults: []
            })

            // Reset the `selected` flag on all emotions.

            emotions.forEach((e, i) => emotions[i].selected = false)
        }, 250)

        this.selectedMovie = false
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} style={AddRating.modalStyle} onRequestClose={() => this.closeModal()} onAfterOpen={() => this.onAfterOpen()} closeTimeoutMS={350}>
                <section style={{ display: isEmpty(this.state.movie) ? 'block' : 'none' }}>
                    <input name="movie-name" type="text" className="text-input full-width search-box" placeholder="Search for a movie…" ref={i => this.searchBox = i} onChange={(ev) => { this.setState({ searching: true }); this.search(ev.target.value) }}/>
                    <section className="search-results">
                        <ul className={`search-results-list unstyled-list ${this.state.searching ? ' is-loading' : ''}`}>
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
