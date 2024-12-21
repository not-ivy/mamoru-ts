import { Hono } from 'hono';
import { verifyKey } from 'discord-interactions';
import {
  InteractionType, InteractionResponseType, type APIGuildInteraction, type APIPingInteraction, type RESTPutAPIApplicationCommandsResult,
  type APIInteractionResponse,
} from 'discord-api-types/v10';
import commands from './commands';

const app = new Hono<{ Bindings: Env }>();

app.use('/interactions', async (c, next) => {
  const { 'x-signature-ed25519': sig, 'x-signature-timestamp': ts } = c.req.header();
  if (!sig || !ts || !(await verifyKey(await c.req.text(), sig, ts, c.env.DISCORD_PUBLIC_KEY))) {
    return c.text('fail', 401);
  }

  return next();
});

app.post('/interactions', async c => {
  const data = await c.req.json() as APIGuildInteraction | APIPingInteraction;
  switch (data.type) {
    case InteractionType.Ping: {
      return c.json({ type: InteractionResponseType.Pong });
    }

    case InteractionType.ApplicationCommand: {
      const cmd = commands.find(it => it.command.name === data.data.name);
      if (!cmd) {
        return c.text('fail', 400);
      }

      return c.json(await cmd.execute(data));
    }

    default: {
      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: 'interaction not supported at the moment.',
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

  const registeredCommands = await (await fetch(`https://discord.com/api/applications/${c.env.DISCORD_CLIENT_ID}/commands`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bot ${c.env.DISCORD_BOT_TOKEN}` },
    body: JSON.stringify(commands.map(it => it.command)),
  })).json() as RESTPutAPIApplicationCommandsResult;

  return c.json(registeredCommands);
});

export default app;
