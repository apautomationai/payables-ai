import { logger } from '@/helpers/logger';
import { 
  BadRequestError, 
  NotFoundError, 
  ValidationError,
  InternalServerError 
} from '@/helpers/errors';
import db from '@/lib/db';
import { usersTable } from '@/models/users.model';

interface HelloResponse {
  message: string;
  timestamp: string;
}

export class HelloService {
  /**
   * Get a greeting message
   * @param name Optional name to include in the greeting
   * @returns A greeting response object
   * @throws {BadRequestError} If the name is invalid
   * @throws {InternalServerError} If there's an unexpected error
   */
  getHelloWorld(name?: string): HelloResponse {
    try {
      // Example of input validation
      if (name && name.length < 2) {
        throw new BadRequestError('Name must be at least 2 characters long', {
          field: 'name',
          value: name,
          minLength: 2
        });
      }

      // Example of a not found scenario
      if (name === 'error') {
        throw new NotFoundError('Requested resource not found', {
          resource: 'greeting',
          name: name
        });
      }

      // Example of a validation error
      if (name === 'admin') {
        throw new ValidationError('Invalid name provided', {
          reason: 'Reserved name',
          suggestion: 'Please use a different name'
        });
      }

      const greeting = name ? `Hello, ${name}!` : 'Hello, World!';
      
      // Log the successful request
      logger.info('Greeting generated successfully');

      return {
        message: greeting,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Log the error with context
      logger.error('Error in getHelloWorld');

      // Re-throw the error to be handled by the global error handler
      if (error instanceof Error) {
        throw error;
      }
      
      // For non-Error objects, wrap in InternalServerError
      throw new InternalServerError('An unexpected error occurred');
    }
  }

  async healthCheck() {
    try {
      // Execute a simple query to check database connection
      await db.select().from(usersTable).limit(1);
      
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

export const helloService = new HelloService();
