/**
 * Popovers show additional information above a component. They can be shown as
 * a list of options (default) or as a simple bit of text (informational). This
 * component handles the interactivity of the popover, the content is defined as
 * the children of the component.
 */

import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

export default class Popover extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        // Correctly bind `this` to the current class when calling the handler
        // methods.

        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.handleEscapePress = this.handleEscapePress.bind(this)
    }

    /**
     * The popover should be closed when the user clicks outside of it.
     *
     * @param  e  EventObject
     */

    handleClickOutside(e) {
        const node = findDOMNode(this.list)

        if (e.target != node && !node.contains(e.target)) {
            this.closePopover()
        }
    }

    /**
     * The popover should be closed when the user presses the escape key (key
     * code = 27).
     *
     * @param  e  EventObject
     */

    handleEscapePress(e) {
        if (e.keyCode == 27) {
            this.closePopover()
        }
    }

    /**
     * Make the popover visible and add both handler methods to the document.
     * Only default popovers need the handler methods.
     */

    openPopover() {
        this.setState({
            isOpen: true
        })

        if (!this.props.informational) {
            document.addEventListener('click', this.handleClickOutside, false)
            document.addEventListener('keydown', this.handleEscapePress, false)
        }
    }

    /**
     * Close the popover and remove both handler methods from the document. Only
     * default popovers need to have the handler methods removed.
     */

    closePopover() {
        this.setState({
            isOpen: false
        })

        if (!this.props.informational) {
            document.removeEventListener('click', this.handleClickOutside)
            document.removeEventListener('keydown', this.handleEscapePress)
        }
    }

    render() {
        return (
            <ul ref={u => this.list = u} className={`unstyled-list popover ${this.props.informational ? 'popover-informational' : ''} ${(this.state.isOpen ? 'is-visible' : '')}`}>
                {this.props.children}
            </ul>
        )
    }
}