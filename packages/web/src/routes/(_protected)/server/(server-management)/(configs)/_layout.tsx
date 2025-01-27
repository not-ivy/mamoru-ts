import type { JSXElement } from 'solid-js';

export default function Layout(props: { children: JSXElement; }) {
  return (
    <>
      <div class="bg-b-inv py-4 border-b-high border text-center">
        <h1 class="font-bold">warning:</h1>
        <p class="max-w-2/4 mx-auto">
          only edit this file if you know what you are doing.
          otherwise, it is recommended to leave everything as default.
        </p>
      </div>
      {props.children}
    </>
  );
}