import type { Discord } from 'arctic';
import { Hono } from 'hono';
import makeArctic from './libs/auth';

const app = new Hono<{ Bindings: Env, Variables: { arctic: Discord } }>();

app.use(async (c, next) => {
  c.set('arctic', makeArctic(c.env.DISCORD_CLIENT_ID, c.env.DISCORD_CLIENT_SECRET, c.env.DISCORD_REDIRECT_URI));
  await next();
});

app.get('/', (c) => c.text(c.env.DISCORD_CLIENT_ID));

export default app;
