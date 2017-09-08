/* /src/routes/v1/group.ts */

import * as Router from 'koa-router';

import * as Group from './../../controllers/group';

const group = new Router();

// group.get('/', Group.getGroupList);
group.get('/:groupId', Group.getGroupInfo);
group.get('/:groupId/member', Group.getGroupMember);

group.post('/', Group.postGroup);
group.post('/:groupid/member', Group.addToGroup);

// group.put('/', group.updateGroup);

// group.delete('/', group.deleteGroup);
group.delete('/:groupId/member/:userId', Group.removeFromGroup);

export { group };
