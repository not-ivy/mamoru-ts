import { generateState, OAuth2RequestError, type Discord } from 'arctic';
import { uid } from 'uid/secure';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { cache } from 'hono/cache';
import makeArctic from './libs/auth.js';
import { connectionsDiscord, identifyDiscord } from './utils.js';

const app = new Hono<{ Bindings: Env; Variables: { arctic: Discord; }; }>();

app.use(async (c, next) => {
  c.set('arctic', makeArctic(c.env.DISCORD_CLIENT_ID, c.env.DISCORD_CLIENT_SECRET, c.env.DISCORD_REDIRECT_URI));
  return next();
});

app.use('*', async (c, next) => cors({
  origin: c.env.CLIENT_URL,
})(c, next));

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
    const identify = await identifyDiscord(token.tokenType(), token.accessToken());
    const existing = await c.env.index.get(identify.id);
    if (existing) return c.redirect(`${c.env.CLIENT_URL}/signin?userId=${existing}`);
    const id = uid(32);
    await c.env.tokens.put(id, JSON.stringify(token.data), { expirationTtl: token.accessTokenExpiresInSeconds() });
    await c.env.index.put(identify.id, id);
    return c.redirect(`${c.env.CLIENT_URL}/signin?userId=${id}`);
  } catch (error) {
    if (!(error instanceof OAuth2RequestError)) {
      console.error(error);
    }

    return c.text('fail', error instanceof OAuth2RequestError ? 401 : 500);
  }
});

app.use('/info', cache({
  cacheName: 'mamoru-auth',
  cacheControl: 'public, max-age=10800, immutable',
}));

app.get('/info', async c => {
  try {
    const { userId } = c.req.query();
    if (!userId) {
      return c.text('fail', 400);
    }

    const tokenRaw = await c.env.tokens.get(userId);
    if (!tokenRaw) {
      return c.text('fail', 401);
    }

    const token = JSON.parse(tokenRaw) as { token_type: string; access_token: string; };
    const identify = await identifyDiscord(token.token_type, token.access_token);
    const connections = await connectionsDiscord(token.token_type, token.access_token);
    const steamConnection = connections.find(it => it.type === 'steam' && it.verified);
    return c.json({ name: identify.global_name, discord: identify.id, steam: steamConnection?.id });
  } catch {
    return c.text('fail', 500);
  }
});

app.get('/stats', async c => {
  const token = c.req.header('Authorization');
  if (token !== `Bearer ${c.env.DISCORD_CLIENT_SECRET}`) return c.text('fail', 401);
  return c.json({
    length: (await c.env.index.list()).keys.length,
    users: (await c.env.index.list()).keys
  });
});

export default app;
