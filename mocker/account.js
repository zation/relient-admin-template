import { name, internet, phone, date, datatype, lorem } from 'faker';
import { map, sample, range, find, propEq } from 'lodash/fp';
import { NormalStatus, normalStatuses } from 'relient-admin/constants/normal-status';
import { ADMIN, roleKeys } from 'shared/constants/role-key';
import { genders } from 'shared/constants/gender';
import pagination from 'relient-admin/mocker/pagination';

export const createItem = (values) => ({
  id: datatype.number(),
  username: internet.userName(),
  password: internet.password(),
  phoneNumber: phone.phoneNumber(),
  email: internet.email(),
  name: `${name.firstName()} ${name.lastName()}`,
  roleKey: sample(roleKeys),
  status: sample(normalStatuses),
  createdAt: date.past(),
  updatedAt: date.past(),
  gender: sample(genders),
  birthDate: date.past(),
  introduction: `<p>${lorem.paragraph()}</p>\n<p>${lorem.paragraph()}</p>`,
  ...values,
});

export const current = createItem({
  status: NormalStatus.Active,
  roleKey: ADMIN,
});

export const items = map(createItem)(range(1, 40));

export default (router) => {
  router.get('/api/account/mine', (request, response) => {
    response.status(200).send(current);
  });

  router.post('/api/account', ({ body }, response) => {
    const now = new Date().toISOString();
    response.status(200).send(createItem({ ...body, createdAt: now, updatedAt: now }));
  });

  router.get('/api/account/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
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
