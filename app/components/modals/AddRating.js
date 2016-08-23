import React, { Component, PropTypes } from 'react'
import Alert from 'react-s-alert'
import Modal from 'react-modal'
import RateMovie from '../movies/RateMovie'
import SearchMovies from '../movies/SearchMovies'

/**
 * This component is responsible for letting users add ratings for movies.
 */

class AddRating extends Component {
    static propTypes = {
        addCallback: PropTypes.func
    }

    // React Modal expects styling to be passed as inline styles.

    static modalStyle = {
        overlay: {
            zIndex: 2
        },
        content: {
            top: '50%',
            left: '50%',
            border: 0,
            backgroundColor: '#2c3641',
            right: 'auto',
            bottom: 'auto',
            width: '40em',
            marginLeft: '-20em',
            height: '30em',
            marginTop: '-15em',
            padding: '1.5em',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.6)'
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            selectedMovieId: 0
        }

        this.openModal = this.openModal.bind(this)
        this.onAfterOpen = this.onAfterOpen.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    /**
     * Open and display the modal.
     *
     * @return  {void}
     */

    openModal() {
        this.setState({
            isOpen: true
        })
    }

    /**
     * Automatically focus the search box once the modal has been opened and all
     * refs have been synchronized.
     *
     * @return  {void}
     */

    onAfterOpen() {
        this.search.searchBox.focus()
    }

    /**
     * Close the modal and reset all its information. The modal retains
     * information about the emotions as they don't need to be refetched every
     * time the modal is opened.
     *
     * @return  {void}
     */

    closeModal() {
        if (!this.state.isOpen) return

        this.setState({
            isOpen: false
        })

        // Only reset the state of the modal after the animation has finished.

        setTimeout(() => {
            this.setState({
                selectedMovieId: 0
            })
        }, 250)
    }

    render() {
        const { isOpen, selectedMovieId } = this.state

        return (
            <Modal isOpen={isOpen}
                   style={AddRating.modalStyle}
                   onRequestClose={this.closeModal}
                   onAfterOpen={this.onAfterOpen}
                   closeTimeoutMS={350}>
                {!selectedMovieId &&
                    <SearchMovies ref={s => this.search = s}
                                  selectedSearchResult={id => this.setState({ selectedMovieId: id })} />
                }
                {selectedMovieId ?
                    <RateMovie movieId={selectedMovieId}
                               closeCallback={this.closeModal}
                               addCallback={e => this.props.addCallback(e)}
                               errorCallback={() => { this.setState({ selectedMovieId: 0 })}} />
                : null}
            </Modal>
        )
    }
}

export default AddRating
