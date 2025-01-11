import { uid } from 'uid/secure';
import { procedure } from '../trpc';

export default procedure.mutation(async ({ ctx }) => {
  const state = uid(16);
  await ctx.cfEnv.states.put(state, '1', { expirationTtl: 300 });
  return ctx.arctic.createAuthorizationURL(state, ['identify', 'connections']);
});