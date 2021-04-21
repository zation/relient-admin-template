import { combineReducers } from 'redux';
import { createEntitiesReducer } from 'relient/reducers';
import account from './account';
import auth from './auth';
import role from './role';
import permission from './permission';
import order from './order';

export default combineReducers<any, any>({
  ...createEntitiesReducer([
    auth,
    account,
    role,
    permission,
    order,
  ]),
});
