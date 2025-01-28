import { initTRPC, TRPCError } from '@trpc/server';
import type { Discord } from 'arctic';
import type { Env } from '../worker-configuration';
import { jwtVerify, type KeyLike } from 'jose';
import type { UserStore } from './types';

export interface TrpcContext {
  cfEnv: Env;
  req: Request;
  resHeaders: Headers;
  arctic: Discord;
  keyPair: { publicKey: KeyLike, privateKey: KeyLike; };
  auth?: {
    sub: string;
  } & UserStore;
}

export const { router, procedure: publicProcedure } = initTRPC.context<TrpcContext>().create();

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  let token = /token=(.*)(;|$)/g.exec(ctx.req.headers.get('Cookie') ?? '');
  token ??= /Bearer (.*)/g.exec(ctx.req.headers.get('Authorization') ?? '');
  if (!token?.[1] || token?.[1].length === 0) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });
  try {
    const { payload: { sub, exp, iat } } = await jwtVerify(token?.[1], ctx.keyPair.publicKey, {
      issuer: ctx.cfEnv.APP_URL,
      requiredClaims: ['sub', 'exp', 'iat'],
      algorithms: ['ES256'],
    });
    if (Math.floor(Date.now() / 1000) >= exp!) throw new Error();
    const auth = JSON.parse((await ctx.cfEnv.users.get(sub!))!) as UserStore;
    if (iat! < auth.minimumIat || !auth.dat) throw new Error();
    return next({
      ctx: {
        auth: {
          sub: sub!,
          ...auth
        }
      } satisfies Partial<TrpcContext>
    });
  } catch {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });
  }
});
