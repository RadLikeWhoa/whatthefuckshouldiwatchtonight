/**
 * The following components are responsible for rendering the emotions page,
 * i.e. the page where the user picks their desired emotion.
 */

import React, { Component } from 'react'
import request from 'superagent'

import AddRating from '../components/modals/AddRating'
import { DisplayEmotion } from '../components/emotions/Emotion'

/**
 * Emotions is the container Component for the emotion picker. It is responsible
 * for handling the state of the emotions and fetching them. It controls the
 * rendering of the emotions page.
 */

export default class Emotions extends Component {
    constructor(props) {
        super(props)

        this.state = {
            emotions: []
        }

        this.getEmotions()
    }

    /**
     * getEmotions() gets a list of all emotions from the database and updates
     * the state once the data was fetched.
     *
     * @return  {void}
     */

    getEmotions() {
        request.get('/api/emotions/')
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        emotions: res.body.emotions
                    })
                }
            })
    }

    render() {

        // Set the document title to the default title.

        document.title = 'What the fuck should I watch tonight?!'

        return (
            <main className="wrapper">
                <header className="emotions-header">
                    <h1 className="emotions-title">Show me movies that'll make me feel…</h1>
                    <button data-button
                            onClick={() => this.addRating.openModal()}>
                        …or rate a movie?
                    </button>
                </header>
                <ul data-grid="gutterless"
                    className="emotions-list unstyled-list">
                    {this.state.emotions.map(e => (
                        <DisplayEmotion name={e.emotion} key={e.id} />
                    ))}
                </ul>
                <AddRating ref={a => this.addRating = a} />
            </main>
        )
    }
}
