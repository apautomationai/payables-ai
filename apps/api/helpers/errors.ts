import { config } from "@/lib/config";

interface ErrorDetails {
  [key: string]: any;
}

export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: ErrorDetails;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: ErrorDetails
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
    
    // Capture stack trace (excluding constructor call)
    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      ...(this.details && { details: this.details }),
      ...(config.env === 'development' && { stack: this.stack })
    };
  }
}

// 400 Bad Request - The server cannot process the request due to client error
export class BadRequestError extends BaseError {
  constructor(message: string = 'Bad Request', details?: ErrorDetails) {
    super(message, 400, true, details);
  }
}

// 401 Unauthorized - Authentication is required
export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Unauthorized', details?: ErrorDetails) {
    super(message, 401, true, details);
  }
}

// 403 Forbidden - The client does not have permission to access the resource
export class ForbiddenError extends BaseError {
  constructor(message: string = 'Forbidden', details?: ErrorDetails) {
    super(message, 403, true, details);
  }
}

// 404 Not Found - The requested resource could not be found
export class NotFoundError extends BaseError {
  constructor(message: string = 'Not Found', details?: ErrorDetails) {
    super(message, 404, true, details);
  }
}

// 409 Conflict - Request conflicts with current state of the server
export class ConflictError extends BaseError {
  constructor(message: string = 'Conflict', details?: ErrorDetails) {
    super(message, 409, true, details);
  }
}

// 422 Unprocessable Entity - The request was well-formed but unable to be followed
export class ValidationError extends BaseError {
  constructor(message: string = 'Validation Error', details?: ErrorDetails) {
    super(message, 422, true, details);
  }
}

// 500 Internal Server Error - A generic server error
export class InternalServerError extends BaseError {
  constructor(message: string = 'Internal Server Error', details?: ErrorDetails) {
    super(message, 500, false, details);
  }
}

// 501 Not Implemented - The server does not support the functionality required
export class NotImplementedError extends BaseError {
  constructor(message: string = 'Not Implemented', details?: ErrorDetails) {
    super(message, 501, true, details);
  }
}

// 503 Service Unavailable - The server is not ready to handle the request
export class ServiceUnavailableError extends BaseError {
  constructor(message: string = 'Service Unavailable', details?: ErrorDetails) {
    super(message, 503, false, details);
  }
}
