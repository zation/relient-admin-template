import { createStore, applyMiddleware, compose } from 'redux';
import {
  history as historyMiddleware,
  serverError,
} from 'relient/middlewares';
import reducers from 'shared/reducers';
import fetch from 'isomorphic-fetch/fetch-npm-browserify';
import fetchMiddleware from 'shared/middlewares/fetch';
import { Message } from 'antd';
import { prop, flow, first } from 'lodash/fp';
import pushMiddleware from 'relient-admin/middlewares/push';
import authorization from './middlewares/cookie';
import history from './history';

const { __REDUX_DEVTOOLS_EXTENSION__, __INITIAL_STATE__ = {} } = global;

const middlewares = [
  fetchMiddleware({ fetch, apiDomain: `${global.location.origin}/api` }),
  authorization,
  pushMiddleware,
  historyMiddleware(history),
  serverError({
    onUnauthorized: () => {
      Message.error('权限错误，请重新登陆适当账号', 5);
    },
    onGlobalWarning: async ({ payload }) => {
      if (payload instanceof Array) {
        Message.error(flow(first, prop('message'))(payload), 5);
      } else {
        Message.error(prop('message')(payload) || prop('error')(payload), 5);
      }
    },
  }),
];
let enhancer = applyMiddleware(...middlewares);

if (__DEV__) {
  // eslint-disable-next-line global-require
  middlewares.push(require('redux-logger').createLogger({ collapsed: true }));
  if (__REDUX_DEVTOOLS_EXTENSION__) {
    enhancer = compose(
      applyMiddleware(...middlewares),
      __REDUX_DEVTOOLS_EXTENSION__(),
    );
  }
}

export default createStore(
  reducers,
  __INITIAL_STATE__,
  enhancer,
);
