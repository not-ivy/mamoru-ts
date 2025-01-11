import { initTRPC } from '@trpc/server';
import type { Discord } from 'arctic';

interface TrpcContext {
  cfEnv: Env;
  req: Request;
  resHeaders: Headers;
  arctic: Discord;
}

const { router, procedure } = initTRPC.context<TrpcContext>().create();

export {
  procedure,
  router,
  type TrpcContext
};