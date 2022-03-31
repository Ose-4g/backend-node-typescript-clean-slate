import { Request, Response, NextFunction } from 'express';
import { deleteMultipleFiles, deleteSingleFile } from '../utils/aws';
import logger from '../utils/logger';
import AppError from './AppError';

const { NODE_ENV, TEST_TYPE } = process.env;
const DEVELOPMENT = 'development';

const errorMiddleWare = async (error: AppError, req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body: any = {};
  body.status = 'error';
  body.message = error.message;

  if (NODE_ENV === DEVELOPMENT) {
    body.error = error.stack;
  }

  // if status code is not set, set it to 500
  if (!error.statusCode) {
    error.statusCode = 500;
  }

  if (NODE_ENV !== DEVELOPMENT && error.statusCode >= 500) {
    error.message = 'Something went very wrong';
  }
  if (NODE_ENV === 'test' && TEST_TYPE === 'unit') {
  } else if (req.file) deleteSingleFile((req.file as Express.MulterS3.File).key);
  else if (req.files) {
    const filepaths = [];
    //flatten all file objects to be in a single array
    const files = [].concat(...Object.values(req.files));

    if (files.length) {
      for (const file of files) {
        filepaths.push({ Key: (file as Express.MulterS3.File).key });
      }
      deleteMultipleFiles(filepaths);
    }
  }
  logger.error(error.message);
  res.status(error.statusCode).json(body);
  return;
};

export default errorMiddleWare;
