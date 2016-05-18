import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export class Emotion extends Component {
    render() {
        return (
            <div className="emotion-label">
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
        document.title = 'What the fuck should I watch tonight?!'

        return (
            <div data-grid>
                {this.props.emotions.map((e, i) => <Emotion name={e} key={i} />)}
            </div>
        )
    }
}
