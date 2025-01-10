type UnknownRecord = Record<string, unknown>;
type DiscordConnections = Array<{ type: string; verified: string; id: string } & UnknownRecord>;
type DiscordIdentify = { id: string; global_name: string } & UnknownRecord;
type RawToken = { token_type: string; access_token: string };
type InfoResponse = { name: string; discord: string; steam?: string };

export type {
  DiscordConnections,
  DiscordIdentify,
  RawToken,
  InfoResponse,
};
