import cookie from 'js-cookie';
import AUTHORIZATION from 'relient-admin/constants/authorization';
import {
  LOGIN,
  LOGOUT,
} from 'shared/actions/auth';

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
  return next(action);
};
