/* config.ts
  Read configurations from config.yml. */

import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Read config.yml.
export function getConfig() {

  let conf;

  try {
    conf = yaml.safeLoad(fs.readFileSync(`${__dirname}/../../config.yml`, 'utf8'));
  } catch (err) {
    console.error(err);
    throw new Error('Failed to read config.yml.');
  }

  return conf;

}
