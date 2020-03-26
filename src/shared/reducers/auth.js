import { handleActions, combineActions } from 'relient/reducers';
import { ACTIVE } from 'shared/constants/normal-status';
import {
  LOGIN,
  SET_AUTHORIZATION,
  REMOVE_AUTHORIZATION,
  LOGOUT,
} from '../actions/auth';
import { READ_MINE } from '../actions/account';

export default {
  auth: handleActions({
    [combineActions(
      LOGIN,
    )]: (auth, {
      payload: { account, authorization },
    }) => {
      if (account && account.status === ACTIVE) {
        return {
          isLogin: true,
          authorization,
          currentAccountId: account.id,
        };
      }
      return auth;
    },

    [LOGOUT]: () => ({
      isLogin: false,
      authorization: null,
      currentAccountId: null,
    }),

    [SET_AUTHORIZATION]: (auth, { payload }) => ({
      ...auth,
      authorization: payload,
    }),

    [REMOVE_AUTHORIZATION]: (auth) => ({ ...auth, authorization: null }),

    [READ_MINE]: (auth, { payload: { id, status } }) => (status === ACTIVE ? {
      ...auth,
      isLogin: true,
      currentAccountId: id,
    } : auth),

  }, {
    authorization: null,
    isLogin: false,
    currentAccountId: null,
  }),
};
