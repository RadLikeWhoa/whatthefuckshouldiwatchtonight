import React, { Component } from 'react'
import { Link } from 'react-router'
import request from 'superagent'

export class Emotion extends Component {
    render() {
        return (
            <div className="emotion-label" data-col="1-3">
                <Link to={`/app/${this.props.name}/`}>{this.props.name}</Link>
            </div>
        )
    }
}

export class EmotionList extends Component {
    render() {
        return (
            <div data-grid>
                {this.props.emotions.map((e, i) => <Emotion name={e} key={i} />)}
            </div>
        )
    }
}

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
                <div class="site-heading">
                    <h1 className="site-title">Show me movies that will make me feel…</h1>
                    <a data-button="inverted">… or rate a movie?</a>
                </div>
                <EmotionList emotions={this.state.emotions} />
            </div>
        )
    }
}
