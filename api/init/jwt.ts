import * as Koa from 'koa';
import * as jwt from 'koa-jwt';

export function initJWT(app: Koa, secret: string) {
  // Process 401 Error.
  app.use((ctx, next) => {
    return next().catch((err) => {
      if (401 === err.status) {
        ctx.status = 401;
        ctx.body = {
          error: 'Protected resource, use Authorization header to get access.',
        };
      } else {
        throw err;
      }
    });
  });

  // Initialize JWT secret.
  app.use(jwt({ secret: `${secret}` }).unless({
    path: [
      '/',
      '/auth',
      '/user',
    ],
  }));

}
