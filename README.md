# Payables Monorepo

This is a monorepo containing the applications for the Payables AI platform, built with Next.js and TypeScript.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22
- pnpm >= 10.4.1
- PostgreSQL >= 17

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd payables-ai
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## 📦 Available Applications

### 1. Main Application (`apps/main`)
The core application for managing payables and invoices.

### 2. Landing Page (`apps/landing`)
Marketing website and public-facing pages.

### 3. API (`apps/api`)
Backend API services and endpoints.

## 🛠 Development

### Start the development server

To start all applications in development mode:
```bash
pnpm dev
```

To start a specific application:
```bash
cd apps/<app-name>
pnpm dev
```

### Building for Production

To build all applications:
```bash
pnpm build
```

To build a specific application:
```bash
cd apps/<app-name>
pnpm build
```

## 🔨 Adding shadcn/ui Components

To add components to your app, run the following command at the root of your app:

```bash
pnpm dlx shadcn@latest add button -c packages/ui
```

### Using shadcn/ui Components

Import components from the `ui` package:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## 🧹 Linting and Formatting

```bash
# Lint all applications
pnpm lint

```

## 🤝 Contributing

1. Create a new branch for your feature
2. Commit your changes
3. Push to the branch
4. Open a pull request

