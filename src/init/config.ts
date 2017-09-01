/* /src/init/config.ts
  Read configurations from config.yml. */

import * as fs from 'fs';
import * as yaml from 'js-yaml';

export interface IConfigStructure {

  oj: {
    name: string,
    timezone: string,
    policy: {
      access: {
        need_login: boolean,
      },
      signup: {
        need_confirmation: boolean,
        need_verify_email: boolean,
      },
      profile: {
        nickname: {
          min_length: number,
          max_length: number,
        },
        password: {
          min_length: number,
          max_length: number,
        },
        username: {
          min_length: number,
          max_length: number,
        },
      },
      content: {
        common_user_can_post: boolean,
        common_user_post_need_confirmation: boolean,
      },
    },
    default: {
      page: {
        contest: number,
        group: number,
        problem: number,
        user: number,
      },
      contest: {
        duration: number,
      },
      problem: {
        first_problem_id: number,
        memory_limit: number,
        time_limit: number,
      },
    },
  };

  api: {
    port: number,
    jwt: {
      debug: boolean,
      expire_time: string,
      secret: string,
    },
  };

  database: {
    host: string,
    port: number,
    database: string,
    username: string,
    password: string,
    type: 'mysql',  // Currently only mysql is tested.
    log: {
      queries: boolean,
      failed_query_error: boolean,
    },
  };

}

// Read config.yml.
export function getConfig() {
  try {
    const conf: IConfigStructure = yaml.safeLoad(fs.readFileSync(`${__dirname}/../../config.yml`, 'utf8'));
    return conf;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to read config.yml.');
  }
}

export const config: IConfigStructure = getConfig();
