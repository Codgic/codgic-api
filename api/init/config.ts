/* config.ts
   Used to read configurations from config.yml. */

import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Read yaml
export function getConfig() {
  let conf;
  try {
    conf = yaml.safeLoad(fs.readFileSync(`${__dirname}/../../config.yml`, 'utf8'));
  } catch (err) {
    console.error(err);
  }
  if (typeof (conf) === 'undefined') {
    console.error('Failed to read config.yml.');
    process.exit();
  }
  return conf;
}
