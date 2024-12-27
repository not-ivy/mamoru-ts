import { useLocation, useParams } from '@solidjs/router';
import BanAppeals from './(_components)/BanAppeals';
import PlayerManagement from './(_components)/PlayerManagement';
import { createMemo, createResource, For, useContext } from 'solid-js';
import Error404 from '../_404';
import Overview from './(_components)/Overview';
import ServerContext from '../../contexts/serverContext';
import type { ServerStatusResponse } from '../../types/server';
import AuthContext from '../../contexts/authContext';
import { parse } from '@std/yaml';

const routes = [
  ['overview', Overview, false],
  ['ban-appeals', BanAppeals, false],
  ['player-management', PlayerManagement, true],
] as [string, () => Element, boolean][]; // hash, element, protected

// solid router wasnt working so its a hastily done "routing" lol
export default function Dashboard() {
  const location = useLocation();
  const params = useParams();
  const fetchServer = async (address: string) => parse(await (await fetch(`http://${address}/.well-known/mamoru/status`)).text()) as ServerStatusResponse;
  const [serverData] = createResource(params['address'], fetchServer);
  const section = createMemo(() => routes.find((it) => it[0] === location.hash.slice(1)));
  const user = useContext(AuthContext)!;

  return (
    <ServerContext.Provider value={serverData}>
      <main class='p-8 flex gap-x-16'>
        <nav class='w-full max-w-fit'>
          <ul class='flex flex-col gap-y-2'>
            <For each={routes}>
              {((it) => (it[2] && user() === null) ? null : <a href={`#${it[0]}`}><li aria-current={location.hash.slice(1) === it[0]} class={`${location.hash.slice(1) === it[0] ? 'bg-f-high text-b-high' : ''} hover:bg-f-low transition-colors`}>{it[0]}</li></a>)}
            </For>
          </ul>
        </nav>
        <div class='w-full'>
          {user() === null && <div class="mb-4 bg-f-med text-b-high px-6 py-2 mx-auto max-w-fit -skew-x-12"><h1 class='skew-x-12'>warning: you are currently not signed in.</h1></div>}
          {section() ? section()![1]() : <Error404 />}
        </div>
      </main>
    </ServerContext.Provider>
  );
}
