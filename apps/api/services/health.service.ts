import db from '@/lib/db';
import { usersModel } from '@/models/users.model';


export class HealthService {

  async healthCheck() {
    try {
      // Execute a simple query to check database connection
      await db.select().from(usersModel).limit(1);
      
      return {
        status: 'success',
        statusCode: 200,
        data: {
          message: 'Service is healthy',
          database: 'connected',
          timestamp: new Date().toISOString()
        },
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        data: {
          message: 'Internal Server Error',
          // @ts-expect-error ignore
          error: error.message as string,
          timestamp: new Date().toISOString()
        },
      }
    }
    
  }
}

export const healthService = new HealthService();
