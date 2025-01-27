import { A, useParams } from '@solidjs/router';
import { createResource, type JSXElement } from 'solid-js';
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
        <nav class='w-full max-w-fit flex flex-col gap-y-4'>
          <div>
            <ul class='flex flex-col'>
              <li><A href={`/server/${params['address']}/`} class="transition-colors hover:bg-f-low">overview</A></li>
            </ul>
          </div>
          <div>
            <h5 class="uppercase text-sm text-f-low mb-1">player management</h5>
            <ul class='flex flex-col'>
              <li><A href={`/server/${params['address']}/permissions`} class="transition-colors hover:bg-f-low">permissions</A></li>
              <li><A href={`/server/${params['address']}/bans`} class="transition-colors hover:bg-f-low">bans</A></li>
              <li><A href={`/server/${params['address']}/mutes`} class="transition-colors hover:bg-f-low">mutes</A></li>
              <li><A href={`/server/${params['address']}/appeals`} class="transition-colors hover:bg-f-low">appeals</A></li>
            </ul>
          </div>
          <div>
            <h5 class="uppercase text-sm text-f-low mb-1">server management</h5>
            <ul>
              <li><A href={`/server/${params['address']}/logs`} class="transition-colors hover:bg-f-low">logs</A></li>
              <li><A href={`/server/${params['address']}/remoteadmin-config`} class="transition-colors hover:bg-f-low">remoteadmin</A></li>
              <li><A href={`/server/${params['address']}/gameplay-config`} class="transition-colors hover:bg-f-low">gameplay</A></li>
              <li><A href={`/server/${params['address']}/localadmin-config`} class="transition-colors hover:bg-f-low">localadmin</A></li>
              <li><A href={`/server/${params['address']}/sharing-config`} class="transition-colors hover:bg-f-low">sharing</A></li>
            </ul>
          </div>
        </nav>
        <div class='w-full'>
          {props.children}
        </div>
      </main>
    </ServerProvider>
  );
}
