import React from 'react';
import ReactDOM from 'react-dom/server';
import { readMine as readProfile } from 'shared/actions/account';
import { setAuthorization, removeAuthorization } from 'shared/actions/auth';
import AUTHORIZATION from 'relient-admin/constants/authorization';
import { getEntity } from 'relient/selectors';
import { getCurrentAccount } from 'relient-admin/selectors/account';
import getConfig from 'relient/config';
import getPreloader from 'shared/utils/preloader';
import App from 'shared/components/app';
import { flow, reduce, concat, compact } from 'lodash/fp';
import createRouter from 'relient-admin/create-router';
import routes from 'shared/routes';
import createStore from '../create-store';
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import Html from '../html';

const router = createRouter({ routes, baseUrl: getConfig('baseUrl') });

const getChunks = (route) => {
  if (route.parent) {
    return [...(route.chunks || []), ...getChunks(route.parent)];
  }
  return route.chunks || [];
};

export default async (req, res, next) => {
  try {
    const origin = `${req.protocol}://${req.get('host')}`;
    const store = createStore({
      res,
      req,
      origin,
    });

    const { dispatch } = store;
    const authorization = req.cookies[AUTHORIZATION];
    if (authorization) {
      try {
        dispatch(setAuthorization(authorization));
        await dispatch(readProfile());
      } catch (error) {
        dispatch(removeAuthorization());
        res.clearCookie(AUTHORIZATION);
      }
    }

    try {
      const state = store.getState();

      let preloader = [];

      const isLogin = getEntity('auth.isLogin')(state);
      if (isLogin) {
        preloader = [
          ...preloader,
          ...getPreloader(
            getCurrentAccount(state),
            dispatch,
          ),
        ];
      }

      await Promise.all(preloader);
    } catch (error) {
      /* eslint-disable no-console */
      console.log('error ---> ', error);
      /* eslint-enable no-console */
    }

    const domainContext = {
      apiDomain: getConfig('serverAPIDomain'),
      cdnDomain: getConfig('cdnDomain'),
    };

    const route = await router.resolve({
      ...domainContext,
      store,
      pathname: req.path,
      query: req.query,
      origin,
    });

    if (res.headersSent) {
      return;
    }

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const css = new Set(); // CSS for all rendered React components
    // eslint-disable-next-line no-underscore-dangle
    const insertCss = (...styles) => styles.forEach((style) => css.add(style._getCss()));
    const children = ReactDOM.renderToString(
      <App insertCss={insertCss} store={store} domainContext={domainContext}>
        {route.component}
      </App>,
    );
    const { title, description } = route;

    const html = ReactDOM.renderToStaticMarkup(
      <Html
        title={title}
        description={description}
        styles={[{
          id: 'css',
          cssText: [...css].join(''),
        }]}
        scripts={flow(
          getChunks,
          reduce((result, chunk) => result.concat(chunks[chunk]), []),
          concat(chunks.client),
          compact,
        )(route)}
        initialState={JSON.stringify(store.getState())}
      >
        {children}
      </Html>,
    );
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
};
