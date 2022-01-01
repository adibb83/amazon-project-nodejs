import winston from 'winston';

export const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.prettyPrint(),
);

export const loggerOptions = () => ({
  transports: [new winston.transports.Console()],
  format,
});
