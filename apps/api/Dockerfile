# Multi-stage build for optimized Express.js TypeScript application with pnpm

# Stage 1: Base image with pnpm
FROM node:22-alpine AS base
RUN corepack enable pnpm
WORKDIR /app

# Stage 2: Dependencies installation
FROM base AS deps
COPY package.json package.json

# Install dependencies with frozen lockfile for reproducible builds
RUN pnpm install

# Stage 3: Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .
COPY package.json tsconfig.json ./

# Build the application
WORKDIR /app
RUN pnpm run build

# Stage 4: Production image
FROM node:22-alpine AS runner

# Create non-root user for security
RUN addgroup --system --gid 1001 appgroup
RUN adduser --system --uid 1001 --ingroup appgroup appuser

# Set working directory
WORKDIR /app

# Copy package.json and install only production dependencies
COPY package.json ./
RUN npm install --omit=dev --ignore-scripts

# Copy built application from builder stage
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

# Switch to non-root user
USER appuser

# Expose port
ENV PORT=5000
EXPOSE 5000

# # Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/index.js"]
