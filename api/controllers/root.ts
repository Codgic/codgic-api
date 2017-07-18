/* Let's just say hi! */

import * as Koa from 'koa';
import { getConfig } from './../init/config';

export async function hi(ctx: Koa.Context, next: () => Promise<any>) {
  const config = getConfig();
  ctx.status = 200;
  ctx.body = `{ "name": "${config.oj.name}" }`;
  await next();
}
