import { ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import type { BotCommand } from '../types';

const jokeCommand = {
  command: {
    name: 'joke',
    description: 'get a random joke',
    options: [{ type: ApplicationCommandOptionType.Boolean, name: 'private', description: 'only you can see the joke' }],
  },
  async chatInputInteractionHandler({ interaction, options }) {
    const joke = await (await fetch('https://icanhazdadjoke.com/', { headers: { Accept: 'text/plain' } })).text();
    const isPrivate = options['private'] as boolean;
    console.log(isPrivate);
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        ...(isPrivate ? { flags: MessageFlags.Ephemeral } : {}),
        embeds: [
          {
            author: { name: interaction.member.user.username, icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png?size=64` },
            timestamp: (new Date()).toISOString(),
            color: 0xFF_BE_98,
            description: joke,
          },
        ],
      },
    };
  },
} satisfies BotCommand;

export default jokeCommand;
