import { generateState, OAuth2RequestError, type Discord } from 'arctic';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { cors } from 'hono/cors'
import makeArctic from './libs/auth.js';
import type { DiscordConnections, DiscordIdentify } from './types.js';

const app = new Hono<{ Bindings: Env; Variables: { arctic: Discord } }>();

app.use(async (c, next) => {
  c.set('arctic', makeArctic(c.env.DISCORD_CLIENT_ID, c.env.DISCORD_CLIENT_SECRET, c.env.DISCORD_REDIRECT_URI));
  await next();
});

app.use('*', async (c, next) => cors({
  origin: c.env.CLIENT_URL
})(c, next))

app.get('/', c => c.redirect(c.env.CLIENT_URL));

app.get('/create', async c => {
  const state = generateState();
  await c.env.states.put(state, '1', { expirationTtl: 300 });
  return c.redirect(c.var.arctic.createAuthorizationURL(state, ['identify', 'connections']));
});

app.get('/callback', async c => {
  try {
    const { state, code } = c.req.query();
    if (!code || !state) {
      return c.text('fail', 400);
    }

    if ((await c.env.states.get(state)) !== '1') {
      return c.text('fail', 401);
    }

    await c.env.states.delete(state);
    const token = await c.var.arctic.validateAuthorizationCode(code);
    const id = cuid2();
    await c.env.tokens.put(id, JSON.stringify(token.data), { expirationTtl: token.accessTokenExpiresInSeconds() });
    return c.redirect(`${c.env.CLIENT_URL}/signin?id=${id}`);
  } catch (error) {
    if (!(error instanceof OAuth2RequestError)) {
      console.error(error);
    }

    return c.text('fail', error instanceof OAuth2RequestError ? 401 : 500);
  }
});

app.get('/info', async c => {
  try {
    const { id } = c.req.query();
    if (!id) {
      return c.text('fail', 400);
    }

    const tokenRaw = await c.env.tokens.get(id);
    if (!tokenRaw) {
      return c.text('fail', 401);
    }

    const token = JSON.parse(tokenRaw) as { token_type: string; access_token: string };
    const authOptions = { headers: { authorization: `${token.token_type} ${token.access_token}` } };
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const identify = await (await (fetch('https://discord.com/api/users/@me', authOptions))).json() as DiscordIdentify;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const connections = await (await fetch('https://discord.com/api/users/@me/connections', authOptions)).json() as DiscordConnections;
    const steamConnection = connections.find(it => it.type === 'steam' && it.verified);
    return c.json({ name: identify.global_name, discord: identify.id, steam: steamConnection?.id });
  } catch {
    return c.text('fail', 500);
  }
});

export default app;
