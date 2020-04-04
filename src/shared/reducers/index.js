import { combineReducers } from 'redux';
import { createEntitiesReducer } from 'relient/reducers';
import feature from 'relient-admin/reducers/feature';
import account from './account';
import auth from './auth';
import role from './role';
import permission from './permission';
import order from './order';

export default combineReducers({
  ...createEntitiesReducer([
    auth,
    account,
    role,
    permission,
    order,
  ]),
  ...feature,
});
