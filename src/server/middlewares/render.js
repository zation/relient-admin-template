import React from 'react';
import ReactDOM from 'react-dom/server';
import { readMine as readProfile } from 'shared/actions/account';
import { readAll as readAllPermission } from 'shared/actions/permission';
import { setAuthorization, removeAuthorization } from 'shared/actions/auth';
import { readAll as readAllRole } from 'shared/actions/role';
import { AUTHORIZATION } from 'shared/constants/cookies';
import { getEntity } from 'relient/selectors';
import router from 'shared/router';
import { getCurrentAccount } from 'shared/selectors/account';
import getConfig from 'relient/config';
import getPreloader from 'shared/utils/preloader';
import App from 'shared/components/app';
import { flow, reduce, concat } from 'lodash/fp';
import createStore from '../create-store';
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import Html from '../html';

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

      let preloader = [
        dispatch(readAllRole()),
        dispatch(readAllPermission()),
      ];

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
