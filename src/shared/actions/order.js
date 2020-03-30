import { createAction, actionTypeCreator, post, read, put, del } from 'relient/actions';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'shared/constants/pagination';

const actionType = actionTypeCreator(__filename);

export const READ_ONE = actionType('READ_ONE');
export const READ_MINE = actionType('READ_MINE');
export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const UPDATE = actionType('UPDATE');
export const REMOVE = actionType('REMOVE');

export const readMine = createAction(
  READ_MINE, ({
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort = 'createdAt,desc',
    name,
    serialNumber,
  } = {}) => read('/order/mine', {
    page,
    size,
    sort,
    name,
    serialNumber,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/order/${id}`),
);

export const readAll = createAction(
  READ_ALL, ({
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort = 'createdAt,desc',
    name,
    serialNumber,
  } = {}) => read('/order/all', {
    page,
    size,
    sort,
    name,
    serialNumber,
  }),
);

export const create = createAction(
  CREATE, ({
    accountId,
  }) => post('/order', {
    accountId,
  }),
);

export const update = createAction(
  UPDATE, ({
    id,
    items,
    status,
  }) => put(`/order/${id}`, {
    id,
    items,
    status,
  }),
);

export const remove = createAction(REMOVE, ({ id }) => del(`/order/${id}`));
