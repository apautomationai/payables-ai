# Backend API Review & Improvement Recommendations

## Executive Summary

This document provides a comprehensive review of the backend API codebase with actionable recommendations for improving code quality, scalability, maintainability, and best practices.

---

## 1. Code Quality Issues

### 1.1 TypeScript Type Safety

**Critical Issue: Excessive use of `@ts-ignore`**

- **Found**: 104 instances of `@ts-ignore` across the codebase
- **Impact**: Defeats the purpose of TypeScript, hides potential bugs, reduces IDE support
- **Location**: Controllers, services, middlewares

**Recommendations:**

1. **Create proper Express type extensions**:
```typescript
// types/express.d.ts
import { User } from '@/models/users.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
  }
}
```

2. **Replace all `@ts-ignore` with proper typing**:
   - Use type guards for user authentication
   - Create request/response DTOs
   - Use proper type assertions where necessary

3. **Enable strict TypeScript settings**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 1.2 Inconsistent Error Handling

**Issues:**
- Controllers mix try-catch with error handler middleware
- Inconsistent error response formats
- Some errors are logged, others are not
- Console.log used instead of logger in some places

**Recommendations:**

1. **Standardize error handling in controllers**:
```typescript
// Remove try-catch from controllers, let errors bubble to error handler
async getInvoice(req: Request, res: Response) {
  const invoiceId = parseInt(req.params.id, 10);
  if (isNaN(invoiceId)) {
    throw new BadRequestError("Invoice ID must be a valid number");
  }
  
  const invoice = await invoiceServices.getInvoice(invoiceId);
  return res.json({ success: true, data: invoice });
}
```

2. **Create consistent response wrapper**:
```typescript
// helpers/response.ts
export const successResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  ...(message && { message })
});

export const errorResponse = (error: BaseError) => ({
  success: false,
  error: {
    code: error.name,
    message: error.message,
    ...(error.details && { details: error.details })
  }
});
```

3. **Replace all console.log with logger**:
   - Use structured logging with context
   - Add request IDs for tracing

### 1.3 Code Duplication

**Issues:**
- Repeated user ID extraction: `//@ts-ignore const userId = req.user.id`
- Duplicate validation logic
- Similar error handling patterns

**Recommendations:**

1. **Create helper for user extraction**:
```typescript
// helpers/request.ts
export const getUserId = (req: Request): number => {
  if (!req.user?.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  return req.user.id;
};
```

2. **Extract common validation patterns**:
```typescript
// validators/common.ts
export const validateId = (id: string | undefined): number => {
  const parsed = parseInt(id || '', 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new BadRequestError('Invalid ID');
  }
  return parsed;
};
```

---

## 2. REST API Patterns & Route Naming

### 2.1 Inconsistent Route Naming

**Current Issues:**

1. **Mixed naming conventions**:
   - `/api/v1/invoice/invoices` (redundant)
   - `/api/v1/invoice/:id` vs `/api/v1/invoice/invoices/:id`
   - `/api/v1/invoice/line-items` vs `/api/v1/invoice/line-items/invoice/:invoiceId`

2. **Non-standard HTTP methods**:
   - Using PATCH for status updates (could be PUT)
   - POST for clone operations (could be PUT with action)

3. **Inconsistent resource nesting**:
   - Some routes use nested resources, others don't

**Recommendations:**

1. **Standardize route structure**:
```
# Current (Inconsistent)
GET    /api/v1/invoice/invoices
GET    /api/v1/invoice/invoices/:id
PATCH  /api/v1/invoice/:id
POST   /api/v1/invoice/invoices/:id/clone

# Recommended (RESTful)
GET    /api/v1/invoices
GET    /api/v1/invoices/:id
PATCH  /api/v1/invoices/:id
POST   /api/v1/invoices/:id/clone  # or PUT /api/v1/invoices/:id?action=clone

# Nested resources
GET    /api/v1/invoices/:id/line-items
POST   /api/v1/invoices/:id/line-items
PATCH  /api/v1/invoices/:invoiceId/line-items/:id
DELETE /api/v1/invoices/:invoiceId/line-items/:id
```

2. **Use proper HTTP status codes**:
   - 201 for creation
   - 204 for successful deletion (no content)
   - 200 for updates with response body
   - 400 for validation errors
   - 404 for not found
   - 403 for forbidden (user authenticated but lacks permission)

