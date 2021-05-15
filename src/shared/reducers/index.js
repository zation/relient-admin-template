import { combineReducers } from 'redux';
import { createReducer } from 'relient/reducers';
import account from './account';
import auth from './auth';
import role from './role';
import permission from './permission';
import order from './order';

export default combineReducers({
  ...createReducer([
    auth,
    account,
    role,
    permission,
    order,
  ]),
});
