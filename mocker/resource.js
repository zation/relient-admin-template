import { image, system } from 'faker';

export default (router) => {
  router.post('/api/resource', (request, response) => {
    response.status(200).send({
      url: image.image(),
      fileName: system.fileName(),
    });
  });
};
