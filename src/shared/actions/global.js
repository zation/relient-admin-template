import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';

const actionType = actionTypeCreator('actions/account');

export const SET_IS_MENU_COLLAPSED = actionType('SET_IS_MENU_COLLAPSED');

export const setIsMenuCollapsed = createAction(SET_IS_MENU_COLLAPSED);
