import { useSearchParams } from '@solidjs/router';
import { createEffect, createSignal } from 'solid-js';
import { trpc } from '../trpc';

export default function Callback() {
  const [{ code, state }] = useSearchParams();
  const [error, setError] = createSignal<undefined | Error>();

  createEffect(() => {
    if (!code || !state) return location.assign('/');
    trpc.callback.mutate({ code: code!.toString(), state: state!.toString() }).then(() => {
      location.assign('/serverlist');
    }).catch(setError);
  }, [code, state]);

  return (<main class="p-4">{error() ? <p>error: <i>{error()?.message}</i></p> : <p>you should be redirected soon...</p>}</main>);
}