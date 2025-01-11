import { TRPCError } from '@trpc/server';
import { procedure } from '../trpc';
import type { InfoResponse, RawToken } from '../types';
import { identifyDiscord, connectionsDiscord } from '../libs/discord';

export default procedure.query(async ({ ctx }) => {
  const token = /Bearer (.*)/g.exec(ctx.req.headers.get('Authorization') ?? '');
  if (!token?.[1]) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });

  const tokenRaw = await ctx.cfEnv.tokens.get(token[1]);
  if (!tokenRaw) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });

  const discordToken = JSON.parse(tokenRaw) as RawToken;
  const identify = await identifyDiscord(discordToken.token_type, discordToken.access_token);
  const connections = await connectionsDiscord(discordToken.token_type, discordToken.access_token);
  const steamConnection = connections.find(it => it.type === 'steam' && it.verified);
  return {
    name: identify.global_name,
    discord: identify.id,
    ...(steamConnection?.id ? { steam: steamConnection.id } : null)
  } satisfies InfoResponse;
});
