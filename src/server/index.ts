import path from 'path';
import express, {
  NextFunction,
  Request,
  Response,
} from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import getConfig from 'relient/config';
import handleError from './middlewares/handle-error';
import render from './middlewares/render';
import logger from './logger';

const app = express();

declare module 'express' {
  interface Express {
    hot: any
  }
}

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
// @ts-ignore
global.navigator = global.navigator || {};
// @ts-ignore
global.navigator.userAgent = global.navigator.userAgent || 'all';

if (__DEV__) {
  app.use(morgan('tiny'));
  app.enable('trust proxy');
}

app.use(getConfig('baseUrl'), express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('*', (req, res, next) => render(req, res, next));
app.use((err: any, req: Request, res: Response, next: NextFunction) => handleError(err, req, res, next));

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(getConfig('port'), () => {
    logger.info(`The server is running at http://localhost:${getConfig('port')}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  module.hot.accept('./middlewares/render');
  module.hot.accept('./middlewares/handle-error');
}

export default app;
