/* Let's just say hi! */

import { getConfig } from './../init/config';

export async function index(ctx: any, next: any) {
  ctx.status = 200;
  ctx.body = `{ "msg": "${ctx.params.text}" }`;
  await next();
}

export async function hi(ctx: any, next: any) {
  const config = getConfig();
  ctx.status = 200;
  ctx.body = `{ "msg": "Hello ${config.OJ.NAME}" }`;
  await next();
}
