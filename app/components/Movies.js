import React, { Component } from 'react'

export class Movie extends Component {
    render() {
        return <div className="movie-entry" data-col="1-4">{this.props.movie.name}</div>
    }
}

export class MovieList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            movies: [{
                id: 1,
                name: 'a'
            }, {
                id: 2,
                name: 'b'
            }]
        }
    }

    render() {
        return (
            <div data-grid>
                {this.state.movies.map(m => <Movie key={m.id} movie={m} />)}
            </div>
        )
    }
}

export class Movies extends Component {
    render() {
        document.title = 'Movies that will make you feel ' + this.props.params.emotion + '! — What the fuck should I watch tonight?!'

        return (
            <div class="wrapper">
                <MovieList />
            </div>
        )
    }
}
