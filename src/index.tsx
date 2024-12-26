/* @refresh reload */
import { render } from 'solid-js/web';
import { createEffect, createSignal } from 'solid-js';
import { Route, Router } from '@solidjs/router';
import Theme from '@iv/themes';
import AddServer from './routes/addserver';
import Error404 from './routes/_404';
import ServerList from './routes/serverlist';
import Dashboard from './routes/server/[address]';
import AuthContext from './contexts/authContext';
import Landing from './routes';
import Signin from './routes/signin';
import type { UserInfo } from './types/auth';

import './index.css';

const theme = new Theme();
theme.install();
theme.start();

function Layout() {
  const [info, setInfo] = createSignal<UserInfo | null>(null);

  createEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${import.meta.env['VITE_AUTH_ENDPOINT']}/info`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setInfo);
  });

  return (
    <AuthContext.Provider value={info}>
      <Router>
        <Route path='/' component={Landing} />
        <Route path='/addserver' component={AddServer} />
        <Route path='/serverlist' component={ServerList} />
        <Route path='/server/:address' component={Dashboard} />
        <Route path='/signin' component={Signin} />
        <Route path='*404' component={() => <main class='grid place-items-center min-h-screen'><Error404 /></main>} />
      </Router>
    </AuthContext.Provider>
  );
}

render(Layout, document.getElementById('root')!);
