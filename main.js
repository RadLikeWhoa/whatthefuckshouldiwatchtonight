import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

class Emotions extends React.Component {
    static propTypes = {
        emotions: React.PropTypes.array.isRequired
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


class Emotion extends React.Component {
    render() {
        return <div class="emotion-label"><Link to={`/${this.props.name}`}>{this.props.name}</Link></div>
    }
}

class Movies extends React.Component {
    constructor(props) {
        super(props)

        this.state = { movies: [{
            id: 1,
            name: 'a'
        }, {
            id: 2,
            name: 'b'
        }]}
    }

    render() {
        return (
            <div data-grid>
                {this.state.movies.map(m => <Movie key={m.id} movie={m} />)}
            </div>
        )
    }
}

class Movie extends React.Component {
    render() {
        return <div class="movie-entry">{this.props.movie.name}</div>
    }
}

render((
    <Router history={browserHistory}>
        <Route path="/" component={Emotions} />
        <Route path="/:emotion" component={Movies} />
    </Router>
), document.getElementById('app'))
