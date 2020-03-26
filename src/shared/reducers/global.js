import { handleActions } from 'relient/reducers';
import { SET_FEATURE } from 'shared/actions/global';

export default {
  global: handleActions({
    [SET_FEATURE]: (global, { payload }) => ({
      ...global,
      feature: payload,
    }),

  }, {
    feature: null,
  }),
};
