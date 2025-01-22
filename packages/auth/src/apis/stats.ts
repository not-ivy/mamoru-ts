import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../trpc';
import * as T from 'runtypes';

export const TypeStatsResponse = T.Record({
  users: T.Number,
  states: T.Number,
  tokens: T.Number
});

export default publicProcedure
  .output(TypeStatsResponse)
  .query(async ({ ctx }) => {
    const token = /Bearer (.*)/g.exec(ctx.req.headers.get('Authorization') ?? '');
    if (token?.[1] !== ctx.cfEnv.DISCORD_CLIENT_SECRET) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });

    return {
      users: (await ctx.cfEnv.index.list()).keys.length,
      states: (await ctx.cfEnv.states.list()).keys.length,
      tokens: (await ctx.cfEnv.tokens.list()).keys.length,
    };
  });