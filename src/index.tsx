/* @refresh reload */
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';
import Theme from '@iv/themes';
import AddServer from './routes/addserver';
import Error404 from './routes/_404';
import './index.css';
import ServerList from './routes/serverlist';

const theme = new Theme();
theme.install();
theme.start();

render(() => (
  <Router>
    <Route path='/addserver' component={AddServer} />
    <Route path='/serverlist' component={ServerList} />
    <Route path='*404' component={Error404} />
  </Router>
), document.getElementById('root')!);
