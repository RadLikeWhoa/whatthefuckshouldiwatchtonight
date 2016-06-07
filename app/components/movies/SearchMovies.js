import React, { Component, PropTypes } from 'react'
import Alert from 'react-s-alert'
import request from 'superagent'
import debounce from 'lodash/debounce'

import { apiKey } from '../../settings.js'
import { parseReleaseYear, handleRequest } from '../../utils.js'

class SearchMovies extends Component {
    static propTypes = {
        selectedSearchResult: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)

        this.state = {
            searchResults: [],
            searching: false
        }

        // In order to not overload the TMDB API request, the search function is
        // debounced. That means that it is only called every 500ms at most.

        this.search = debounce(this.search, 500)
    }

    /**
     * Search for a given query on the TMDB API. It returns a list of movies.
     * The state is updated after movies have been fetched.
     *
     * @param   {string}  query  The query to use when fetching movies from the
     *                           search endpoint.
     *
     * @return  {void}
     */

    search(query) {
        if (query) {
            this.searchRequest = request.get(`http://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
                .set('Accept', 'application/json')
                .end((err, res) => handleRequest(err, res, res => {
                    // Only include movies that actually have a poster path
                    // defined. Otherwise they would not make much sense in
                    // this application.

                    this.setState({
                        searchResults: res.body.results.filter(m => m.poster_path),
                        searching: false
                    })

                    this.searchRequest = null
                }, () => {
                    this.setState({
                        searching: false
                    })

                    Alert.error('Could not communicate to the themoviedb.org servers. Please try again.')
                    this.searchRequest = null
                }))
        } else {

            // Remove all movies if the query is empty.

            this.setState({
                searchResults: [],
                searching: false
            })
        }
    }

    /**
     * Cancel all requests before the component is unmounted.
     *
     * @return  {void}
     */

    componentWillUnmount() {
        if (this.searchRequest) {
            this.searchRequest.abort()
            this.searchRequest = null
        }
    }

    render() {
        return (
            <section>
                <input name="movie-name"
                       type="text"
                       className="text-input full-width search-box"
                       placeholder="Search for a movie…"
                       ref={i => this.searchBox = i}
                       onChange={(ev) => { this.setState({ searching: true }); this.search(ev.target.value) }}/>
                <section className="search-results">
                    <ul className={`search-results-list unstyled-list ${this.state.searching ? ' is-loading' : ''}`}>
                        {this.state.searchResults.map(r => (
                            <li className="search-result-item"
                                key={r.id}
                                onClick={() => this.props.selectedSearchResult(r.id)}>
                                {r.title} {parseReleaseYear(r.release_date)}
                            </li>
                        ))}
                    </ul>
                </section>
            </section>
        )
    }
}

export default SearchMovies
