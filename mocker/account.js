import { random, name, internet, phone, date } from 'faker';
import { map, flow, sample, prop, range, find, propEq } from 'lodash/fp';
import { ACTIVE, normalStatuses } from 'shared/constants/normal-status';
import { ADMIN } from 'shared/constants/role-key';
import { genders } from 'shared/constants/gender';
import { items as roles } from './role';

export const getItem = (values) => ({
  id: random.number(),
  username: internet.userName(),
  password: internet.password(),
  phoneNumber: phone.phoneNumber(),
  email: internet.email(),
  name: `${name.firstName()} ${name.lastName()}`,
  roleKey: flow(sample, prop('key'))(roles),
  status: sample(normalStatuses),
  createdAt: date.past(),
  updatedAt: date.past(),
  gender: sample(genders),
  birthDate: date.past(),
  ...values,
});

export const current = getItem({
  status: ACTIVE,
  roleKey: ADMIN,
});

export const items = map(getItem)(range(1, 40));

export default (router) => {
  router.get('/api/account/mine', (request, response) => {
    response.status(200).send(current);
  });

  router.post('/api/account', ({ body }, response) => {
    const now = new Date().toISOString();
    response.status(200).send(getItem({ ...body, createdAt: now, updatedAt: now }));
  });

  router.get('/api/account/all', (request, response) => {
    response.status(200).send({ content: items });
  });

  router.get('/api/account/:id', ({ params: { id } }, response) => {
    response.status(200).send(find(propEq('id', Number(id)))(items));
  });

  router.put('/api/account/:id', ({ body, params: { id } }, response) => {
    const now = new Date().toISOString();
    response.status(200).send({ ...body, id: Number(id), updatedAt: now });
  });

  router.post('/api/account/:id/action/reset-password', (request, response) => {
    response.status(204).send();
  });
};
