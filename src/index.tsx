/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router } from '@solidjs/router'
import Index from './routes'
import Error404 from './routes/_404'
import './index.css'

render(() => (
  <Router>
    <Route path="/" component={Index} />
    <Route path="*404" component={Error404} />
  </Router>
), document.getElementById('root')!)
