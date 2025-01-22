import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '@mamoru/auth/src/router';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    loggerLink(),
    httpBatchLink({
      url: import.meta.env['VITE_AUTH_ENDPOINT'],
      fetch: (url, opts) => fetch(url, {
        ...opts,
        credentials: "include",
        signal: opts?.signal ? opts.signal : null, // type issue
      })
    })
  ]
});
