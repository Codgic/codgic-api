/* Let's just say hi! */

import { Context } from 'koa';

import { getConfig } from './../init/config';

const config = getConfig();

export async function hi(ctx: Context, next: () => Promise<any>) {

  ctx.status = 200;

  ctx.body = {
    name: config.oj.name,
    language: config.oj.language,
    timezone: config.oj.timezone,
    policy: config.oj.policy,
  };

  await next();

}
