import { combineReducers } from 'redux';
import { createEntitiesReducer } from 'relient/reducers';
import global from './global';
import account from './account';
import auth from './auth';
import role from './role';
import permission from './permission';

export default combineReducers({
  ...createEntitiesReducer([
    auth,
    account,
    role,
    permission,
  ]),
  ...global,
});
