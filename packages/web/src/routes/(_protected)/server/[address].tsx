import { A, useParams } from '@solidjs/router';
import { createEffect, createResource, type JSXElement } from 'solid-js';
import type { ServerStatusResponse } from '../../../types/server';
import { parse } from '@std/yaml';
import ServerProvider from '../../../contexts/ServerContext';

export default function ServerLayout(props: { children?: JSXElement; }) {
  const params = useParams();
  const fetchServer = async (address: string) => parse(await (await fetch(`http://${address}/.well-known/mamoru/status`)).text()) as ServerStatusResponse;
  const [serverData] = createResource(params['address'], fetchServer);

  return (
    <ServerProvider value={serverData}>
      <main class='p-8 flex gap-x-16'>
        <nav class='w-full max-w-fit'>
          <ul class='flex flex-col gap-y-2'>
            <li><A href={`/server/${params['address']}/`} class="transition-colors hover:bg-f-low">overview</A></li>
            <li><A href={`/server/${params['address']}/ban-appeals`} class="transition-colors hover:bg-f-low">ban appeals</A></li>
            <li><A href={`/server/${params['address']}/player-management`} class="transition-colors hover:bg-f-low">player management</A></li>
          </ul>
        </nav>
        <div class='w-full'>
          {props.children}
        </div>
      </main>
    </ServerProvider>
  );
}
