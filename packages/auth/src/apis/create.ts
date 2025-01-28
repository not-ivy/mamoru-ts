import { publicProcedure } from '../trpc';
import { generateState } from 'arctic';

export default publicProcedure.mutation(async ({ ctx }) => {
  const state = generateState();
  await ctx.cfEnv.states.put(state, '1', { expirationTtl: 300 });
  return ctx.arctic.createAuthorizationURL(state, ['identify', 'connections']);
});