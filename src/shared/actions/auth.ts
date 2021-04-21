import { actionTypeCreator, createAction, post } from 'relient/actions';

const actionType = actionTypeCreator('actions/auth');

export const LOGIN = actionType('LOGIN');
export const LOGOUT = actionType('LOGOUT');
export const SET_AUTHORIZATION = actionType('SET_AUTHORIZATION');
export const REMOVE_AUTHORIZATION = actionType('REMOVE_AUTHORIZATION');

export interface LoginRequest {
  username: string
  password: string
  captcha: string
  shouldRemember: boolean
}

export const login = createAction<LoginRequest, any, { ignoreAuthRedirection: boolean, shouldRemember: boolean }>(
  LOGIN,
  ({ username, password, captcha }) => post(
    '/auth/local',
    { username, password, captcha },
    { headers: { 'x-auth-username': username, 'x-auth-password': password } },
  ),
  ({ shouldRemember }) => ({ ignoreAuthRedirection: true, shouldRemember }),
);

export const logout = createAction(LOGOUT);

export const setAuthorization = createAction<string>(SET_AUTHORIZATION);

export const removeAuthorization = createAction<string>(REMOVE_AUTHORIZATION);
