import { actionTypeCreator, createAction, post } from 'relient/actions';

const actionType = actionTypeCreator('actions/auth');

export const LOGIN = actionType('LOGIN');
export const LOGOUT = actionType('LOGOUT');
export const SET_AUTHORIZATION = actionType('SET_AUTHORIZATION');
export const REMOVE_AUTHORIZATION = actionType('REMOVE_AUTHORIZATION');

export const login = createAction(
  LOGIN,
  ({ username, password, captcha }) => post(
    '/auth/local',
    { username, password, captcha },
    { headers: { 'x-auth-username': username, 'x-auth-password': password } },
  ),
  ({ shouldRemember }) => ({ ignoreAuthRedirection: true, shouldRemember }),
);

export const logout = createAction(LOGOUT);

export const setAuthorization = createAction(SET_AUTHORIZATION);

export const removeAuthorization = createAction(REMOVE_AUTHORIZATION);
