import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../trpc';
import { identifyDiscord } from '../libs/discord';
import * as T from 'runtypes';
import { OAuth2RequestError } from 'arctic';
import { SignJWT } from 'jose';
import type { UserStore } from '../types';

export default publicProcedure
  .input(T.Record({ state: T.String, code: T.String }))
  .output(T.String)
  .mutation(async ({ input, ctx }) => {
    try {
      if (!(await ctx.cfEnv.states.get(input.state))) throw new TRPCError({ code: 'UNAUTHORIZED', message: "fail" });
      await ctx.cfEnv.states.delete(input.state);
      const token = await ctx.arctic.validateAuthorizationCode(input.code);
      const identify = await identifyDiscord(token.tokenType(), token.accessToken());
      const iat = Math.floor(Date.now() / 1000);
      ctx.cfEnv.users.put(identify.id, JSON.stringify({ minimumIat: iat, dtt: token.tokenType(), dat: token.accessToken() } satisfies UserStore));
      const jwt = await (new SignJWT())
        .setProtectedHeader({ alg: 'ES256' })
        .setIssuedAt(iat)
        .setIssuer(ctx.cfEnv.APP_URL)
        .setSubject(identify.id)
        .setExpirationTime(token.accessTokenExpiresAt())
        .sign(ctx.keyPair.privateKey);
      ctx.resHeaders.append("Set-Cookie", `token=${jwt}; HttpOnly; SameSite=Lax; Expires=${token.accessTokenExpiresAt().toUTCString()}; Domain=${(new URL(ctx.cfEnv.DISCORD_REDIRECT_URI)).host.replace(/:.*/g, '')}; ${ctx.cfEnv.DISCORD_REDIRECT_URI.startsWith('https') ? 'Secure;' : ''}`);
      return jwt;
    } catch (error) {
      if (error instanceof OAuth2RequestError) throw new TRPCError({ code: "UNAUTHORIZED", message: "fail" });
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "fail" });
    }
  });
