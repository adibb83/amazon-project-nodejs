import { Request, Response, NextFunction } from 'express';

function logError(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (req.xhr) {
    res.status(500).send({ error: 'Server Error' });
  } else {
    next(err);
  }
  next(err);
}

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500);
  res.render('error', { error: err });
}
