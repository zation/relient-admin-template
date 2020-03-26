import { merge, handleActions, combineActions } from 'relient/reducers';
import { account } from '../schema';
import { LOGIN } from '../actions/auth';
import {
  UPDATE,
  READ_MINE,
  READ_ALL,
  CREATE,
} from '../actions/account';

export default {
  account: handleActions({
    [combineActions(
      UPDATE,
      READ_MINE,
      CREATE,
    )]: merge({ schema: account }),

    [READ_ALL]: merge({
      schema: account,
      dataKey: 'content',
    }),

    [combineActions(
      LOGIN,
    )]: merge({
      schema: account,
      dataKey: 'account',
    }),

  }, {}),
};
