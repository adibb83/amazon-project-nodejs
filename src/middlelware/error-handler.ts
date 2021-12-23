import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/httpException';

export function logError(err: HttpException, req: Request, res: Response, next: NextFunction): void {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).send({
    message,
    status,
  });
  console.error(err.stack);
  next(err);
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500);
  res.render('error', { error: err });
}
