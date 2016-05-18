import React, { Component } from 'react'
import Movie from './movie'

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

export default MovieList
