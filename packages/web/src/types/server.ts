// all corresponding types can be found here
// https://git.sr.ht/~furry/mamoru-server/tree/mistress/item/Models.Mamoru

type ServerStatusResponse = {
  server_name: string,
  auth_endpoint: string,
  plugin_api_version: string,
  mamoru_version: string;
  online_players: number,
};

type Badge = {
  color: string,
  name: string,
};

type ListPlayer = {
  id: number,
  user_id: string,
  name: string,
  ra_authenticated: boolean;
  badge?: Badge;
};

type ListPlayersResponse = ListPlayer[];

export type {
  ServerStatusResponse,
  ListPlayer,
  ListPlayersResponse
};