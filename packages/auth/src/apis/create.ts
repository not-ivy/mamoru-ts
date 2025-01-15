import { uid } from 'uid/secure';
import { publicProcedure } from '../trpc';

export default publicProcedure.mutation(async ({ ctx }) => {
  const state = uid(16);
  await ctx.cfEnv.states.put(state, '1', { expirationTtl: 300 });
  return ctx.arctic.createAuthorizationURL(state, ['identify', 'connections']);
});