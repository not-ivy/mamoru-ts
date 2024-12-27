import { A, useParams } from '@solidjs/router';
import { createResource, useContext, type JSXElement } from 'solid-js';
import ServerContext from '../../contexts/serverContext';
import type { ServerStatusResponse } from '../../types/server';
import AuthContext from '../../contexts/authContext';
import { parse } from '@std/yaml';

export default function ServerLayout(props: { children?: JSXElement; }) {
  const params = useParams();
  const fetchServer = async (address: string) => parse(await (await fetch(`http://${address}/.well-known/mamoru/status`)).text()) as ServerStatusResponse;
  const [serverData] = createResource(params['address'], fetchServer);
  const user = useContext(AuthContext)!;


  return (
    <ServerContext.Provider value={serverData}>
      <main class='p-8 flex gap-x-16'>
        <nav class='w-full max-w-fit'>
          <ul class='flex flex-col gap-y-2'>
            <li><A href={`/server/${params['address']}/`} class="transition-colors hover:bg-f-low">overview</A></li>
            <li><A href={`/server/${params['address']}/ban-appeals`} class="transition-colors hover:bg-f-low">ban appeals</A></li>
            <li><A href={`/server/${params['address']}/player-management`} class="transition-colors hover:bg-f-low">player management</A></li>
          </ul>
        </nav>
        <div class='w-full'>
          {user() === null && <div class="mb-4 bg-f-med text-b-high px-6 py-2 mx-auto max-w-fit -skew-x-12"><h1 class='skew-x-12'>warning: you are currently not signed in.</h1></div>}
          {props.children}
        </div>
      </main>
    </ServerContext.Provider>
  );
}
