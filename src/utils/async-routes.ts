import { Request, Response, NextFunction } from 'express';

type RouteHandler<T = void> = (req?: Request, res?: Response, next?: NextFunction) => T;

export function wrapAsyncAndSend(fn: RouteHandler<Promise<any>>): RouteHandler {
  const handler: RouteHandler = (req, res, next) => {
    fn(req, res, next)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .then((result) => res!.send(result))
      .catch(next);
  };

  return handler;
}