3. **Implement HATEOAS for better API discoverability**:
```typescript
{
  "success": true,
  "data": {
    "id": 1,
    "invoiceNumber": "INV-001",
    "_links": {
      "self": "/api/v1/invoices/1",
      "lineItems": "/api/v1/invoices/1/line-items",
      "clone": "/api/v1/invoices/1/clone"
    }
  }
}
```

### 2.2 Route Organization

**Current Structure:**
- Routes are well-organized by feature
- Good separation of concerns

**Improvements:**

1. **Add API versioning strategy**:
   - Consider `/api/v1/` vs `/api/v2/` for breaking changes
   - Document deprecation policy

2. **Group related routes**:
```typescript
// routes/invoices.routes.ts
const router = Router();

// Main invoice routes
router.route('/')
  .get(authenticate, requireSubscriptionAccess, invoiceController.getAllInvoices)
  .post(authenticate, requireSubscriptionAccess, invoiceController.createInvoice);

router.route('/:id')
  .get(authenticate, requireSubscriptionAccess, invoiceController.getInvoice)
  .patch(authenticate, requireSubscriptionAccess, invoiceController.updateInvoice)
  .delete(authenticate, requireSubscriptionAccess, invoiceController.deleteInvoice);

// Nested routes
router.use('/:invoiceId/line-items', lineItemsRoutes);
router.post('/:id/clone', authenticate, requireSubscriptionAccess, invoiceController.cloneInvoice);
router.patch('/:id/status', authenticate, requireSubscriptionAccess, invoiceController.updateInvoiceStatus);
```

3. **Add route documentation**:
   - Use OpenAPI/Swagger for API documentation
   - Add JSDoc comments to route handlers

---

## 3. Database Models & Schema

### 3.1 Schema Issues

**Current Issues:**

1. **Missing indexes**:
   - `invoices.userId` - frequently queried but no index
   - `invoices.attachmentId` - foreign key but no explicit index
   - `lineItems.invoiceId` - foreign key but no explicit index
   - `integrations.userId` - frequently queried but no index

2. **Inconsistent soft delete implementation**:
   - `invoices` has `isDeleted` and `deletedAt`
   - `attachments` has `isDeleted` and `deletedAt`
   - `lineItems` has `isDeleted` and `deletedAt` (in model but not in schema.ts)
   - `users` doesn't have soft delete

3. **Missing foreign key constraints**:
   - `lineItems.invoiceId` - no foreign key constraint in schema
   - `invoices.attachmentId` - no foreign key constraint in schema
   - `integrations.userId` - no foreign key constraint in schema

4. **Enum inconsistencies**:
   - `status` enum defined in schema.ts but `invoiceStatusEnum` in invoice.model.ts
   - Potential for data inconsistency

5. **Missing timestamps**:
   - `lineItems` table missing `createdAt` and `updatedAt`

**Recommendations:**

1. **Add missing indexes**:
```typescript
// drizzle/schema.ts
export const invoices = pgTable("invoices", {
  // ... fields
}, (table) => [
  index("idx_invoices_user_id").on(table.userId),
  index("idx_invoices_attachment_id").on(table.attachmentId),
  index("idx_invoices_status").on(table.status),
  index("idx_invoices_created_at").on(table.createdAt),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "fk_invoices_user_id"
  }),
  foreignKey({
    columns: [table.attachmentId],
    foreignColumns: [attachments.id],
    name: "fk_invoices_attachment_id"
  })
]);

export const lineItems = pgTable("line_items", {
  // ... fields
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_line_items_invoice_id").on(table.invoiceId),
  foreignKey({
    columns: [table.invoiceId],
    foreignColumns: [invoices.id],
    name: "fk_line_items_invoice_id",
    onDelete: "cascade" // Delete line items when invoice is deleted
  })
]);

export const integrations = pgTable("integrations", {
  // ... fields
}, (table) => [
  index("idx_integrations_user_id").on(table.userId),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "fk_integrations_user_id",
    onDelete: "cascade"
  })
]);
```

2. **Standardize soft delete**:
```typescript
// Create a reusable soft delete helper
export const withSoftDelete = <T extends AnyPgTable>(table: T) => {
  return {
    ...table,
    isDeleted: boolean("is_deleted").notNull().default(false),
    deletedAt: timestamp("deleted_at")
  };
};

// Apply to all tables that need it
export const invoices = pgTable("invoices", {
  // ... other fields
  ...withSoftDelete(invoices)
});
```

