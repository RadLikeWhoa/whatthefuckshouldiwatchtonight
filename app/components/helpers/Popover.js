import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'

/**
 * Popovers show additional information above a component. They can be shown as
 * a list of options (default) or as a simple bit of text (informational). This
 * component handles the interactivity of the popover, the content is defined as
 * the children of the component.
 */

class Popover extends Component {
    static propTypes = {
        informational: PropTypes.bool,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ])
    }

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
     * @param   {EventObject}  e  An object describing the handled event.
     *
     * @return  {void}
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
     * @param   {EventObject}  e  An object describing the handled event.
     *
     * @return  {void}
     */

    handleEscapePress({ keyCode }) {
        if (keyCode == 27) {
            this.closePopover()
        }
    }

    /**
     * Make the popover visible and add both handler methods to the document.
     * Only default popovers need the handler methods.
     *
     * @return  {void}
     */

    openPopover() {
        this.setState({
            isOpen: true
        })

        document.addEventListener('click', this.handleClickOutside, false)
        document.addEventListener('keydown', this.handleEscapePress, false)
    }

    /**
     * Close the popover and remove both handler methods from the document. Only
     * default popovers need to have the handler methods removed.
     *
     * @return  {void}
     */

    closePopover() {
        this.setState({
            isOpen: false
        })

        document.removeEventListener('click', this.handleClickOutside)
        document.removeEventListener('keydown', this.handleEscapePress)
    }

    render() {
        const { informational, children } = this.props

        return (
            <ul ref={u => this.list = u}
                className={`unstyled-list popover ${informational ? 'popover-informational' : ''} ${(this.state.isOpen ? 'is-visible' : '')}`}>
                {children}
            </ul>
        )
    }
}

export default Popover
