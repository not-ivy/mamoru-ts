import { useLocation } from '@solidjs/router';
import BanAppeals from './(_components)/BanAppeals';
import PlayerManagement from './(_components)/PlayerManagement';
import { createMemo, For } from 'solid-js';
import Error404 from '../_404';
import Overview from './(_components)/Overview';

const routes = [
  ['overview', Overview, false],
  ['ban-appeals', BanAppeals, false],
  ['player-management', PlayerManagement, true],
] as [string, () => Element, boolean][]; // hash, element, protected

// solid router wasnt working so its a hastily done "routing" lol
export default function Dashboard() {
  const location = useLocation();
  // const { address } = useParams();
  const section = createMemo(() => routes.find((it) => it[0] === location.hash.slice(1)));

  return (
    <main class='p-8 flex gap-x-16'>
      <nav class='w-full max-w-fit'>
        <ul class='flex flex-col gap-y-2'>
          <For each={routes}>
            {((it) => <a href={`#${it[0]}`}><li aria-current={location.hash.slice(1) === it[0]} class={`${location.hash.slice(1) === it[0] ? 'bg-f-high text-b-high' : ''} hover:bg-f-low transition-colors`}>{it[0]}</li></a>)}
          </For>
        </ul>
      </nav>
      <div class='w-full'>
        {section() ? section()![1]() : <Error404 />}
      </div>
    </main>
  );
}