3. **Consolidate enums**:
```typescript
// drizzle/enums.ts - Single source of truth
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "pending",
  "approved",
  "rejected",
  "failed",
  "not_connected"
]);

export const integrationStatusEnum = pgEnum("integration_status", [
  "pending",
  "approved",
  "rejected",
  "failed",
  "not_connected"
]);

// Use in schema.ts
export const invoices = pgTable("invoices", {
  status: invoiceStatusEnum("status").notNull().default("pending"),
  // ...
});
```

4. **Add database-level constraints**:
```typescript
// Add check constraints for data validation
export const invoices = pgTable("invoices", {
  totalAmount: numeric("total_amount").$type<number>(),
  // Add constraint: totalAmount >= 0
}, (table) => [
  // PostgreSQL check constraint via migration
]);
```

### 3.2 Model Organization

**Current Structure:**
- Models are separated by feature (good)
- Relations are defined separately

**Improvements:**

1. **Add model validation**:
```typescript
// models/invoice.model.ts
import { z } from 'zod';

export const invoiceSchema = z.object({
  userId: z.number().int().positive(),
  attachmentId: z.number().int().positive(),
  invoiceNumber: z.string().max(50).optional(),
  totalAmount: z.number().nonnegative().optional(),
  // ... other fields
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
```

2. **Add model methods for common queries**:
```typescript
// models/invoice.model.ts
export class InvoiceRepository {
  static async findByUserId(userId: number, includeDeleted = false) {
    const query = db.select().from(invoiceModel).where(eq(invoiceModel.userId, userId));
    if (!includeDeleted) {
      query.where(eq(invoiceModel.isDeleted, false));
    }
    return query;
  }
  
  static async findActiveByUserId(userId: number) {
    return db.select()
      .from(invoiceModel)
      .where(
        and(
          eq(invoiceModel.userId, userId),
          eq(invoiceModel.isDeleted, false),
          eq(invoiceModel.status, 'pending')
        )
      );
  }
}
```

3. **Add database migrations for indexes**:
   - Create migration to add missing indexes
   - Add foreign key constraints
   - Add check constraints

---

## 4. Architecture & Scalability

### 4.1 Service Layer Organization

**Current Structure:**
- Services are well-separated by feature
- Good use of dependency injection patterns

**Improvements:**

1. **Create base service class**:
```typescript
// services/base.service.ts
export abstract class BaseService {
  protected db = db;
  
  protected handleError(error: unknown, context: string): never {
    if (error instanceof BaseError) {
      throw error;
    }
    logger.error(`Error in ${context}:`, error);
    throw new InternalServerError(`An error occurred in ${context}`);
  }
  
  protected async withTransaction<T>(
    callback: (tx: Transaction) => Promise<T>
  ): Promise<T> {
    return await this.db.transaction(callback);
  }
}
```

2. **Implement repository pattern**:
```typescript
// repositories/base.repository.ts
export abstract class BaseRepository<T> {
  protected abstract table: AnyPgTable;
  
  async findById(id: number): Promise<T | null> {
    const [result] = await db.select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);
    return result || null;
  }
  
  async create(data: Partial<T>): Promise<T> {
    const [result] = await db.insert(this.table)
      .values(data)
      .returning();
    return result;
  }
  
  // ... other common methods
}
```

3. **Add caching layer**:
```typescript
// services/cache.service.ts
import NodeCache from 'node-cache';

export class CacheService {
  private cache = new NodeCache({ stdTTL: 3600 });
  
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.cache.get<T>(key);
    if (cached) return cached;
    
    const data = await fetcher();
    this.cache.set(key, data, ttl);
    return data;
  }
  
  invalidate(pattern: string) {
    const keys = this.cache.keys().filter(k => k.includes(pattern));
    this.cache.del(keys);
  }
}
```

### 4.2 Scalability Improvements

**Recommendations:**

1. **Add request rate limiting**:
```typescript
// middlewares/rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit auth endpoints
  skipSuccessfulRequests: true
});
```

2. **Implement database connection pooling**:
```typescript
// lib/db.ts - Already using Pool, but add configuration
export const pool = new Pool({
  connectionString: config.database.url,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

3. **Add query optimization**:
   - Use select only needed fields
   - Implement pagination for all list endpoints
   - Add database query logging in development

4. **Implement background job processing**:
```typescript
// services/job.service.ts
import Bull from 'bull';

export class JobService {
  private invoiceQueue = new Bull('invoice-processing', {
    redis: { host: 'localhost', port: 6379 }
  });
  
