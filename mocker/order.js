import { random, date } from 'faker';
import { map, sample, range, filter, includes, flow, prop } from 'lodash/fp';
import { orderStatuses } from 'shared/constants/order-status';
import { pagination } from './util';
import { items as accounts } from './account';

export const createItem = (values) => ({
  id: random.number(),
  accountId: flow(sample, prop('id'))(accounts),
  total: random.number(),
  status: sample(orderStatuses),
  serialNumber: random.number().toString(),
  name: random.words(),
  updatedAt: date.past(),
  createdAt: date.past(),
  ...values,
});

export const items = map(createItem)(range(1, 40));

export default (router) => {
  router.get('/api/order/all', ({ query: { serialNumber, name, ...query } }, response) => {
    let result = items;
    if (serialNumber && name) {
      result = filter(
        (item) => includes(serialNumber)(item.serialNumber) || includes(name)(item.name),
      )(items);
    } else if (serialNumber) {
      result = filter((item) => includes(serialNumber)(item.serialNumber))(items);
    } else if (name) {
      result = filter((item) => includes(name)(item.name))(items);
    }
    response.status(200).send(pagination(query)(result));
  });
};
