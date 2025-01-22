/* @refresh reload */
import { render } from 'solid-js/web';
import { lazy, Suspense } from 'solid-js';
import { Route, Router } from '@solidjs/router';
import Theme from '@iv/themes';
import Error404 from './routes/_404';
import Landing from './routes';
import Signin from './routes/signin';

import './index.css';
import Callback from './routes/callback';
import Loading from './routes/_loading';
import UserProvider from './contexts/UserContext';

const theme = new Theme();
theme.install();
theme.start();

function Layout() {
  return (
    <UserProvider>
      <Suspense fallback={<Loading />}>
        <Router>
          <Route path='/' component={Landing} />
          <Route component={lazy(() => import('./routes/(_protected)/_layout'))}>
            <Route path='/addserver' component={lazy(() => import('./routes/(_protected)/addserver'))} />
            <Route path='/serverlist' component={lazy(() => import('./routes/(_protected)/serverlist'))} />
            <Route path='/server/:address' component={lazy(() => import('./routes/(_protected)/server/[address]'))}>
              <Route path='/' component={lazy(() => import('./routes/(_protected)/server/overview'))} />
              <Route path='/ban-appeals' component={lazy(() => import('./routes/(_protected)/server/ban-appeals'))} />
              <Route path='/player-management' component={lazy(() => import('./routes/(_protected)/server/player-management'))} />
            </Route>
          </Route>
          <Route path='/signin' component={Signin} />
          <Route path='/callback' component={Callback} />
          <Route path='*404' component={() => <main class='grid place-items-center min-h-screen'><Error404 /></main>} />
        </Router>
      </Suspense >
    </UserProvider>
  );
}

render(Layout, document.getElementById('root')!);
