import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

export default class Popover extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.handleEscapePress = this.handleEscapePress.bind(this)
    }

    handleClickOutside(e) {
        const node = findDOMNode(this.list)

        if (e.target != node && !node.contains(e.target)) {
            this.closePopover()
        }
    }

    handleEscapePress(e) {
        if (e.keyCode == 27) {
            this.closePopover()
        }
    }

    openPopover() {
        this.setState({
            isOpen: true
        })

        if (!this.props.informational) {
            document.addEventListener('click', this.handleClickOutside, false)
            document.addEventListener('keydown', this.handleEscapePress, false)
        }
    }

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
