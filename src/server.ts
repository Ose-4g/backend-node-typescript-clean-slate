import http from 'http';
import app from './app';
import dotenv from 'dotenv';
import logger from './utils/logger';
import connectToDB from './db/connect';

dotenv.config();

import envConfig from './env.config';

const { PORT } = envConfig;

const startServer = async () => {
  //do not connect to mongodb in unit testing mode.
  if (!(process.env.NODE_ENV === 'test' && process.env.TEST_TYPE === 'unit')) await connectToDB();
  app.listen(PORT || 6000, () => {
    if (process.env.NODE_ENV !== 'test') {
      logger.info(`
                ################################################
                🛡️  Server listening on port: ${PORT} 🛡️
                ################################################
                SERVER IN ${process.env.NODE_ENV as string} MODE
              `);
    }
  });
};

startServer();

export default app;
