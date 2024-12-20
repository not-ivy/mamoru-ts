import { useSearchParams } from "@solidjs/router";
import { effect } from "solid-js/web";

export default function Signin() {
  const [{ id }] = useSearchParams();

  effect(() => {
    const userId = localStorage.getItem('userId');
    fetch(`${import.meta.env['VITE_AUTH_ENDPOINT']}/info?id=${userId}`).then((res) => {
      if (res.status != 200) return location.assign(`${import.meta.env['VITE_AUTH_ENDPOINT']}/create`);
      return location.assign('/serverlist')
    })
    if (!id) return location.assign('/serverlist');
    localStorage.setItem('userId', id.toString());
    location.assign('/serverlist');
  })

  return (<main class="p-4"><p>you should be redirected soon...</p></main>)
}