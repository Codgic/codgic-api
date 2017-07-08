/* /api/index.js
   Where everything starts. */

'use strict';

import Koa from 'koa';
import initKoa from './init/koa';
import initRoutes from './init/routes';
import getConfig from './init/config';

const app = new Koa();
const config = getConfig();

// Initialize everything.
initKoa(app);
initRoutes(app);

// Quit if port is invalid.
if (typeof (config.API.PORT) !== 'number') {
  console.error(`[codgic-api] Invalid PORT: ${config.API.PORT}`);
  process.exit();
}

// Start listening!
app.listen(config.API.PORT, (err) => {
  if (err) {
    console.error(`[koa] ${err} `);
  } else {
    console.log(`[koa] Codgic-api listening at port ${config.API.PORT}`);
  }
});

export default app;
