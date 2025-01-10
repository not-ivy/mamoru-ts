import type {
  APIChatInputApplicationCommandGuildInteraction, APIInteractionResponse, APIMessageApplicationCommandGuildInteraction, APIUserApplicationCommandInteraction, RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import type { REST } from '@discordjs/rest';

type InteractionHandlerContext<T> = {
  interaction: T;
  rest: REST;
  options: T extends APIChatInputApplicationCommandGuildInteraction ? Record<string, unknown> : undefined;
};

type BotCommand = {
  command: RESTPostAPIApplicationCommandsJSONBody;
  chatInputInteractionHandler?: (context: InteractionHandlerContext<APIChatInputApplicationCommandGuildInteraction>) => Promise<APIInteractionResponse>;
  userInteractionHandler?: (context: InteractionHandlerContext<APIUserApplicationCommandInteraction>) => Promise<APIInteractionResponse>;
  messageInteractionHandler?: (context: InteractionHandlerContext<APIMessageApplicationCommandGuildInteraction>) => Promise<APIInteractionResponse>;
};

export type {
  BotCommand,
  InteractionHandlerContext,
};
