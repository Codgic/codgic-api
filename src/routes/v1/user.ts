/* /src/routes/v1/user.ts */

import * as Router from 'koa-router';

import * as User from './../../controllers/user';

const user = new Router();

user.get('/', User.getCurrentInfo);
user.get('/:username', User.getUserInfo);

user.post('/', User.postUser);

user.put('/', User.updateUser);

// Unimplemented:

// user.delete('/', User.deleteUser);

export { user };
