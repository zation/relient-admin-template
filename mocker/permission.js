import {
  roleKeys,
  ADMIN,
} from 'shared/constants/role-key';
import {
  PASSWORD,
  PROFILE,
  ADMIN_ACCOUNT,
} from 'shared/constants/features';

export const items = [{
  key: PASSWORD,
  roleKeys,
}, {
  key: PROFILE,
  roleKeys,
}, {
  key: ADMIN_ACCOUNT,
  roleKeys: [ADMIN],
}];

export default (router) => {
  router.get('/api/permission/all', (request, response) => {
    response.status(200).send({ content: items });
  });
};
