/* /api/index.ts
   Where everything starts. */

import * as Koa from 'koa';
import { getConfig } from './init/config';
import { initKoa } from './init/koa';
import { initRoutes } from './init/routes';

const app = new Koa();
const config = getConfig();

// Initialize everything.
initKoa(app);
initRoutes(app);

// Quit if port is invalid.
if (typeof (config.API.PORT) !== 'number') {
  console.error(`Invalid PORT: ${config.API.PORT}`);
  process.exit();
}

// Start listening!
app.listen(config.API.PORT, () => {
    console.log(`Codgic-api listening at port ${config.API.PORT}`);
});

export { app };
