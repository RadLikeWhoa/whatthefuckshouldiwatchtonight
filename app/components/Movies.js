import React, { Component } from 'react'
import request from 'superagent'

const Movie = ({movie}) => (
    <div className="movie-entry" data-col="1-4">{movie.name}</div>
)

const MovieList = ({movies}) => (
    <div data-grid>
        {movies.map(m => <Movie key={m.id} movie={m} />)}
    </div>
)

export class Movies extends Component {
    constructor(props) {
        super(props)

        this.state = {
            movies: []
        }

        this.getMoviesForEmotion(this.props.params.emotion)
    }

    getMoviesForEmotion(emotion) {
        request.get(`/api/movies/${emotion}/`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        movies: res.body.movies
                    })
                }
            })
    }

    render() {
        document.title = 'Movies that will make you feel ' + this.props.params.emotion + '!'

        return (
            <div class="wrapper">
                <MovieList movies={this.state.movies} />
            </div>
        )
    }
}
