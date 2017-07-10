/* Let's just say hi! */

import * as Koa from 'koa';
import { getConfig } from './../init/config';

export async function hi(ctx: Koa.Context, next: () => Promise<any>) {
  const config = getConfig();
  ctx.body = `{ "msg": "Hello ${config.OJ.NAME}" }`;
  await next();
}
