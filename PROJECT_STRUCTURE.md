# Clippy Monorepo Structure

## 📁 Directory Overview

```
clippy-mono/
├── apps/                      # Application packages
│   ├── extension/            # Chrome Extension (Vue 3)
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
│   └── edge/                # Edge Functions
│       ├── cloudflare/      # Cloudflare Workers
│       │   └── src/         # Worker source code
│       └── supabase/        # Supabase Edge Functions
│           └── functions/   # Function implementations
│
├── packages/                 # Shared packages
│   ├── shared/              # Shared types and utilities
│   │   └── src/
│   │       ├── types/       # TypeScript type definitions
│   │       ├── utils/       # Shared utilities
│   │       └── constants/   # Shared constants
│   │
│   ├── wasm/                # WebAssembly modules
│   │   ├── src/             # WASM wrapper code
│   │   └── lib/             # Compiled WASM files
│   │
│   ├── ai/                  # AI integration layer
│   │   └── src/             # AI service implementations
│   │
│   └── database/            # Database layer
│       ├── src/             # Database client code
│       └── migrations/      # SQL migrations
│
├── docs/                     # Documentation
├── tests/                    # Test suites
│   ├── unit/                # Unit tests
│   └── e2e/                 # End-to-end tests
│
├── scripts/                  # Build and utility scripts
├── config/                   # Configuration files
└── .github/                  # GitHub Actions workflows
    └── workflows/
```

## 🏗️ Architecture Overview

### Apps

#### Chrome Extension (`apps/extension`)
- **Framework**: Vue 3 + Vite + TypeScript
- **State Management**: Pinia
- **Styling**: TailwindCSS
- **Components**:
  - Background Service Worker: Handles recording orchestration
  - Content Scripts: Injected into web pages for video capture
  - Popup UI: Main user interface
  - Options Page: Settings and configuration

#### Edge Functions (`apps/edge`)
- **Cloudflare Workers**: API routes, R2 storage, real-time processing
- **Supabase Functions**: Database operations, auth, real-time subscriptions

### Packages

#### Shared (`packages/shared`)
- TypeScript type definitions
- Shared constants and configuration
- Utility functions used across packages
- Zod schemas for validation

#### WASM (`packages/wasm`)
- FFmpeg.wasm for video processing
- Whisper.cpp for transcription
- WebCodecs wrappers
- Worker implementations

#### AI (`packages/ai`)
- Groq API integration
- OpenAI fallback
- LangChain for complex workflows
- Prompt templates and management

#### Database (`packages/database`)
- Supabase client configuration
- Database types (generated from schema)
- Migration scripts
- Seed data for development

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Supabase CLI
- Cloudflare Wrangler CLI

### Installation
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up Supabase
cd packages/database
npm run migrate

# Build packages
npm run build
```

### Development
```bash
# Start all services in development mode
npm run dev

# Or run specific apps
npm run extension:dev  # Chrome Extension
npm run edge:dev      # Edge Functions
```

### Building
```bash
# Build all packages
npm run build

# Build specific app
npm run extension:build
```

## 📦 Package Dependencies

### Workspace Structure
All packages use npm workspaces for dependency management:
- `@clippy/extension` - Chrome Extension app
- `@clippy/cloudflare-edge` - Cloudflare Workers
- `@clippy/supabase-edge` - Supabase Edge Functions
- `@clippy/shared` - Shared utilities and types
- `@clippy/wasm` - WebAssembly modules
- `@clippy/ai` - AI integration layer
- `@clippy/database` - Database layer

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
- `wrangler.toml` - Cloudflare Workers config
- `manifest.json` - Chrome Extension manifest

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
- CORS properly configured for edge functions
- Input validation using Zod schemas
- Rate limiting on all API endpoints

## 📊 Monitoring

- Sentry for error tracking
- Cloudflare Analytics for edge functions
- Supabase Dashboard for database metrics
- Chrome Extension analytics (opt-in)
