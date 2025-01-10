import {
  InteractionResponseType, MessageFlags, Routes, type RESTGetAPIGuildRolesResult,
} from 'discord-api-types/v10';
import type { BotCommand } from '../types';

const updateRolesCommand = {
  command: {
    name: 'update',
    description: 'update roles',
  },
  async chatInputInteractionHandler({ interaction, rest }) {
    const roles = await rest.get(Routes.guildRoles(interaction.guild_id)) as RESTGetAPIGuildRolesResult;
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `\`\`\`json\n${JSON.stringify(roles, null, 2)}\n\`\`\``,
        flags: MessageFlags.Ephemeral,
      },
    };
  },
} satisfies BotCommand;

export default updateRolesCommand;
