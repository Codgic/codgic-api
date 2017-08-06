/* /controllers/auth.ts
   Get authenticated first! */

import { Context } from 'koa';

import { getHttpStatusCode } from './../init/error';
import { UserPrivilege } from './../init/privilege';
import * as Auth from './../models/auth';
import { getUserInfo } from './../models/user';

export async function verifyAuthInfo(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (!ctx.request.body.password || !ctx.request.body.username) {
    ctx.throw(400);
  }

  // Auth and get user info.
  const userInfo: any = await Auth
                      .getUserInfoWithAuth(ctx.request.body.password, ctx.request.body.username)
                      .catch((err) => {
                        ctx.throw(getHttpStatusCode(err.message), err.message);
                      });

  // Generate Token.
  const token = await Auth
                      .generateToken(userInfo.id, userInfo.username, userInfo.email, userInfo.privilege)
                      .catch((err) => {
                        ctx.throw(getHttpStatusCode(err.message), err.message);
                      });

  ctx.body = {
    token: `${token}`,
  };
  ctx.status = 200;

  await next();

}
