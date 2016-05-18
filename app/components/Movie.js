import React, { Component } from 'react'

export class Movie extends Component {
    render() {
        return <div className="movie-entry">{this.props.movie.name}</div>
    }
}

export default Movie
