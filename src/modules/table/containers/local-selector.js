import { flow, orderBy, map } from 'lodash/fp';
import { getEntity, getEntityArray } from 'relient/selectors';

export default (state) => ({
  data: flow(
    getEntityArray('account'),
    orderBy('createdAt', 'desc'),
  )(state),
  roleEntity: getEntity('role')(state),
  roleOptions: flow(
    getEntityArray('role'),
    map(({ key, name }) => ({ value: key, text: name })),
  )(state),
});
