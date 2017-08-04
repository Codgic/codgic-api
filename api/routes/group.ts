/* /api/routes/group.ts */

import * as Router from 'koa-router';

import * as Group from './../controllers/group';

const group = new Router();

// group.get('/', Group.getCurrentInfo);
// group.get('/:groupname', Group.getGroupInfo);

// group.post('/', group.newGroup);

// group.put('/', group.updateProfile);
// group.delete('/', group.deleteProfile);

export { group };
