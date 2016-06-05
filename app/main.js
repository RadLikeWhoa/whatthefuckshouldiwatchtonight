import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import Emotions from './pages/emotions'
import Movies from './pages/movies'

render((
    <Router history={browserHistory}>
        <Route path="/" component={Emotions} />
        <Route path="/:emotion/" component={Movies} />
    </Router>
), document.getElementById('app'))
