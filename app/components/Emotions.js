import React, { Component } from 'react'
import { Link } from 'react-router'
import request from 'superagent'

const Emotion = ({name}) => (
    <div className="emotion-label" data-col="1-3">
        <Link to={`/${name}/`}>{name}</Link>
    </div>
)

const EmotionList = ({emotions}) => (
    <div data-grid>
        {emotions.map(e => <Emotion name={e.emotion} key={e.id} />)}
    </div>
)

export class Emotions extends Component {
    constructor(props) {
        super(props)

        this.state = {
            emotions: []
        }

        this.getEmotions()
    }

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
                    <h1 className="intro-title">Show me movies that will make me feel…</h1>
                </header>
                <EmotionList emotions={this.state.emotions} />
                <footer className="intro-footer">
                    <a data-button="inverted">… or rate a movie?</a>
                </footer>
            </div>
        )
    }
}
