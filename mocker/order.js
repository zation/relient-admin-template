import { random, date, datatype, image, system } from 'faker';
import { map, sample, range, filter, includes, flow, prop, split, toNumber } from 'lodash/fp';
import { orderStatuses } from 'shared/constants/order-status';
import pagination from 'relient-admin/mocker/pagination';
import { items as accounts } from './account';

export const createItem = (values) => ({
  id: datatype.number(),
  accountId: flow(sample, prop('id'))(accounts),
  total: datatype.number(),
  status: sample(orderStatuses),
  serialNumber: datatype.number().toString(),
  name: random.words(),
  updatedAt: date.past(),
  createdAt: date.past(),
  images: map(() => ({
    url: image.image(),
    fileName: system.fileName(),
  }))(range(1, 4)),
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
  router.get('/api/order/all', ({ query: { serialNumber, name, serialNumberOrName, accountIds, ...query } }, response) => {
    let result = items;
    if (serialNumberOrName) {
      result = filter(
        (item) => includesSerialNumber(serialNumberOrName)(item)
          || includesName(serialNumberOrName)(item),
      )(result);
    } else if (serialNumber && name) {
      result = filter(
        (item) => includesSerialNumber(serialNumber)(item) && includesName(name)(item),
      )(result);
    } else if (serialNumber) {
      result = filter(includesSerialNumber(serialNumber))(result);
    } else if (name) {
      result = filter(includesName(name))(result);
    }
    if (accountIds) {
      const accountIdNumbers = flow(split(','), map(toNumber))(accountIds);
      result = filter(({ accountId }) => includes(accountId)(accountIdNumbers))(result);
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
