import React, { PropTypes } from 'react'

import Popover from '../helpers/Popover'

/**
 * Movie is the component that is responsible for rendering a single movie
 * inside the grid of all movies for a given emotion. It is a stateless
 * component, as such it was written using the shorthand notation.
 */

const Movie = ({title, posterPath, percentage, onClick, emotion}) => (
    <li className="movie-entry"
        data-col="1-6"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w396/${posterPath})`}}
        onClick={onClick}>
        <h2 className="h3 movie-title">{title}</h2>
        <div className="movie-emotion popover-container"
             style={{ opacity: Math.min(+percentage + 0.3, 1) }}>
            <img src={`/dist/svg/${emotion}.svg`} />
            <Popover informational>{`${Math.round(+percentage * 100)}%`}</Popover>
        </div>
    </li>
)

Movie.propTypes = {
    title: PropTypes.string.isRequired,
    posterPath: PropTypes.string.isRequired,
    percentage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    onClick: PropTypes.func.isRequired,
    emotion: PropTypes.string.isRequired
}

export default Movie
