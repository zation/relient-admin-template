import { merge, handleActions } from 'relient/reducers';
import { permission } from '../schema';
import {
  READ_ALL,
} from '../actions/permission';

export default {
  permission: handleActions({
    [READ_ALL]: merge({ schema: permission, dataKey: 'content' }),

  }, {}),
};
