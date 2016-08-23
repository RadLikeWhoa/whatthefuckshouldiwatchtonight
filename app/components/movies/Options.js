import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Popover from '../helpers/Popover'

/**
 * Options is a component that is used to display additional information and
 * options inside a list of movies. It can be used to change the movie order or
 * to present new modals or pages.
 */

class Options extends Component {
    static propTypes = {
        emotion: PropTypes.string.isRequired,
        onClickRate: PropTypes.func.isRequired,
        orderChangeCallback: PropTypes.func.isRequired,
        order: PropTypes.shape({
            by: PropTypes.string.isRequired,
            direction: PropTypes.string.isRequired
        }).isRequired
    }

    /**
     * getOrderCriteria() returns the default order criteria for this component.
     *
     * @return  {void}
     */

    getOrderCriteria() {
        return {
            by: [{
                name: 'date-added',
                display: 'Date added'
            }, {
                name: 'match',
                display: 'Emotional match'
            }, {
                name: 'release-date',
                display: 'Release date'
            }],
            direction: [
                'descending',
                'ascending'
            ]
        }
    }

    render() {
        const { emotion, order, onClickRate, orderChangeCallback } = this.props

        return (
            <section data-grid
                     className="options">
                <div data-col="1-4">
                    <Link to="/">
                        <button data-button="block"
                                className="popover-container">
                            Change your mood
                            <Popover informational>Tired of feeling {emotion}?</Popover>
                        </button>
                    </Link>
                </div>
                <div data-col="1-4">
                    <button data-button="block"
                            onClick={onClickRate}>
                        Rate a movie
                    </button>
                </div>
                <div data-col="1-4 empty"></div>
                <div data-col="1-4">
                    <section className="popover-container">
                        <button data-button="block"
                                onClick={() => this.orderPopover.openPopover()}>
                            Sort by
                        </button>
                        <Popover ref={p => this.orderPopover = p}>
                            {this.getOrderCriteria().by.map((i, index) => (
                                <li key={index}
                                    className={`popover-item ${order.by == i.name ? ' is-selected' : ''}`}
                                    onClick={() => this.props.orderChangeCallback({ ...order, by: i.name })}>
                                    {i.display}
                                </li>
                            ))}
                            <section data-grid="gutterless">
                                {this.getOrderCriteria().direction.map((d, index) => (
                                    <div key={index}
                                         data-col="1-2">
                                        <li title={`Sort ${d}`}
                                            className={`popover-item centered-text ${order.direction == d ? ' is-selected' : ''}`}
                                            onClick={() => orderChangeCallback({ ...order, direction: d })}>
                                            <span data-icon={d}></span>
                                        </li>
                                    </div>
                                ))}
                            </section>
                        </Popover>
                    </section>
                </div>
            </section>
        )
    }
}

export default Options