  async processInvoice(attachmentId: number) {
    await this.invoiceQueue.add('process', { attachmentId });
  }
}
```

### 4.3 API Response Standardization

**Current Issues:**
- Inconsistent response formats
- Some endpoints return different structures

**Recommendations:**

1. **Create response DTOs**:
```typescript
// dtos/response.dto.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}
```

2. **Use response interceptors**:
```typescript
// middlewares/response.middleware.ts
export const responseInterceptor = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  res.json = function(data: any) {
    if (data.success === undefined) {
      data = { success: true, data };
    }
    data.timestamp = new Date().toISOString();
    return originalJson.call(this, data);
  };
  next();
};
```

---

## 5. Security Improvements

### 5.1 Authentication & Authorization

**Current Issues:**
- JWT secret should be rotated
- No refresh token mechanism
- Cookie security settings commented out

**Recommendations:**

1. **Enable secure cookies in production**:
```typescript
// controllers/auth.controller.ts
res.cookie("token", token, {
  httpOnly: true, // Enable in production
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict", // Change from "none" to "strict" if possible
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
});
```

2. **Implement refresh tokens**:
```typescript
// services/auth.service.ts
export class AuthService {
  async generateTokens(userId: number) {
    const accessToken = signJwt({ sub: userId }, { expiresIn: '15m' });
    const refreshToken = signJwt({ sub: userId, type: 'refresh' }, { expiresIn: '7d' });
    
    // Store refresh token in database
    await this.storeRefreshToken(userId, refreshToken);
    
    return { accessToken, refreshToken };
  }
}
```

3. **Add role-based access control (RBAC)**:
```typescript
// middlewares/rbac.middleware.ts
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  };
};
```

### 5.2 Input Validation

**Current Issues:**
- Limited validation (only users have Zod validators)
- No input sanitization
- Missing validation for query parameters

**Recommendations:**

1. **Add comprehensive validation**:
```typescript
// validators/invoice.validator.ts
export const createInvoiceValidator = z.object({
  body: z.object({
    attachmentId: z.number().int().positive(),
    invoiceNumber: z.string().max(50).optional(),
    totalAmount: z.number().nonnegative().optional(),
    currency: z.string().length(3).optional(),
    // ... other fields
  })
});

export const updateInvoiceValidator = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number)
  }),
  body: z.object({
    // ... update fields
  }).partial()
});
```

2. **Add query parameter validation**:
```typescript
// validators/query.validator.ts
export const paginationValidator = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  })
});
```

3. **Add input sanitization**:
```typescript
// middlewares/sanitize.middleware.ts
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

function sanitizeObject(obj: any): any {
  // Recursively sanitize strings
  // ...
}
```

### 5.3 Security Headers

**Recommendations:**

1. **Add security middleware**:
```typescript
// middlewares/security.middleware.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
```

2. **Add CORS configuration**:
```typescript
// Already implemented, but ensure it's secure
const corsOptions = {
  origin: getCorsOrigins(),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

---

## 6. Performance Optimizations

### 6.1 Database Query Optimization

**Recommendations:**

1. **Use select only needed fields**:
```typescript
// Instead of:
const invoices = await db.select().from(invoiceModel);

// Use:
const invoices = await db
  .select({
    id: invoiceModel.id,
    invoiceNumber: invoiceModel.invoiceNumber,
    totalAmount: invoiceModel.totalAmount,
    // ... only needed fields
  })
  .from(invoiceModel);
```

2. **Implement eager loading for relations**:
```typescript
// Use Drizzle's relational queries
const invoices = await db.query.invoiceModel.findMany({
  where: eq(invoiceModel.userId, userId),
  with: {
    lineItems: true,
    attachment: true,
  },
});
```

3. **Add database query logging**:
```typescript
// lib/db.ts
if (config.env === 'development') {
  pool.on('query', (query) => {
    logger.debug('Database query:', {
      text: query.text,
      values: query.values,
    });
  });
}
```

### 6.2 Caching Strategy

**Recommendations:**

1. **Cache frequently accessed data**:
   - User profiles
   - Subscription status
   - Integration status
   - QuickBooks accounts/products

2. **Implement cache invalidation**:
```typescript
// Invalidate cache on updates
async updateInvoice(id: number, data: Partial<Invoice>) {
  await invoiceServices.updateInvoice(id, data);
  cacheService.invalidate(`invoice:${id}`);
  cacheService.invalidate(`invoices:user:${data.userId}`);
}
```

### 6.3 API Response Optimization

**Recommendations:**

1. **Add compression**:
```typescript
import compression from 'compression';
app.use(compression());
```

2. **Implement field selection**:
```typescript
// Allow clients to specify fields they need
GET /api/v1/invoices?fields=id,invoiceNumber,totalAmount
```

---

## 7. Testing & Documentation

### 7.1 Testing

**Current State:**
- No visible test files

**Recommendations:**

1. **Add unit tests**:
```typescript
// __tests__/services/invoice.service.test.ts
import { describe, it, expect } from '@jest/globals';
import { InvoiceServices } from '@/services/invoice.services';

describe('InvoiceServices', () => {
  it('should create invoice with line items', async () => {
    // Test implementation
  });
});
```

2. **Add integration tests**:
```typescript
// __tests__/routes/invoice.routes.test.ts
import request from 'supertest';
import app from '@/app';

describe('Invoice Routes', () => {
  it('should get all invoices', async () => {
    const response = await request(app)
      .get('/api/v1/invoices')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
```

3. **Add E2E tests for critical flows**

### 7.2 Documentation

**Recommendations:**

1. **Add API documentation with Swagger/OpenAPI**:
```typescript
// Use swagger-jsdoc and swagger-ui-express
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sledge API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

2. **Add JSDoc comments**:
```typescript
/**
 * Get all invoices for the authenticated user
 * @route GET /api/v1/invoices
 * @access Private
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @returns {Promise<ApiResponse<Invoice[]>>}
 */
async getAllInvoices(req: Request, res: Response) {
  // ...
}
```

---

## 8. Monitoring & Observability

### 8.1 Logging

**Current State:**
- Using Pino logger (good)
- Some console.log still present

**Recommendations:**

1. **Standardize logging**:
```typescript
// helpers/logger.ts - Enhance existing logger
export const logger = pino({
  level: config.logLevel,
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});
```

2. **Add request ID tracking**:
```typescript
// middlewares/request-id.middleware.ts
import { v4 as uuidv4 } from 'uuid';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};
```

### 8.2 Error Tracking

**Recommendations:**

1. **Integrate error tracking service** (Sentry, Rollbar, etc.):
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// In error handler
if (config.env === 'production') {
  Sentry.captureException(err);
}
```

