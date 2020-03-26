import { merge, handleActions } from 'relient/reducers';
import { role } from '../schema';
import {
  READ_ALL,
} from '../actions/role';

export default {
  role: handleActions({
    [READ_ALL]: merge({ schema: role, dataKey: 'content' }),

  }, {}),
};
