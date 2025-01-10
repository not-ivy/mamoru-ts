import { createResource, For } from 'solid-js';
import { parse } from '@std/yaml';
import { useParams } from '@solidjs/router';
import type { ListPlayersResponse } from '../../../../types/server';

export default function OnlineTable() {
  const params = useParams();
  const fetchPlayers = async (address: string) => parse(await (await fetch(`http://${address}/players/list`)).text()) as ListPlayersResponse;
  const [players] = createResource(params['address'], fetchPlayers);
  return (
    <div>
      <h1 class="font-regular">online players:</h1>
      <table class="min-w-full leading-loose">
        <thead class="border-b-2 border-f-low font-semibold">
          <tr>
            <td>id</td>
            <td>name</td>
            <td>badge</td>
            <td>user id</td>
            <td>ra access?</td>
          </tr>
        </thead>
        <tbody>
          <For each={players()}>
            {((it) => <tr class="not-last:border-b border-f-low border-dashed even:bg-b-low"><td>{it.id}</td><td>{it.name}</td><td>{it.badge && <span style={{ color: it.badge.color }}>{it.badge.name}</span>}</td><td><a class="text-f-med underline hover:text-f-high transition-colors" href={`/server/${params['address']}/player-management/${it.user_id}`}>{it.user_id}</a></td>{it.ra_authenticated ? 'yes' : 'no'}</tr>)}
          </For>
        </tbody>
      </table>
    </div>
  );
}