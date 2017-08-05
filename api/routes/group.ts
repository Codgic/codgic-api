/* /api/routes/group.ts */

import * as Router from 'koa-router';

import * as Group from './../controllers/group';

const group = new Router();

// group.get('/', Group.getCurrentInfo);
group.get('/:groupid', Group.getGroupInfo);
group.get('/:groupid/members', Group.getGroupMembers);

group.post('/', Group.postGroup);

// group.put('/', group.updateProfile);
// group.delete('/', group.deleteProfile);

export { group };
