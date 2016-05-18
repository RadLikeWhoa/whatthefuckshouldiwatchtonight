import React, { Component, PropTypes } from 'react'
import Emotion from './Emotion'

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

export default EmotionList
