import { useSearchParams } from "@solidjs/router";
import { createSignal } from 'solid-js';
import { effect } from "solid-js/web";

export default function Signin() {
  const [{ token }] = useSearchParams();
  const [error, setError] = createSignal<undefined | Error>();

  effect(() => {
    const providedToken = token || localStorage.getItem('token');
    if (!providedToken) return location.assign(`${import.meta.env['VITE_AUTH_ENDPOINT']}/create`);
    fetch(`${import.meta.env['VITE_AUTH_ENDPOINT']}/info`, { headers: { Authorization: `Bearer ${providedToken}` } })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem('token', providedToken.toString());
        location.assign('/serverlist');
      })
      .catch(setError);
  });

  return (<main class="p-4">{error() ? <p>error: <i>{error()?.message}</i></p> : <p>you should be redirected soon...</p>}</main>);
}