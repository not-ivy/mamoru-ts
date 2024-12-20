import { A } from '@solidjs/router';
import { For, useContext } from 'solid-js';
import type { StoredServer } from '../../types/serverlist';
import AuthContext from '../../contexts/authContext';

export default function ServerList() {
  const serverList: StoredServer[] = JSON.parse(localStorage.getItem('servers') || '[]');
  const fmt = Intl.DateTimeFormat(navigator.languages);
  const user = useContext(AuthContext)!;

  return (
    <main class='p-8'>
      <h1>welcome back, {user() ? user()!.name : 'user'}.</h1>
      <h3 class='mt-4 mb-2'>your saved servers:</h3>
      <table class='min-w-full'>
        <thead class='border-b-2 border-f-low font-semibold'>
          <tr>
            <td>name</td>
            <td class='hidden md:block'>date added</td>
            <td>online?</td>
            <td class='hidden md:block'>online players</td>
            <td>dashboard link</td>
          </tr>
        </thead>
        <tbody class="leading-loose">
          <For each={serverList}>
            {(it) => <tr class='not-last:border-b border-f-low border-dashed even:bg-b-low'><td>{it.name}</td><td class='hidden md:block'>{fmt.format(it.dateAdded)}</td><td>{Math.random() > 0.6 ? 'yes' : 'no'}</td><td class='hidden md:block'>{Math.floor(Math.random() * 100)} / 40</td><td><A href={`/server/${it.address}`} class='underline text-f-med'>go -&gt;</A></td></tr>}
          </For>
        </tbody>
      </table>
    </main>
  );
}
