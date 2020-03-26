import {
  ADMIN,
} from 'shared/constants/role-key';

export const items = [{
  key: ADMIN,
  name: '平台管理员',
}];

export default (router) => {
  router.get('/api/role/all', (request, response) => {
    response.status(200).send({ content: items });
  });
};
