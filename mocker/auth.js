import { current } from './account';

export default (router) => {
  router.post('/api/auth/local', (request, response) => {
    response.status(200).send({
      authorization: 'authorization',
      account: current,
    });
  });

  router.delete('/api/auth/local', (request, response) => {
    response.status(204).send();
  });
};
