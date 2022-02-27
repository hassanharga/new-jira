import cors from 'cors';
import express from 'express';
// import sanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import i18n from 'i18n';
import morgan from 'morgan';
// @ts-ignore
import xss from 'xss-clean';
import { isDevelopment } from '../constants/constants';
// import { userAuth } from '../middlewares/userAuth';
import routes from '../routes';
import errorHandler from '../utils/errorHandler';

const app = express();

i18n.configure({
  locales: ['en', 'ar'],
  directory: `${__dirname}/../../locales`,
  syncFiles: true,
  objectNotation: true,
  queryParameter: 'lang',
});

// middlewares

// localization
app.use(i18n.init);

// cors
app.use(cors());
app.options('*', cors);
// TODO uncomment this code
// rate limit
// app.use(
//   rateLimit({
//     windowMs: process.env.REQUESTS_MS, // 15 minutes
//     max: process.env.REQUESTS_NUMBERS, // limit each IP to 100 requests per windowMs
//     message: i18n.__('auth.manyRequests'),
//   }),
// );

// helmet
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP parameter pollution attacks
app.use(hpp());

// mongo sanitize
// app.use(sanitize());

// xss attack
app.use(xss());

// log routes
if (isDevelopment) {
  app.use(morgan('dev'));
}

// app.use(userAuth);

// routes
app.use(`${process.env.API_URL}`, routes);

app.use(errorHandler);

export default app;
