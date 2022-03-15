import 'dotenv-safe/config';
import connectDB from './config/db';
import app from './services/server';
import { port } from './constants/constants';
import logger from './utils/logger';

const main = async () => {
  try {
    // connetc to DB
    await connectDB();

    // start listening to server
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      logger.info(`Server is listening in port ${port} in ${process.env.NODE_ENV} mode`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    logger.error(`error[main]: ${JSON.stringify(err, null, 3)}`);
    process.exit(1);
  }
};

// init server
main();
