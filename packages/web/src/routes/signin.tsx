import { useSearchParams } from "@solidjs/router";
import { createSignal, useContext } from 'solid-js';
import { effect } from "solid-js/web";
import AuthContext from '../contexts/authContext';

export default function Signin() {
  const [{ token }] = useSearchParams();
  const [error, setError] = createSignal<undefined | Error>();
  const authData = useContext(AuthContext)!;

  effect(() => {
    const providedToken = token || localStorage.getItem('token');
    if (!providedToken && !authData()) return location.assign(`${import.meta.env['VITE_AUTH_ENDPOINT']}/create`);
    if (authData()) return location.assign('/serverlist');
    fetch(`${import.meta.env['VITE_AUTH_ENDPOINT']}/info`, { headers: { Authorization: `Bearer ${providedToken}` } })
      .then(res => res.json())
      .then(() => {
        localStorage.setItem('token', providedToken!.toString());
        location.assign('/serverlist');
      })
      .catch(setError);
  });

  return (<main class="p-4">{error() ? <p>error: <i>{error()?.message}</i></p> : <p>you should be redirected soon...</p>}</main>);
}