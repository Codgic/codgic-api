/* /api/controllers/auth.ts
   Get authenticated first! */

import * as Koa from 'koa';
import * as Auth from './../models/auth';

import { getUserInfo } from './../models/user';

import { UserPrivilege } from './../init/privilege';

export async function verifyAuthInfo(ctx: Koa.Context, next: () => Promise<any>) {

  // Auth and get user info.
  const userInfo: any = Auth
                      .getUserInfoWithAuth(ctx.request.body.password, ctx.request.body.username)
                      .catch((err) => {
                        ctx.throw(403, err);
                      });

  // Generate Token.
  ctx.body = await Auth
                  .generateToken(userInfo.id, userInfo.username, userInfo.email, userInfo.privilege)
                  .catch((err) => {
                    ctx.throw(500, err);
                  });

  ctx.status = 200;

  await next();

}
