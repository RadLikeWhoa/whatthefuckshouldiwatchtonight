import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

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
    static propTypes = {
        emotions: PropTypes.arrayOf(PropTypes.string).isRequired
    }

    static defaultProps = {
        emotions: [ 'amused', 'sad', 'excited', 'uplifted', 'scared', 'inspired', 'joyful', 'weird', 'sentimental' ]
    }

    render() {
        return (
            <div data-grid>
                {this.props.emotions.map((e, i) => <Emotion name={e} key={i} />)}
            </div>
        )
    }
}

export class Emotions extends Component {
    render() {
        document.title = 'What the fuck should I watch tonight?!'

        return (
            <div className="wrapper">
                <div class="site-heading">
                    <h1 className="site-title">Show me movies that will make me feel…</h1>
                    <a data-button="inverted">… or rate a movie?</a>
                </div>
                <EmotionList />
            </div>
        )
    }
}
