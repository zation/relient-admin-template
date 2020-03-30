import { flow, orderBy } from 'lodash/fp';
import { getEntityArray } from 'relient/selectors';

export default (state) => ({
  data: flow(
    getEntityArray('account'),
    orderBy('createdAt', 'desc'),
  )(state),
});
