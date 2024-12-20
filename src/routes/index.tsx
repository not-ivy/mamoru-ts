export default function Landing() {
  return (
    <div class="min-h-screen grid place-items-center">
      <main class="text-center leading-loose">
        <h1 class="text-xl italic font-semibold tracking-widest">mamoru (守る)</h1>
        <h3>an uncomplicated remote moderation tool for scp: sl</h3>
        <ul class="mt-2 max-w-fit mx-auto">
          <li class="hover:-skew-x-12 transition-transform"><a href="/signin" class="bg-f-high text-b-high hover:underline decoration-b-high px-4">sign in</a></li>
        </ul>
      </main>
      <footer class="absolute bottom-8 min-w-screen">
        <nav>
          <ul class="flex gap-x-4 w-full items-center justify-center">
            <li><a href="https://sr.ht/~furry/mamoru" class="underline hover:text-f-med transition-colors">source</a></li>
            <li>-</li>
            <li><a href="https://lists.sr.ht/~furry/mamoru-discuss" class="underline hover:text-f-med transition-colors">contact</a></li>
          </ul>
        </nav>
      </footer>
    </div>
  )
}