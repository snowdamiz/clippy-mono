# Clippy Monorepo Structure

## 📁 Directory Overview

```
clippy-mono/
├── apps/                      # Application packages
│   ├── chrome-extension/     # Chrome Extension (Vue 3)
│   │   ├── src/
│   │   │   ├── background/  # Service worker scripts
│   │   │   ├── content/     # Content scripts
│   │   │   ├── popup/       # Popup UI components
│   │   │   ├── options/     # Options page
│   │   │   ├── components/  # Shared Vue components
│   │   │   ├── stores/      # Pinia stores
│   │   │   ├── utils/       # Utility functions
│   │   │   ├── workers/     # Web Workers
│   │   │   └── lib/         # Extension-specific libraries
│   │   ├── public/          # Static assets
│   │   └── dist/            # Build output
│   │
│   ├── clippy/              # Phoenix/Elixir Application
│   │   ├── lib/
│   │   │   ├── clippy/      # Business logic
│   │   │   │   ├── pipeline/    # GenStage processors
│   │   │   │   │   ├── chunk_receiver.ex
│   │   │   │   │   ├── video_processor.ex
│   │   │   │   │   ├── transcriber.ex
│   │   │   │   │   ├── ai_analyzer.ex
│   │   │   │   │   └── clip_generator.ex
│   │   │   │   ├── workers/     # Task processors
│   │   │   │   │   ├── video_worker.ex
│   │   │   │   │   ├── transcription_worker.ex
│   │   │   │   │   └── export_worker.ex
│   │   │   │   ├── storage/     # Storage adapters
│   │   │   │   │   ├── ets_cache.ex
│   │   │   │   │   ├── r2_storage.ex
│   │   │   │   │   └── postgres.ex
│   │   │   │   ├── ai/          # AI integrations
│   │   │   │   │   ├── groq_client.ex
│   │   │   │   │   ├── openai_client.ex
│   │   │   │   │   └── whisper.ex
│   │   │   │   └── application.ex
│   │   │   └── clippy_web/   # Phoenix web layer
│   │   │       ├── channels/    # WebSocket handlers
│   │   │       │   ├── recording_channel.ex
│   │   │       │   └── user_socket.ex
│   │   │       ├── controllers/ # REST API
│   │   │       │   ├── auth_controller.ex
│   │   │       │   ├── clip_controller.ex
│   │   │       │   └── export_controller.ex
│   │   │       ├── live/        # LiveView UI
│   │   │       │   ├── dashboard_live.ex
│   │   │       │   └── monitoring_live.ex
│   │   │       └── endpoint.ex
│   │   ├── config/           # Environment configs
│   │   │   ├── config.exs
│   │   │   ├── dev.exs
│   │   │   ├── prod.exs
│   │   │   └── runtime.exs
│   │   ├── priv/             # Static files & migrations
│   │   │   ├── repo/
│   │   │   │   └── migrations/
│   │   │   └── static/
│   │   └── mix.exs           # Project definition
│   │
│   └── website/             # Marketing Website (Next.js 14)
│       ├── app/             # App Router pages
│       ├── components/      # React components
│       ├── lib/             # Utilities and helpers
│       ├── public/          # Static assets
│       └── styles/          # CSS and Tailwind styles
│
├── packages/                 # Shared JavaScript packages
│   ├── shared/              # Shared types and utilities
│   │   └── src/
│   │       ├── types/       # TypeScript type definitions
│   │       ├── utils/       # Shared utilities
│   │       └── constants/   # Shared constants
│   │
│   └── wasm/                # WebAssembly modules
│       ├── src/             # WASM wrapper code
│       └── lib/             # Compiled WASM files
│
├── docs/                     # Documentation
├── tests/                    # Test suites
│   ├── unit/                # Unit tests
│   └── e2e/                 # End-to-end tests
│
├── infrastructure/           # Infrastructure configuration
│   ├── docker/              # Docker configurations
│   │   ├── Dockerfile       # Phoenix app container for Fly.io
│   │   └── docker-compose.yml  # Local development only
│   ├── fly/                 # Fly.io deployment configs
│   │   ├── fly.toml         # Main Fly.io configuration
│   │   ├── fly.staging.toml # Staging environment config
│   │   └── .dockerignore    # Docker build exclusions
│   └── deployment/          # Deployment scripts
│       ├── deploy.sh        # Fly.io deployment script
│       ├── migrate.sh       # Database migration script
│       └── rollback.sh      # Rollback script
│
├── scripts/                  # Build and utility scripts
├── config/                   # Configuration files
└── .github/                  # GitHub Actions workflows
    └── workflows/
```

## 🏗️ Architecture Overview

### Apps

