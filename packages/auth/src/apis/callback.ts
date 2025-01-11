import { TRPCError } from '@trpc/server';
import { procedure } from '../trpc';
import { identifyDiscord } from '../libs/discord';
import { uid } from 'uid/secure';

export default procedure.query(async ({ ctx }) => {
  const { state, code } = Object.fromEntries((new URL(ctx.req.url)).searchParams.entries());
  if (!code || !state || !(await ctx.cfEnv.states.get(state))) throw new TRPCError({ code: 'UNAUTHORIZED', message: "fail" });
  await ctx.cfEnv.states.delete(state);
  const token = await ctx.arctic.validateAuthorizationCode(code);
  const identify = await identifyDiscord(token.tokenType(), token.accessToken());
  const existing = await ctx.cfEnv.index.get(identify.id);
  if (existing && await ctx.cfEnv.tokens.get(existing)) {
    return existing;
  }

  const newToken = uid(32);
  await ctx.cfEnv.tokens.put(newToken, JSON.stringify(token.data), { expirationTtl: token.accessTokenExpiresInSeconds() });
  await ctx.cfEnv.index.put(identify.id, newToken);
  return newToken;
});
