import { InteractionResponseType, type RESTGetAPIGuildRolesResult } from "discord-api-types/v10";
import type { BotCommand } from "../types";

const updateRolesCommand = {
  command: {
    name: 'update',
    description: 'update the roles'
  },
  async execute(interaction) {
    const roles = await (await fetch(`https://discord.com/api/guilds/${interaction.guild_id}/roles`)).json() as RESTGetAPIGuildRolesResult;
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `\`\`\`json\n${JSON.stringify(roles, null, 2)}\n\`\`\``
      }
    }
  },
} satisfies BotCommand;

export default updateRolesCommand;