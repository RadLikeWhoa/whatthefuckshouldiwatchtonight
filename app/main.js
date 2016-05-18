import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import { EmotionList } from './components/emotions'
import { MovieList } from './components/movies'

render((
    <Router history={browserHistory}>
        <Route path="/app/" component={EmotionList} />
        <Route path="/app/:emotion/" component={MovieList} />
    </Router>
), document.getElementById('app'))
