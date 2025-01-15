import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../trpc';
import { identifyDiscord } from '../libs/discord';
import { uid } from 'uid/secure';
import * as T from 'runtypes';
import { OAuth2RequestError } from 'arctic';

export default publicProcedure
  .input(T.Record({ state: T.String, code: T.String }))
  .output(T.String)
  .mutation(async ({ input, ctx }) => {
    try {
      if (!(await ctx.cfEnv.states.get(input.state))) throw new TRPCError({ code: 'UNAUTHORIZED', message: "fail" });
      await ctx.cfEnv.states.delete(input.state);
      const token = await ctx.arctic.validateAuthorizationCode(input.code);
      const identify = await identifyDiscord(token.tokenType(), token.accessToken());
      const tokenId = uid(32);
      await ctx.cfEnv.tokens.put(tokenId, JSON.stringify(token.data), { expirationTtl: token.accessTokenExpiresInSeconds() });
      await ctx.cfEnv.index.put(identify.id, tokenId);
      ctx.resHeaders.append("Set-Cookie", `token=${tokenId}; HttpOnly; SameSite=Lax; Expires=${token.accessTokenExpiresAt().toUTCString()}; Domain=${(new URL(ctx.cfEnv.DISCORD_REDIRECT_URI)).host.replace(/:.*/g, '')}; ${ctx.cfEnv.DISCORD_REDIRECT_URI.startsWith('https') ? 'Secure;' : ''}`);
      return tokenId;
    } catch (error) {
      if (error instanceof OAuth2RequestError) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "fail" });
    }
  });
