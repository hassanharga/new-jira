import mongoose from 'mongoose';
import { isDevelopment } from '../constants/constants';

export default async () => {
  // enable debug mode if not in production
  if (isDevelopment) {
    mongoose.set('debug', true);
  }

  // connect to DB
  const conn = await mongoose.connect(`${process.env.DB_URL}`);
  // eslint-disable-next-line no-console
  console.log(`DB is connecting to ${conn.connection.host} ${conn.connection.name} DB`);
};
