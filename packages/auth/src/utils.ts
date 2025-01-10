import type { DiscordConnections, DiscordIdentify } from './types.js';

const identifyDiscord = async (type: string, token: string): Promise<DiscordIdentify> => (await (fetch('https://discord.com/api/users/@me', { headers: { authorization: `${type} ${token}` } }))).json();

const connectionsDiscord = async (type: string, token: string): Promise<DiscordConnections> => (await fetch('https://discord.com/api/users/@me/connections', { headers: { authorization: `${type} ${token}` } })).json();

export {
  identifyDiscord,
  connectionsDiscord,
};
