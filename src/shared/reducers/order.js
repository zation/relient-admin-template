import { merge, remove, handleActions, combineActions } from 'relient/reducers';
import { order } from 'shared/schema';
import {
  READ_MINE,
  UPDATE,
  READ_ALL,
  READ_ONE,
  CREATE,
  REMOVE,
} from 'shared/actions/order';

export default {
  order: handleActions({
    [combineActions(
      READ_ONE,
      UPDATE,
      CREATE,
    )]: merge({ schema: order }),

    [combineActions(READ_ALL, READ_MINE)]: merge({ schema: order, dataKey: 'content' }),

    [REMOVE]: remove(order),

  }, {}),
};
