import {
  roleKeys,
  ADMIN,
} from 'shared/constants/role-key';
import {
  PASSWORD,
  PROFILE,
  ADMIN_ACCOUNT,
  BASIC_LOCAL_PAGINATION_TABLE,
  BASIC_API_PAGINATION_TABLE,
  FUSSY_LOCAL_PAGINATION_TABLE,
  FUSSY_API_PAGINATION_TABLE,
  FILTER_API_PAGINATION_TABLE,
  HOME,
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
}, {
  key: BASIC_LOCAL_PAGINATION_TABLE,
  roleKeys,
}, {
  key: BASIC_API_PAGINATION_TABLE,
  roleKeys,
}, {
  key: FUSSY_LOCAL_PAGINATION_TABLE,
  roleKeys,
}, {
  key: FILTER_API_PAGINATION_TABLE,
  roleKeys,
}, {
  key: FUSSY_API_PAGINATION_TABLE,
  roleKeys,
}, {
  key: HOME,
  roleKeys,
}];

export default (router) => {
  router.get('/api/permission/all', (request, response) => {
    response.status(200).send({ content: items });
  });
};
