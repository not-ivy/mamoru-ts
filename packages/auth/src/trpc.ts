import { initTRPC, TRPCError } from '@trpc/server';
import type { Discord } from 'arctic';
import type { RawToken } from './types';

export interface TrpcContext {
  cfEnv: Env;
  req: Request;
  resHeaders: Headers;
  arctic: Discord;
  token?: RawToken;
}

export const { router, procedure: publicProcedure } = initTRPC.context<TrpcContext>().create();

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  let token = /token=(.*)(;|$)/g.exec(ctx.req.headers.get('Cookie') ?? '');
  token ??= /Bearer (.*)/g.exec(ctx.req.headers.get('Authorization') ?? '');
  if (!token?.[1]) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });
  const tokenRaw = await ctx.cfEnv.tokens.get(token[1]);
  if (!tokenRaw) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });
  return next({
    ctx: {
      token: JSON.parse(tokenRaw) as RawToken
    }
  });
});
