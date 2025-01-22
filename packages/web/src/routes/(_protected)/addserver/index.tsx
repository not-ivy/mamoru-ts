import ServerForm from './(_components)/ServerForm';

export default function AddServer() {
  return (
    <div class='w-screen min-h-screen grid p-8 md:p-0 md:place-items-center'>
      <main>
        <h1>hi, welcome to mamoru.</h1>
        <p>to get started, add a server below:</p>
        <ServerForm />
      </main>
    </div>
  );
}
