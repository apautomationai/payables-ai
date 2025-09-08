import { Request, Response, NextFunction } from 'express';
import { helloService } from '../services/hello.service';
import { logger } from '../helpers/logger';

export class HelloController {
  /**
   * Get a hello world message
   * @route GET /hello
   * @param req Express request object
   * @param res Express response object
   * @param next Next function for error handling
   */
  getHelloWorld = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query;
      const result = helloService.getHelloWorld(name as string | undefined);
      
      logger.info('Successfully processed hello request');
      
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Pass the error to the global error handler
      next(error);
    }
  };
}

export const helloController = new HelloController();
