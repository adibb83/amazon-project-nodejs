import { Request, Response, NextFunction } from 'express';

export function AuthBailOut(req: Request, res: Response, next: NextFunction) {
  if (!req.headers['x-auth']) return next('router');
  next();
}
