import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import winston from 'winston';

export function log(req: Request, res: Response, next: NextFunction) {
  const url = req.url;

  logger(`[REQ RECEIVED]${url}`);

  res.on('finish', () => logger(`[REQ ENDED]${url}`));
  res.on('close', () => logger(`[REQ ENDED]${url}`));

  next();
}

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.prettyPrint(),
);

export const loggerOptions = () => ({
  transports: [new winston.transports.Console()],
  format,
});
