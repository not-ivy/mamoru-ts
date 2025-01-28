import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { exportJWK, exportPKCS8, exportSPKI, generateKeyPair, importPKCS8, importSPKI, type KeyLike } from 'jose';
import { appRouter } from './router';
import makeArctic from './libs/auth';
import type { Env } from '../worker-configuration';

export default {
  async fetch(req, env) {
    let publicKey: KeyLike, privateKey: KeyLike;
    if (!(await env.persist.get('publicKey') && await env.persist.get('privateKey'))) {
      ({ publicKey, privateKey } = await generateKeyPair('ES256', { extractable: true }));
      await env.persist.put('publicKey', await exportSPKI(publicKey));
      await env.persist.put('privateKey', await exportPKCS8(privateKey));
    } else {
      publicKey = await importSPKI((await env.persist.get('publicKey'))!, 'ES256', { extractable: true });
      privateKey = await importPKCS8((await env.persist.get('privateKey'))!, 'ES256');
    }

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

    if ((new URL(req.url)).pathname === '/.well-known/jwks.json') {
      return new Response(JSON.stringify(await exportJWK(publicKey)), {
        headers: {
          'Content-Type': 'application/json'
        }
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
        arctic: makeArctic(env.DISCORD_CLIENT_ID, env.DISCORD_CLIENT_SECRET, env.DISCORD_REDIRECT_URI),
        keyPair: {
          publicKey,
          privateKey
        }
      })
    });
  }
} satisfies ExportedHandler<Env>;