import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from './errors';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(
    `The requested resource ${req.originalUrl} was not found`,
    {
      method: req.method,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  ));
}
