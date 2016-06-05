import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import Popover from '../helpers/Popover'

/**
 * DisplayEmotion is a component that can be used inside a grid to simply
 * display a list of emotions that link to their respective movies list.
 */

const DisplayEmotion = ({name}) => (
    <li data-col="1-3">
        <div className="popover-container">
            <Link className={`emotions-entry emotion-${name}`}
                  to={`/${name}/`}>
                <img src={`/dist/svg/${name}.svg`} />
                <Popover informational>{name}</Popover>
            </Link>
        </div>
    </li>
)

DisplayEmotion.propTypes = {
    name: PropTypes.string.isRequired
}

/**
 * SelectableEmotion is a component that can be used when giving the user the
 * option to select an emotion for the movie they are currently rating.
 */

const SelectableEmotion = ({name, isSelected, onClick}) => (
    <li data-col="1-3">
        <button onClick={onClick}
                className={`selectable-emotion ${isSelected ? ' is-selected' : ''}`}>
            <img src={`/dist/svg/${name}.svg`} />
            {name}
        </button>
    </li>
)

SelectableEmotion.propTypes = {
    name: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
}

/**
 * PercentageEmotion is a component that can be used when showing the user what
 * percentage match a given movie has for a given emotion.
 */

const PercentageEmotion = ({percentage, id, emotion, onClick}) => (
    <li data-col="1-3" className="percentage">
        <span style={{ opacity: Math.min(1, percentage + 0.3) }}
              onClick={(ev) => handlePercentageClick(ev, id, onClick)}>
            <img src={`/dist/svg/${emotion}.svg`} />
            {Math.round(percentage * 100)}% {emotion}
        </span>
    </li>
)

PercentageEmotion.propTypes = {
    percentage: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    emotion: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}

/**
 * handlePercentageClick highlights the just clicked PercentageEmotion and
 * executes a given callback.
 */

const handlePercentageClick = (ev, id, callback) => {
    let target = ev.target

    if (target.tagName == 'IMG') {
        target = target.parentNode
    }

    target.classList.add('is-highlighted')

    callback(id)
    setTimeout(() => target.classList.remove('is-highlighted'), 500)
}

export { DisplayEmotion, SelectableEmotion, PercentageEmotion }
