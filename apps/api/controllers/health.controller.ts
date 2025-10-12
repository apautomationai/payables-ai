import { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service';

export class HealthController {

  helthCheck = async (_req: Request, res: Response, _: NextFunction) => {
    try {
      const result = await healthService.healthCheck();
      res.status(result.statusCode).json(result);
    } catch (error) {
      throw error;
    }
  }
}

export const healthController = new HealthController();
