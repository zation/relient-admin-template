import {
  createStore,
  applyMiddleware,
} from 'redux';
import { serverError } from 'relient/middlewares';
import reducers from 'shared/reducers';
import AUTHORIZATION from 'relient-admin/constants/authorization';
import fetchMiddleware from 'shared/middlewares/fetch';
import type { Request } from 'express';
import { getWithBaseUrl } from 'relient/url';
import getConfig from 'relient/config';
import logger from './redux-logger';

export default ({
  res,
  initialState = {},
}: { res: Request, initialState: any }) => createStore<any, { type: string, payload: any, meta: any, error: boolean }, any, any>(
  reducers,
  initialState,
  applyMiddleware(
    fetchMiddleware({ apiDomain: getConfig('serverAPIDomain') }),
    serverError({
      onUnauthorized: () => {
        res.clearCookie(AUTHORIZATION);
        res.redirect(302, getWithBaseUrl('/auth/login', getConfig('baseUrl')));
      },
    }),
    logger,
  ),
);
