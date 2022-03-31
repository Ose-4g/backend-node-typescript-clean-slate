import express, { Request, Response } from 'express';
import errorMiddleWare from './errors/errorHandler';
import morgan from 'morgan';
import router from './routes';
import formatParams from './middleware/formatParams';
import envConfig from './env.config';

const { NODE_ENV } = envConfig;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to Your api',
    documentation: 'Yet to be done',
  });
});

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    message: 'This endpoint does not exist on this server',
  });
});

app.use(errorMiddleWare);

export default app;
