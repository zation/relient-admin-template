import { handleActions } from 'relient/reducers';
import {
  SET_IS_MENU_COLLAPSED,
} from '../actions/global';

export default {
  global: handleActions({
    [SET_IS_MENU_COLLAPSED]: (state, { payload }) => ({
      ...state,
      isMenuCollapsed: payload,
    }),

  }, {
    isMenuCollapsed: false,
  }),
};
