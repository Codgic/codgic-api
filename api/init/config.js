/* config.js
   Used to read configurations from config.yml. */

'use strict';

import yaml from 'js-yaml';
import fs from 'fs';

// Read yaml
export default function getConfig() {
  let conf;
  try {
    conf = yaml.safeLoad(fs.readFileSync(`${__dirname}/../../config.yml`, 'utf8'));
  } catch (err) {
    console.error(`[js-yaml] ${err}`);
  }
  if (typeof (conf) === 'undefined') {
    console.error('[codgic-api] Failed to read config.yml.');
    process.exit();
  }
  return conf;
}