2. **Add health check endpoints**:
```typescript
// Already exists, but enhance it
router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: await checkDatabase(),
    redis: await checkRedis(),
  };
  res.json(health);
});
```

---

## 9. Code Organization Improvements

### 9.1 Directory Structure

**Recommended Structure:**
```
apps/api/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── repositories/    # Data access layer
│   ├── models/          # Database models
│   ├── routes/          # Route definitions
│   ├── middlewares/     # Express middlewares
│   ├── validators/      # Input validation
│   ├── dtos/            # Data transfer objects
│   ├── types/           # TypeScript types
│   ├── helpers/         # Utility functions
│   ├── lib/             # Core libraries
│   └── __tests__/       # Test files
├── drizzle/             # Database migrations
└── scripts/             # Utility scripts
```

### 9.2 Dependency Injection

**Recommendations:**

1. **Use dependency injection container**:
```typescript
// lib/container.ts
import { Container } from 'inversify';

const container = new Container();

container.bind<InvoiceServices>(TYPES.InvoiceServices).to(InvoiceServices);
container.bind<UserServices>(TYPES.UserServices).to(UserServices);

export { container };
```

---

## 10. Priority Action Items

### High Priority (Do First)
1. ✅ Fix TypeScript type safety (remove @ts-ignore)
2. ✅ Add missing database indexes
3. ✅ Standardize error handling
4. ✅ Fix route naming inconsistencies
5. ✅ Add input validation for all endpoints
6. ✅ Enable secure cookies in production

### Medium Priority (Do Next)
1. ✅ Implement repository pattern
2. ✅ Add comprehensive logging
3. ✅ Add API documentation
4. ✅ Implement caching layer
5. ✅ Add rate limiting
6. ✅ Standardize API responses

### Low Priority (Nice to Have)
1. ✅ Add unit and integration tests
2. ✅ Implement refresh tokens
3. ✅ Add request ID tracking
4. ✅ Implement field selection for responses
5. ✅ Add HATEOAS links

---

## Conclusion

This codebase has a solid foundation with good separation of concerns and feature organization. The main areas for improvement are:

1. **Type Safety**: Remove @ts-ignore and add proper TypeScript types
2. **Consistency**: Standardize routes, responses, and error handling
3. **Database**: Add indexes, foreign keys, and constraints
4. **Security**: Improve authentication, validation, and security headers
5. **Scalability**: Add caching, rate limiting, and optimization
6. **Observability**: Enhance logging and add monitoring

Implementing these improvements will significantly enhance code quality, maintainability, and scalability.

