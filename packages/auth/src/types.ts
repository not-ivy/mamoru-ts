type UnknownRecord = Record<string, unknown>;
type DiscordConnections = Array<{ type: string; verified: string; id: string; } & UnknownRecord>;
type DiscordIdentify = { id: string; global_name: string; } & UnknownRecord;

type UserStore = {
  minimumIat: number;
  dtt: string; // discord token type
  dat: string; // discord access tokn
};

export type {
  DiscordConnections,
  DiscordIdentify,
  UserStore
};
