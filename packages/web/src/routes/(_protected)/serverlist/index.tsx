import { A } from '@solidjs/router';
import { createResource, For } from 'solid-js';
import type { ServerStatusResponse } from '../../../types/server';
import { parse } from '@std/yaml';
import { useUser } from '../../../contexts/UserContext';

type ListEntry = { name: string, online: boolean, players: number, address: string; };
type StoredServerData = Record<string, { name: string; }>;

export default function ServerList() {
  const user = useUser();

  const addresses = JSON.parse(localStorage.getItem('servers') ?? '[]');
  const fetchServers = async (servers: string[]): Promise<ListEntry[]> => {
    let storedServerData = JSON.parse(localStorage.getItem('storedServerData') ?? '{}') as StoredServerData;
    let entries: ListEntry[] = [];
    for (const server of servers) {
      try {
        const data = parse(await (await fetch(`http://${server}/.well-known/mamoru/status`)).text()) as ServerStatusResponse;
        entries.push({ address: server, name: data.server_name, online: true, players: data.online_players });
        storedServerData[server] = { name: data.server_name };
      } catch {
        entries.push({ address: server, name: storedServerData[server]?.name ?? 'unavailable', online: false, players: NaN });
      }
    }
    localStorage.setItem('storedServerData', JSON.stringify(storedServerData));
    return entries;
  };
  const [servers] = createResource(addresses, fetchServers);

  return (
    <main class='p-8'>
      <h1 class="mb-4">welcome back, {user()?.name}. {user()?.name === 'guest' && <span class="italic">you may want to sign in <A href="/signin" class="underline text-f-med">here</A>.</span>}</h1>
      <h3 class='mb-2'>your saved servers:</h3>
      <table class='min-w-full'>
        <thead class='border-b-2 border-f-low font-semibold'>
          <tr>
            <td>name</td>
            <td>online?</td>
            <td>players</td>
            <td>dashboard</td>
          </tr>
        </thead>
        <tbody class="leading-loose">
          <For each={servers()}>
            {(it) => <tr class={`not-last:border-b border-f-low border-dashed even:bg-b-low ${it.online ? 'text-f-high' : 'text-f-low'}`}><td>{it.name}</td><td>{it.online ? 'yes' : 'no'}</td><td>{isNaN(it.players) ? 'N/A' : it.players}</td><td><A href={`/server/${it.address}/`} class={`underline ${it.online ? 'text-f-med' : 'pointer-events-none'}`}>go -&gt;</A></td></tr>}
          </For>
        </tbody>
      </table>
    </main>
  );
}
