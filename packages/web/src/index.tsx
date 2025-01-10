/* @refresh reload */
import { render } from 'solid-js/web';
import { createResource, lazy, Suspense } from 'solid-js';
import { Route, Router } from '@solidjs/router';
import Theme from '@iv/themes';
import Error404 from './routes/_404';
import AuthContext from './contexts/authContext';
import Landing from './routes';
import Signin from './routes/signin';
import type { InfoResponse } from './types/auth';

import './index.css';

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
      <Suspense fallback={<p>loading</p>}>
        <Router>
          <Route path='/' component={Landing} />
          <Route path='/addserver' component={lazy(() => import('./routes/addserver'))} />
          <Route path='/serverlist' component={lazy(() => import('./routes/serverlist'))} />
          <Route path='/server/:address' component={lazy(() => import('./routes/server/[address]'))}>
            <Route path='/' component={lazy(() => import('./routes/server/overview'))} />
            <Route path='/ban-appeals' component={lazy(() => import('./routes/server/ban-appeals'))} />
            <Route path='/player-management' component={lazy(() => import('./routes/server/player-management'))} />
          </Route>
          <Route path='/signin' component={Signin} />
          <Route path='*404' component={() => <main class='grid place-items-center min-h-screen'><Error404 /></main>} />
        </Router>
      </Suspense>
    </AuthContext.Provider>
  );
}

render(Layout, document.getElementById('root')!);
