/* /src/routes/v1/group.ts */

import * as Router from 'koa-router';

import * as Group from './../../controllers/group';

const group = new Router();

// group.get('/', Group.getGroupList);
group.get('/:groupid', Group.getGroupInfo);
// group.get('/:groupid/member', Group.getGroupMember);

group.post('/', Group.postGroup);
group.post('/:groupid/member', Group.addToGroup);

// group.put('/', group.updateProfile);
// group.delete('/', group.deleteProfile);

export { group };
