import mongoose, { ConnectOptions } from 'mongoose';
import logger from '../utils/logger';
import env from '../env.config';

const { MONGO_URL } = env;

//Connection to mongoDb Database
const connectToDB = async (): Promise<void> => {
  try {
    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
      logger.info('Database connected successfully!');
    });
  } catch (err) {
    console.error(err);
  }
};

export default connectToDB;
