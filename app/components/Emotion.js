import React, { Component } from 'react'
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

export default Emotion
