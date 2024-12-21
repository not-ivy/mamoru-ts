import { InteractionResponseType } from 'discord-api-types/v10';
import type { BotCommand } from '../types';

const pingCommand = {
  command: {
    name: 'ping',
    description: 'pong'
  },
  async execute(interaction) {
    const quote = await (await fetch("https://icanhazdadjoke.com/", { headers: { Accept: 'text/plain' } })).text();
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [{
          title: 'pong :ping_pong:',
          description: `random joke: ${quote}`,
          footer: {
            icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png?size=64`,
            text: interaction.member.user.username
          },
          color: 0xFFBE98
        }]
      }
    }
  },
} satisfies BotCommand;

export default pingCommand;