#### Chrome Extension (`apps/chrome-extension`)
- **Framework**: Vue 3 + Vite + TypeScript
- **State Management**: Pinia
- **Styling**: TailwindCSS
- **Components**:
  - Background Service Worker: Handles recording orchestration
  - Content Scripts: Injected into web pages for video capture
  - Popup UI: Main user interface
  - Options Page: Settings and configuration
  - WebSocket client for Phoenix Channels

#### Phoenix Application (`apps/clippy`)
- **Framework**: Phoenix 1.7+ with Elixir
- **Real-Time**: Phoenix Channels for WebSocket
- **Processing**: GenStage for stream processing
- **Features**:
  - WebSocket handling for video chunks
  - GenStage pipeline for parallel processing
  - Task.Supervisor for dynamic workers
  - ETS for in-memory caching
  - LiveView for admin dashboard
  - Ecto for database interactions
  - Built-in process supervision

#### Marketing Website (`apps/website`)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Framer Motion
- **Deployment**: Vercel
- **Features**:
  - Landing page with hero, features, pricing
  - Interactive product demo
  - Conversion-optimized CTAs
  - SEO and performance optimized
  - Analytics integration

### Packages

#### Shared (`packages/shared`)
- TypeScript type definitions
- Shared constants and configuration
- Utility functions used across JavaScript apps
- WebSocket message types

#### WASM (`packages/wasm`)
- FFmpeg.wasm for video processing
- Whisper.cpp for transcription
- WebCodecs wrappers
- Worker implementations

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Elixir 1.15+
- Erlang/OTP 26+
- PostgreSQL 14+ (for local development)
- FFmpeg 6.0+ (for video processing)
- Fly.io CLI (for deployment)

### Installation
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up local PostgreSQL database
cd apps/clippy
mix ecto.create
mix ecto.migrate

# Or connect to Fly.io PostgreSQL for staging
fly postgres connect -a clippy-db

# Build packages
npm run build
```

### Development
```bash
# Start all services in development mode
npm run dev

# Or run specific apps
npm run extension:dev  # Chrome Extension
npm run website:dev   # Marketing Website
mix phx.server        # Phoenix API (from apps/clippy)
```

### Building
```bash
# Build all packages
npm run build

# Build specific app
npm run extension:build

# Build for production deployment
cd apps/clippy
mix deps.get --only prod
mix compile
mix assets.deploy
mix release
```

### Deployment to Fly.io
```bash
# Deploy Phoenix app to Fly.io
cd apps/clippy
fly deploy

# Deploy to staging
fly deploy --config fly.staging.toml

# Run database migrations on production
fly ssh console -a clippy-app
/app/bin/clippy eval "Clippy.Release.migrate"

# Scale horizontally
fly scale count 3 --app clippy-app

# Monitor deployment
fly logs --app clippy-app
fly status --app clippy-app
```

## 📦 Package Dependencies

### Workspace Structure
All packages use npm workspaces for dependency management:
- `@clippy/extension` - Chrome Extension app
- `@clippy/website` - Marketing website
- `@clippy/shared` - Shared utilities and types
- `@clippy/wasm` - WebAssembly modules

### Import Aliases
TypeScript path aliases are configured for clean imports:
```typescript
import { User, Clip } from '@clippy/shared/types'
import { processVideo } from '@clippy/wasm'
import { detectHighlights } from '@clippy/ai'
```

## 🔧 Configuration Files

- `turbo.json` - Turborepo pipeline configuration
- `tsconfig.json` - Root TypeScript configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Code formatting rules
- `manifest.json` - Chrome Extension manifest
- `mix.exs` - Phoenix application configuration

## 🧪 Testing Strategy

- **Unit Tests**: Vitest for all packages
- **E2E Tests**: Playwright for extension testing
- **Integration Tests**: API endpoint testing
- **Load Tests**: K6 for performance testing

## 📝 Development Workflow

1. **Feature Development**: Create feature branch
2. **Local Testing**: Run tests and lint
3. **Build Verification**: Ensure clean build
4. **PR Review**: Code review process
5. **CI/CD**: Automated testing and deployment

## 🔐 Security Considerations

- All API keys stored in environment variables
- Content Security Policy configured for extension
- CORS properly configured in Phoenix
- Input validation using Ecto changesets
- Rate limiting with Hammer on all API endpoints

## 📊 Monitoring

- Fly.io built-in monitoring and metrics
- Phoenix LiveDashboard for real-time metrics
- Observer for Erlang VM monitoring (via Fly SSH)
- Fly.io PostgreSQL monitoring dashboard
- Sentry for error tracking (optional)
- Chrome Extension analytics (opt-in)
