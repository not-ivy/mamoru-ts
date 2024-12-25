import type { DiscordConnections, DiscordIdentify } from './types.js';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const identifyDiscord = async (type: string, token: string): Promise<DiscordIdentify> => (await (fetch('https://discord.com/api/users/@me', { headers: { authorization: `${type} ${token}` } }))).json();

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const connectionsDiscord = async (type: string, token: string): Promise<DiscordConnections> => await (await fetch('https://discord.com/api/users/@me/connections', { headers: { authorization: `${type} ${token}` } })).json();

export {
  identifyDiscord,
  connectionsDiscord
};