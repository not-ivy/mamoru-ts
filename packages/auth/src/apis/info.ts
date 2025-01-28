import { protectedProcedure } from '../trpc';
import { identifyDiscord, connectionsDiscord } from '../libs/discord';
import * as T from 'runtypes';

export const TypeInfoResponse = T.Record({
  name: T.String,
  discord: T.String,
  steam: T.String.optional(),
});

export type InfoResponse = T.Static<typeof TypeInfoResponse>;

export default protectedProcedure
  .output(TypeInfoResponse)
  .query(async ({ ctx }) => {
    const identify = await identifyDiscord(ctx.auth.dtt, ctx.auth.dat);
    const connections = await connectionsDiscord(ctx.auth.dtt, ctx.auth.dat);
    const steamConnection = connections.find(it => it.type === 'steam' && it.verified);
    return {
      name: identify.global_name,
      discord: identify.id,
      steam: steamConnection?.id,
    };
  });
