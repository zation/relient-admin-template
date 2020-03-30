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

const includesSerialNumber = (serialNumber) => (item) => includes(
  serialNumber.toUpperCase(),
)(item.serialNumber.toUpperCase());
const includesName = (name) => (item) => includes(
  name.toUpperCase(),
)(item.name.toUpperCase());

export default (router) => {
  router.get('/api/order/all', ({ query: { serialNumber, name, serialNumberOrName, ...query } }, response) => {
    let result = items;
    if (serialNumberOrName) {
      result = filter(
        (item) => includesSerialNumber(serialNumberOrName)(item)
          || includesName(serialNumberOrName)(item),
      )(items);
    } else if (serialNumber && name) {
      result = filter(
        (item) => includesSerialNumber(serialNumber)(item) && includesName(name)(item),
      )(items);
    } else if (serialNumber) {
      result = filter(includesSerialNumber(serialNumber))(items);
    } else if (name) {
      result = filter(includesName(name))(items);
    }
    response.status(200).send(pagination(query)(result));
  });

  router.post('/api/order', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(item);
  });

  router.put('/api/order/:id', ({ body, params: { id } }, response) => {
    response.status(200).send({ ...body, id: Number(id) });
  });
};
