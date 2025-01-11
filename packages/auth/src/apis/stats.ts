import { TRPCError } from '@trpc/server';
import { procedure } from '../trpc';

export interface StatsResponse {
  length: number,
  users: string[];
}

export default procedure.mutation(async ({ ctx }) => {
  const token = /Bearer (.*)/g.exec(ctx.req.headers.get('Authorization') ?? '');
  if (token?.[1] !== ctx.cfEnv.DISCORD_CLIENT_SECRET) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });

  return {
    length: (await ctx.cfEnv.index.list()).keys.length,
    users: (await ctx.cfEnv.index.list()).keys,
  };
});