import { createEffect, createResource } from 'solid-js';
import { trpc } from '../trpc';

export default function Signin() {
  const [signInUrl] = createResource(() => trpc.create.mutate());

  createEffect(() => {
    if (signInUrl.loading) return;
    return location.assign(signInUrl()!);
  }, []);

  return (<main class="p-4">{signInUrl.error ? (<><h1 class="font-bold">error:</h1><code>{signInUrl.error.toString()}</code></>) : (<p>you should be redirected soon...</p>)}</main>);
}