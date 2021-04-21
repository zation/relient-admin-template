import { getEntity } from 'relient/selectors';
import fetch from 'isomorphic-fetch';
import { fetch as fetchMiddleware } from 'relient/middlewares';

export default ({ apiDomain }: { apiDomain: string }) => fetchMiddleware({
  fetch,
  apiDomain,
  getDefaultHeader: ({ getState, withoutAuth }) => {
    const state = getState();
    return {
      ...(withoutAuth ? {} : {
        'x-auth-token': getEntity('auth.authorization')(state),
      }),
    };
  },
});
