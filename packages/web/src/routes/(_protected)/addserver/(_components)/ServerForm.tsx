import { redirect } from '@solidjs/router';
import { parse, stringify } from '@std/yaml';
import { createSignal } from 'solid-js';

export default function ServerForm() {
  let addressRef!: HTMLInputElement;
  const [status, setStatus] = createSignal<unknown | Error | null>(null);

  const onSubmit = (ev: SubmitEvent) => {
    ev.preventDefault();
    setStatus(null);
    fetch(`http://${addressRef.value}/.well-known/mamoru/status`)
      .then((res) => res.text())
      .then((text) => setStatus(parse(text))) // so uncomfortable that i cant just do setStatus <<< parse
      .catch(setStatus);
  };

  const onAddServer = () => {
    const existingServers: string[] = JSON.parse(localStorage.getItem('servers')! || '[]');
    const duplicate = existingServers.findIndex((v) => v === addressRef.value);
    if (duplicate === -1) localStorage.setItem('servers', JSON.stringify([...existingServers, addressRef.value]));
    redirect('/serverlist');
  };

  return (
    <>
      <form class='my-4 flex flex-wrap gap-4' on:submit={onSubmit}>
        <input ref={addressRef} required placeholder='server address' class='italic placeholder:text-f-low outline-none transition-colors border border-f-low focus:border-f-med px-2 py-1 w-full' />
        {(status() == null || status() instanceof Error) && <button class='hover:cursor-pointer bg-b-med px-4 py-1'>add</button>}
      </form>
      <code class={`italic whitespace-pre-line block px-4 py-2 border-y border-dashed border-f-low transition-transform ${!status() ? 'scale-y-0' : 'scale-y-100'}`}>{status() instanceof Error ? (status() as Error).message : stringify(status())}</code>

      {!(status() instanceof Error) && status() && <button class='mt-4 bg-b-med px-4 py-1 hover:cursor-pointer' on:click={onAddServer}>continue</button>}
    </>
  );
}
