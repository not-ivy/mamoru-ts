import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { OAuth2RequestError } from 'arctic';
import * as T from 'runtypes';
import type { UserStore } from '../types';

export default protectedProcedure
  .output(T.Literal("ok"))
  .mutation(async ({ ctx }) => {
    try {
      await ctx.arctic.revokeToken(ctx.auth.dat);
      await ctx.cfEnv.users.put(ctx.auth.sub, JSON.stringify({ dat: null!, dtt: ctx.auth.dtt, minimumIat: Math.floor(Date.now() / 1000) } satisfies UserStore));
      return "ok" as const;
    } catch (error) {
      if (error instanceof OAuth2RequestError) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "fail" });
    }
  });