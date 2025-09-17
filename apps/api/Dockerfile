# Use Node.js official image
FROM node:20

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app


# Copy only package files first
COPY package.json pnpm-lock.yaml* ./

# Install dependencies inside container
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose API port
EXPOSE 4000

# Start the API
CMD ["pnpm", "run", "dev"]  # or ["pnpm", "start"]
