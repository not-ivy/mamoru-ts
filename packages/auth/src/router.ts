import { router } from './trpc';

import callback from './apis/callback';
import create from './apis/create';
import info from './apis/info';
import remove from './apis/remove';
import stats from './apis/stats';

export const appRouter = router({
  callback,
  create,
  info,
  remove,
  stats
});
