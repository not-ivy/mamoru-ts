import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './router';
import makeArctic from './libs/auth';

export default {
  async fetch(req, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': (new URL(env.DISCORD_REDIRECT_URI)).host.replace(/:.*/g, ''),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin',
      'Access-Control-Allow-Credentials': 'true',
    };

    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    return fetchRequestHandler({
      endpoint: '/',
      req,
      router: appRouter,
      responseMeta: () => ({
        headers: corsHeaders
      }),
      createContext: ({ resHeaders, req }) => ({
        cfEnv: env,
        req,
        resHeaders,
        arctic: makeArctic(env.DISCORD_CLIENT_ID, env.DISCORD_CLIENT_SECRET, env.DISCORD_REDIRECT_URI)
      })
    });
  }
} satisfies ExportedHandler<Env>;