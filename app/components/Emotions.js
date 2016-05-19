/**
 * The following components are responsible for rendering the emotions page,
 * i.e. the page where the user picks their desired emotion.
 */

import React, { Component } from 'react'
import { Link } from 'react-router'
import request from 'superagent'

/**
 * Emotion is the component that renders a single emotion inside the grid. It is
 * a stateless component, as such it was written using the shorthand notation.
 *
 * @TODO Add icon
 */

const Emotion = ({name}) => (
    <div className="emotion-label" data-col="1-3">
        <Link to={`/${name}/`}>{name}</Link>
    </div>
)

/**
 * EmotionList is the component that renders the grid containing all emotions.
 * It is a stateless component, as such it was written using the shorthand
 * notation.
 */

const EmotionList = ({emotions}) => (
    <div data-grid>
        {emotions.map(e => <Emotion name={e.emotion} key={e.id} />)}
    </div>
)

/**
 * Emotions is the container Component for the emotion picker. It is responsible
 * for handling the state of the emotions and fetching them. It controls the
 * rendering of the emotions page.
 */

export class Emotions extends Component {
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
        document.title = 'What the fuck should I watch tonight?!'

        return (
            <div className="wrapper">
                <header className="intro-heading">
                    <h1 className="intro-title">Show me movies that'll make me feel…</h1>
                </header>
                <EmotionList emotions={this.state.emotions} />
                <footer className="intro-footer">
                    <a data-button="inverted">… or rate a movie?</a>
                </footer>
            </div>
        )
    }
}
