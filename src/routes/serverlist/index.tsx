import { A } from '@solidjs/router';
import { createResource, For, useContext } from 'solid-js';
import AuthContext from '../../contexts/authContext';
import type { ListPlayersResponse, ServerStatusResponse } from '../../types/server';
import { parse } from '@std/yaml';

type ListEntry = { name: string, online: boolean, players: number, address: string; };

export default function ServerList() {
  const addresses = JSON.parse(localStorage.getItem('servers') ?? '[]');
  const fetchServers = async (servers: string[]): Promise<ListEntry[]> => {
    let entries: ListEntry[] = [];
    for (const server of servers) {
      try {
        const data = parse(await (await fetch(`http://${server}/.well-known/mamoru/status`)).text()) as ServerStatusResponse;
        const players = parse(await (await fetch(`http://${server}/players/list`)).text()) as ListPlayersResponse;
        entries.push({ address: server, name: data.server_name, online: true, players: players.length });
      } catch (error) {
        console.error(error);
        entries.push({ address: server, name: 'unavailable', online: false, players: 0 });
      }
    }
    return entries;
  };
  const [servers] = createResource(addresses, fetchServers);
  const user = useContext(AuthContext)!;

  return (
    <main class='p-8'>
      <h1>welcome back, {user() ? user()?.name : 'user'}.</h1>
      <h3 class='mt-4 mb-2'>your saved servers:</h3>
      <table class='min-w-full'>
        <thead class='border-b-2 border-f-low font-semibold'>
          <tr>
            <td>name</td>
            <td>online?</td>
            <td>online players</td>
            <td>dashboard link</td>
          </tr>
        </thead>
        <tbody class="leading-loose">
          <For each={servers()}>
            {(it) => <tr class='not-last:border-b border-f-low border-dashed even:bg-b-low'><td>{it.name}</td><td>{it.online ? 'yes' : 'no'}</td><td>{it.players}</td><td><A href={`/server/${it.address}#overview`} class='underline text-f-med'>go -&gt;</A></td></tr>}
          </For>
        </tbody>
      </table>
    </main>
  );
}
