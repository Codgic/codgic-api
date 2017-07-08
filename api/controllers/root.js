/* Let's just say hi! */

'use strict';

import getConfig from './../init/config';

export async function index(ctx, next) {
  ctx.status = 200;
  ctx.body = `{ "msg": "${ctx.params.text}" }`;
  await next();
}

export async function hi(ctx, next) {
  const config = getConfig();
  ctx.status = 200;
  ctx.body = `{ "msg": "Hello ${config.OJ.NAME}" }`;
  await next();
}
