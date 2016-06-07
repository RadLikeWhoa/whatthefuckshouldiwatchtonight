/**
 * The following components are responsible for rendering the emotions page,
 * i.e. the page where the user picks their desired emotion.
 */

import React, { Component } from 'react'
import Alert from 'react-s-alert'
import request from 'superagent'

import AddRating from '../components/modals/AddRating'
import { DisplayEmotion } from '../components/emotions/Emotion'
import { handleRequest } from '../utils'

/**
 * Emotions is the container Component for the emotion picker. It is responsible
 * for handling the state of the emotions and fetching them. It controls the
 * rendering of the emotions page.
 */

class Emotions extends Component {
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
        this.emotionsRequest = request.get('/api/emotions/')
            .set('Accept', 'application/json')
            .end((err, res) => handleRequest(err, res, res => {
                this.setState({
                    emotions: res.body.emotions
                })

                this.emotionsRequest = null
            }, () => {
                Alert.error('Could not retrieve available emotions. Please try again.')
                this.emotionsRequest = null
            }))
    }

    /**
     * Cancel all requests before the component is unmounted.
     *
     * @return  {void}
     */

    componentWillUnmount() {
        if (this.emotionsRequest) {
            this.emotionsRequest.abort()
            this.emotionsRequest = null
        }
    }

    render() {

        // Set the document title to the default title.

        document.title = 'What the fuck should I watch tonight?!'

        return (
            <main className="wrapper">
                <header className="emotions-header" data-grid>
                    <div data-col="1-2">
                        <h1 className="emotions-title">Show me movies that'll make me feel…</h1>
                    </div>
                    <div data-col="1-2" className="right-text">
                        <button data-button
                                onClick={() => this.addRating.openModal()}>
                            …or rate a movie?
                        </button>
                    </div>
                </header>
                <ul data-grid="gutterless"
                    className="emotions-list unstyled-list">
                    {this.state.emotions.map(e => (
                        <DisplayEmotion name={e.emotion} key={e.id} />
                    ))}
                </ul>
                <AddRating ref={a => this.addRating = a} />
                <Alert stack={{ limit: 1 }}
                       position="top"
                       effect="stackslide"
                       timeout={3500} />
            </main>
        )
    }
}

export default Emotions
