import { flow, filter, map, includes, first, prop, orderBy } from 'lodash/fp';
import { getEntityArray, getEntity } from 'relient/selectors';
import { NormalStatus } from 'relient-admin/constants/normal-status';

export default ({ roleKeys }) => (state) => ({
  data: flow(
    getEntityArray('account'),
    filter(({ roleKey }) => includes(roleKey)(roleKeys)),
    orderBy('createdAt', 'desc'),
  )(state),
  roleOptions: flow(
    getEntityArray('role'),
    filter(({ key }) => includes(key)(roleKeys)),
    map(({ key, name }) => ({
      value: key,
      label: name,
    })),
  )(state),
  roleEntity: getEntity('role')(state),
  createInitialValues: {
    roleKey: flow(
      getEntityArray('role'),
      filter(({ key }) => includes(key)(roleKeys)),
      first,
      prop('key'),
    )(state),
    status: NormalStatus.Active,
  },
});
