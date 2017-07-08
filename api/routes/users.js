/* /api/routes/user.js */

'use strict';

import router from 'koa-router';

import { getCurrentInfo, getUserInfo } from './../controllers/users';

const users = router();

users.get('/user/', getCurrentInfo);
users.get('/user/:username', getUserInfo);

export default users;
