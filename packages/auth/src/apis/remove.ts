import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { OAuth2RequestError } from 'arctic';
import * as T from 'runtypes';

export default protectedProcedure
  .output(T.Literal("ok"))
  .mutation(async ({ ctx }) => {
    try {
      await ctx.arctic.revokeToken(ctx.token.access_token);
      return "ok" as const;
    } catch (error) {
      if (error instanceof OAuth2RequestError) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "fail" });
    }
  });