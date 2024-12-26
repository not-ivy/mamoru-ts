// all corresponding types can be found here
// https://git.sr.ht/~furry/mamoru-server/tree/mistress/item/Models.Mamoru

type ServerStatusResponse = {
  server_name: string,
  auth_endpoint: string,
  plugin_api_version: string,
  mamoru_version: string;
};

type ListPlayer = {
  id: number,
  userId: string,
  name: string,
  ra_authenticated: boolean;
};

type ListPlayersResponse = ListPlayer[];

export type {
  ServerStatusResponse,
  ListPlayer,
  ListPlayersResponse
};