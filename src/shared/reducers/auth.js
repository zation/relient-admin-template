import { handleActions, combineActions } from 'relient/reducers';
import { NormalStatus } from 'relient-admin/constants/normal-status';
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
      if (account && account.status === NormalStatus.Active) {
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

    [READ_MINE]: (auth, { payload: { id, status } }) => (status === NormalStatus.Active ? {
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
