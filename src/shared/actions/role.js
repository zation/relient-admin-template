import { createAction, actionTypeCreator, read } from 'relient/actions';
import { DEFAULT_PAGE, DEFAULT_SIZE } from '../constants/pagination';

const actionType = actionTypeCreator('actions/role');

export const READ_ALL = actionType('READ_ALL');

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
  } = {}) => read('/role/all', {
    page,
    size,
  }),
);
