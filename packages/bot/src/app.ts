import { Hono } from 'hono';
import { verifyKey } from 'discord-interactions';
import {
  InteractionType, InteractionResponseType, type APIGuildInteraction, type APIPingInteraction, type RESTPutAPIApplicationCommandsResult,
  type APIInteractionResponse,
  Routes,
  ApplicationCommandType,
  MessageFlags,
  type APIChatInputApplicationCommandGuildInteraction,
  type APIUserApplicationCommandGuildInteraction,
  type APIMessageApplicationCommandGuildInteraction,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import commands from './commands';

const app = new Hono<{ Bindings: Env; Variables: { rest: REST; }; }>();

app.use(async (c, next) => {
  c.set('rest', new REST({ version: '10' }).setToken(c.env.DISCORD_BOT_TOKEN));
  return next();
});

app.use('/interactions', async (c, next) => {
  const { 'x-signature-ed25519': sig, 'x-signature-timestamp': ts } = c.req.header();
  if (!sig || !ts || !(await verifyKey(await c.req.text(), sig, ts, c.env.DISCORD_PUBLIC_KEY))) {
    return c.text('fail', 401);
  }

  return next();
});

app.post('/interactions', async c => {
  const interaction = await c.req.json() as APIGuildInteraction | APIPingInteraction;
  switch (interaction.type) {
    case InteractionType.Ping: {
      return c.json({ type: InteractionResponseType.Pong });
    }

    case InteractionType.ApplicationCommand: {
      const cmd = commands.find(it => it.command.name === interaction.data.name);
      if (!cmd) {
        return c.text('fail', 400);
      }

      switch (interaction.data.type) {
        case ApplicationCommandType.ChatInput: {
          return c.json(await cmd.chatInputInteractionHandler!({
            options: cmd.command.options ? cmd.command.options?.reduce<Record<string, unknown>>((previous, current) => ({
              ...previous,
              [current.name]: (interaction as APIChatInputApplicationCommandGuildInteraction).data.options?.filter(it => it.type !== ApplicationCommandOptionType.SubcommandGroup && it.type !== ApplicationCommandOptionType.Subcommand)?.find(it => it.name === current.name && it.type === current.type)?.value,
            }), {}) : {},
            interaction: interaction as APIChatInputApplicationCommandGuildInteraction,
            rest: c.var.rest,
          }));
        }

        case ApplicationCommandType.User: {
          return c.json(await cmd.userInteractionHandler!({
            interaction: interaction as APIUserApplicationCommandGuildInteraction,
            rest: c.var.rest,
            options: undefined,
          }));
        }

        case ApplicationCommandType.Message: {
          return c.json(await cmd.messageInteractionHandler!({
            interaction: interaction as APIMessageApplicationCommandGuildInteraction,
            rest: c.var.rest,
            options: undefined,
          }));
        }
      }
    }

    // Case InteractionType.ModalSubmit: { }

    // case InteractionType.MessageComponent: { }

    // case InteractionType.ApplicationCommandAutocomplete: { }

    // eslint-disable no-fallthrough
    default: {
      console.log(interaction.type, interaction.data);
      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: 'interaction not supported at the moment',
          flags: MessageFlags.Ephemeral,
        },
      } as APIInteractionResponse);
    }
  }
});

app.get('/refresh', async c => {
  const auth = c.req.header('Authorization');
  if (auth?.split(' ')[1] !== c.env.DISCORD_BOT_TOKEN) {
    return c.text('fail', 401);
  }

  const registeredCommands = await c.var.rest.put(
    Routes.applicationCommands(c.env.DISCORD_CLIENT_ID),
    { body: commands.map(it => it.command) },
  ) as RESTPutAPIApplicationCommandsResult;

  return c.json(registeredCommands);
});

export default app;
