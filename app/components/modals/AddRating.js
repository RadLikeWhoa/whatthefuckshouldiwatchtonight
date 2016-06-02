/**
 * This component is responsible for letting users add ratings for movies.
 */

import React, { Component } from 'react'
import request from 'superagent'
import Modal from 'react-modal'

export default class AddRating extends Component {

    // React Modal expects styling to be passed as inline styles.

    static modalStyle = {
        overlay: {
            backgroundColor: 'rgba(30, 30, 30, 0.85)'
        },
        content: {
            top: '50%',
            left: '50%',
            border: 0,
            backgroundColor: '#2c3641',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '40em',
            height: '30em',
            padding: '1.5em',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.8)'
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            movie: {}
        }
    }

    openModal() {
        this.setState({
            isOpen: true
        })
    }

    closeModal() {
        this.setState({
            isOpen: false
        })
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} style={AddRating.modalStyle} onRequestClose={() => this.closeModal()}>
                <input name="movie-name" type="text" className="text-input full-width" placeholder="Search for a movie…" />
            </Modal>
        )
    }
}
