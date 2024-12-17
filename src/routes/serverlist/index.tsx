import { A } from '@solidjs/router';
import { For } from 'solid-js';
import { StoredServer } from '../../types/serverlist';

export default function ServerList() {
  const serverList: StoredServer[] = JSON.parse(localStorage.getItem('servers') || '[]');
  const fmt = Intl.DateTimeFormat(navigator.languages);
  const user = 'nora';

  return (
    <main class='p-4'>
      <h1>{user ? `welcome back, ${user}.` : 'welcome to mamoru.'}</h1>
      <h3 class='mt-4 mb-2'>your saved servers:</h3>
      <table class='min-w-full'>
        <thead class='border-b-2 border-f-low font-semibold'>
          <tr>
            <td>name</td>
            <td>date added</td>
            <td>online?</td>
            <td>online players</td>
            <td>dashboard link</td>
          </tr>
        </thead>
        <tbody>
          <For each={serverList}>
            {(it) => <tr class='not-last:border-b border-f-low border-dashed even:bg-b-low'><td>{it.name}</td><td>{fmt.format(it.dateAdded)}</td><td>{Math.random() > 0.6 ? 'yes' : 'no'}</td><td>{Math.floor(Math.random() * 100)} / 40</td><td><A href={`/server/${it.address}`} class='underline text-f-med'>go -&gt;</A></td></tr>}
          </For>
        </tbody>
      </table>
    </main>
  );
}
