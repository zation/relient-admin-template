import {
  createAction,
  actionTypeCreator,
  read,
  put,
  post,
} from 'relient/actions';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'shared/constants/pagination';

const actionType = actionTypeCreator('actions/account');

export const READ_MINE = actionType('READ_MINE');
export const READ_ALL = actionType('READ_ALL');
export const UPDATE = actionType('UPDATE');
export const CREATE = actionType('CREATE');
export const RESET_PASSWORD = actionType('RESET_PASSWORD');
export const RESET_MINE_PASSWORD = actionType('RESET_MINE_PASSWORD');

export const readMine = createAction(
  READ_MINE,
  () => read('/account/mine'),
);

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    status,
    name,
    phoneNumber,
  } = {}) => read('/account/all', {
    page,
    size,
    sort: 'createdAt,desc',
    status,
    name,
    phoneNumber,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    name,
    roleKey,
    username,
    password,
    phoneNumber,
    email,
    status,
    introduction,
  }) => put(`/account/${id}`, {
    id,
    name,
    roleKey,
    username,
    password,
    phoneNumber,
    email,
    status,
    introduction,
  }),
);

export const create = createAction(
  CREATE,
  ({
    name,
    roleKey,
    username,
    password,
    phoneNumber,
    email,
    status,
    introduction,
  }) => post('/account', {
    name,
    roleKey,
    username,
    password,
    phoneNumber,
    email,
    status,
    introduction,
  }),
);

export const resetPassword = createAction(
  RESET_PASSWORD,
  ({
    id,
    oldPassword,
    newPassword,
  }) => post(`/account/${id}/action/reset-password`, {
    id,
    oldPassword,
    newPassword,
  }),
);

export const resetMinePassword = createAction(
  RESET_MINE_PASSWORD,
  ({
    oldPassword,
    newPassword,
  }) => post('/account/mine/action/reset-password', {
    oldPassword,
    newPassword,
  }),
);
