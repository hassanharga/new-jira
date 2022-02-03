import 'dotenv-safe/config';
import connectDB from './config/db';
import app from './services/server';
import { port } from './constants/constants';

const main = async () => {
  try {
    // connetc to DB
    await connectDB();

    // start listening to server
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is listening in port ${port} in ${process.env.NODE_ENV} mode`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('error[main]', err);
    process.exit(1);
  }
};

// init server
main();
