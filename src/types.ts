import type { RESTPostAPIChatInputApplicationCommandsJSONBody, APIGuildInteraction, APIInteractionResponse } from "discord-api-types/v10";

interface BotCommand {
  command: RESTPostAPIChatInputApplicationCommandsJSONBody,
  execute: (interaction: APIGuildInteraction) => Promise<APIInteractionResponse>
}

export type {
  BotCommand
}