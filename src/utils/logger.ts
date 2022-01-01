import { RequestHandler, ErrorRequestHandler } from 'express';
import expresswinston from 'express-winston';
import winston from 'winston';
import { loggerOptions, format } from './logger-settings';

export function traceLogger(): RequestHandler {
  return expresswinston.logger(loggerOptions());
}

export function errorLogger(): ErrorRequestHandler {
  return expresswinston.errorLogger(loggerOptions());
}

export const createLogger = (name: string) => {
  const options = loggerOptions();

  const logger = winston.createLogger({
    transports: options.transports,
    format: format,
    defaultMeta: {
      name,
    },
  });

  return logger;
};
