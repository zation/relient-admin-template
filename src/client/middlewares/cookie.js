import cookie from 'js-cookie';
import { AUTHORIZATION, IS_MENU_COLLAPSED } from 'shared/constants/cookie';
import {
  LOGIN,
  LOGOUT,
  SET_AUTHORIZATION,
} from 'shared/actions/auth';
import { SET_IS_MENU_COLLAPSED } from 'shared/actions/global';

export default () => (next) => (action) => {
  const { type } = action;
  if (type === LOGIN) {
    const { payload: { authorization }, meta: { shouldRemember } } = action;
    if (shouldRemember) {
      cookie.set(AUTHORIZATION, authorization, { expires: 60 });
    } else {
      cookie.set(AUTHORIZATION, authorization);
    }
  }
  if (type === LOGOUT) {
    cookie.remove(AUTHORIZATION);
  }
  if (type === SET_AUTHORIZATION) {
    cookie.set(AUTHORIZATION, action.payload);
  }
  if (type === SET_IS_MENU_COLLAPSED) {
    cookie.set(IS_MENU_COLLAPSED, action.payload);
  }
  return next(action);
};
