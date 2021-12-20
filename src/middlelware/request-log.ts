import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function log(req: Request, res: Response, next: NextFunction) {
  const url = req.url;

  logger(`[REQ RECEIVED]${url}`);

  res.on('finish', () => logger(`[REQ ENDED]${url}`));
  res.on('close', () => logger(`[REQ ENDED]${url}`));

  next();
}
