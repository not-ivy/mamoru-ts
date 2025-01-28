import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../trpc';
import * as T from 'runtypes';

export const TypeStatsResponse = T.Record({
  users: T.Number,
  states: T.Number,
});

export default publicProcedure
  .output(TypeStatsResponse)
  .query(async ({ ctx }) => {
    const token = /Bearer (.*)/g.exec(ctx.req.headers.get('Authorization') ?? '');
    if (token?.[1] !== ctx.cfEnv.DISCORD_CLIENT_SECRET) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });

    return {
      states: (await ctx.cfEnv.states.list()).keys.length,
      users: (await ctx.cfEnv.users.list()).keys.length
    };
  });