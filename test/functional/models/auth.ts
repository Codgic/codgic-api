/* /test/functional/models/auth.ts */

import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
import * as mocha from 'mocha';

import { config } from './../../../src/init/config';
import * as Auth from './../../../src/models/auth';

describe('Generate token.', () => {
  it('should return a valid json web token.', async () => {

    // Generate token.
    const accessToken = await Auth.generateToken(1, 'codgic', 'fuckzk@codgi.cc', 1);

    // Verify token.
    jwt.verify(accessToken, config.api.jwt.secret, (err: any, decoded: any) => {
      chai.expect(err).to.equal(undefined);
      chai.expect(decoded.id).to.equal(1);
      chai.expect(decoded.username).to.equal('codgic');
      chai.expect(decoded.email).to.equal('fuckzk@codgi.cc');
      chai.expect(decoded.privilege).to.equal(1);
    });

  });
});
