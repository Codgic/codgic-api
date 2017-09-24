/* /src/routes/v1/user.ts */

import * as Router from 'koa-router';

import * as User from './../../controllers/user';

const user = new Router();

user.get('/', User.getUserInfo);
user.get('/:username', User.getUserInfo);

user.post('/', User.postUser);

user.put('/:username', User.updateUser);

user.patch('/:username', User.updateUser);

// Unimplemented:

// user.delete('/', User.deleteUser);

export { user };
