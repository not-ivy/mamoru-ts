import { TRPCError } from '@trpc/server';
import { procedure } from '../trpc';
import type { RawToken } from '../types';
import { OAuth2RequestError } from 'arctic';

export default procedure.mutation(async ({ ctx }) => {
  const token = /Bearer (.*)/g.exec(ctx.req.headers.get('Authorization') ?? '');
  if (!token?.[1]) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });

  const tokenRaw = await ctx.cfEnv.tokens.get(token[1]);
  if (!tokenRaw) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });

  try {
    const discordToken = JSON.parse(tokenRaw) as RawToken;
    await ctx.arctic.revokeToken(discordToken.access_token);
    return "ok" as const;
  } catch (error) {
    if (error instanceof OAuth2RequestError) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "fail" });
  }
});