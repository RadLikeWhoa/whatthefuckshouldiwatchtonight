import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import request from 'superagent'
import isEmpty from 'lodash/isempty'

import { SelectableEmotion } from '../emotions/Emotion'
import { apiKey } from '../../settings.js'

class RateMovie extends Component {
    static propTypes = {
        movieId: PropTypes.number.isRequired,
        addCallback: PropTypes.func
    }

    constructor(props) {
        super(props)

        this.state = {
            movie: {},
            emotions: []
        }

        this.getEmotions()
        this.getMovie(this.props.movieId)
    }

    /**
     * @todo document
     */

    getMovie(movieId) {
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

    render() {
        return (
            <section data-grid>
                <section className="clearfix add-movie-information">
                    <div data-col="1-6">
                        <img className="result-poster"
                             src={this.state.movie.poster_path ? `https://image.tmdb.org/t/p/w185${this.state.movie.poster_path}` : ''} />
                    </div>
                    <div data-col="5-6">
                        <h2 className="h3 detail-title">
                            <span className="highlighted">{this.state.movie.title}</span>
                            {(() => { const date = (new Date(this.state.movie.release_date)).getFullYear(); return !isNaN(date) ? ` (${date})` : '' })()}
                        </h2>
                        {!isEmpty(this.state.movie.credits) &&
                            <p>{this.state.movie.credits.crew.filter(c => c.job == "Director").map(c => c.name).join(', ')}</p>
                        }
                    </div>
                </section>
                <ul className="unstyled-list clearfix selectable-emotions-list">
                    {this.state.emotions.map((e, i) => (
                        <SelectableEmotion name={e.emotion}
                                           isSelected={e.selected}
                                           key={i}
                                           onClick={() => this.selectedEmotion(i)} />
                    ))}
                </ul>
                <div data-col="1-2">
                    <button data-button="block secondary"
                            onClick={() => this.props.closeCallback()}>
                        Cancel
                    </button>
                </div>
                <div data-col="1-2">
                    <button data-button="block"
                            onClick={() => this.saveRating()}>
                        Save Rating
                    </button>
                </div>
            </section>
        )
    }
}

export default RateMovie
