/* @refresh reload */
import { render } from 'solid-js/web';
import { createResource } from 'solid-js';
import { Route, Router } from '@solidjs/router';
import Theme from '@iv/themes';
import AddServer from './routes/addserver';
import Error404 from './routes/_404';
import ServerList from './routes/serverlist';
import ServerLayout from './routes/server/[address]';
import AuthContext from './contexts/authContext';
import Landing from './routes';
import Signin from './routes/signin';
import type { InfoResponse } from './types/auth';

import './index.css';
import Overview from './routes/server/overview';
import BanAppeals from './routes/server/ban-appeals';
import PlayerManagement from './routes/server/player-management';

const theme = new Theme();
theme.install();
theme.start();

function Layout() {
  const fetchAuth = async (token?: string): Promise<InfoResponse | null> => {
    try {
      if (!token) return null;
      return (await fetch(`${import.meta.env['VITE_AUTH_ENDPOINT']}/info`, { headers: { Authorization: `Bearer ${token}` } })).json();
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  const [authData] = createResource(() => localStorage.getItem('token'), fetchAuth);

  return (
    <AuthContext.Provider value={authData}>
      <Router>
        <Route path='/' component={Landing} />
        <Route path='/addserver' component={AddServer} />
        <Route path='/serverlist' component={ServerList} />
        <Route path='/server/:address' component={ServerLayout}>
          <Route path='/' component={Overview} />
          <Route path='/ban-appeals' component={BanAppeals} />
          <Route path='/player-management' component={PlayerManagement} />
        </Route>
        <Route path='/signin' component={Signin} />
        <Route path='*404' component={() => <main class='grid place-items-center min-h-screen'><Error404 /></main>} />
      </Router>
    </AuthContext.Provider>
  );
}

render(Layout, document.getElementById('root')!);
