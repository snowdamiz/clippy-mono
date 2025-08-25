# Clippy - Automatic Stream Clipping Platform

## 🎯 Project Overview

Clippy is a real-time stream clipping platform consisting of three main components:

1. **Chrome Extension**: Lightweight recording tool for capturing streams and monitoring real-time processing
2. **Web Dashboard**: Full-featured Phoenix LiveView application for clip management, editing, and account settings
3. **Marketing Website**: Landing page to convert visitors into users

The Chrome extension focuses on recording and real-time notifications, while the web dashboard serves as the primary interface for managing clips, viewing analytics, and configuring settings.

## 🚀 MVP Features

### Chrome Extension (Lightweight Recording)
- **Smart Tab Recording**: One-click capture with automatic video region detection
- **Local WASM Processing**: Client-side video processing with FFmpeg.wasm and Whisper.cpp
- **Real-Time Monitoring**: Live stats and clip notifications
- **Browser-Based Transcription**: Optional local transcription to reduce server load
- **Quick Actions**: Start/stop recording, view recent clips
- **Minimal Interface**: Focused on recording without clutter

### Web Dashboard (Primary User Interface)
- **Comprehensive Clip Gallery**: Browse, search, and manage all clips
- **Advanced Editing**: Trim, caption, and enhance clips
- **Multi-Platform Export**: Format and export to YouTube, TikTok, Instagram, Twitter
- **Analytics Dashboard**: View performance metrics and insights
- **Account Management**: Settings, billing, team management
- **48-Hour Archive**: Access and search historical content
- **Batch Operations**: Export multiple clips at once

### Backend Processing
- **Real-Time Processing**: Process stream chunks as they arrive
- **Continuous Transcription**: Rolling transcription using Whisper AI
- **Context-Aware AI**: References 48 hours of historical context
- **Smart Clip Generation**: Automatic highlight detection
- **Auto-Cleanup**: Automatic deletion after retention period

## 🏗️ System Architecture (Phoenix/Elixir)

### Why Phoenix/Elixir?
- **Concurrency**: Millions of lightweight processes (2KB each)
- **Fault Tolerance**: Let it crash philosophy with supervisors
- **Real-time**: Built-in WebSocket support via Phoenix Channels
- **No Queue Needed**: GenStage provides backpressure and flow control
- **Hot Code Reload**: Deploy updates without downtime
- **Distributed**: Easily scale across multiple nodes

### Simplified Real-Time Architecture

```
Chrome Extension (Vue 3 + WASM)
        ↓ WebSocket
   Phoenix Channels (Real-time)
        ↓
   Phoenix/Elixir Application
      ├── GenStage Pipeline
      │   ├── Video Processing (FFmpeg NIFs)
      │   ├── Transcription (Whisper via Workers)
      │   └── AI Analysis (Groq/OpenAI)
      ├── Task.Supervisor
      │   └── Dynamic Worker Pools
      ├── ETS Cache (Hot Storage)
      └── Ecto (Database Layer)
        ↓
   External Services:
      ├── PostgreSQL (Self-hosted)
      ├── Cloudflare R2 (Object Storage)
      └── AI APIs (Groq/OpenAI)
```

### Real-Time Processing Flow

```
1. User activates recording → Browser capture starts
2. Browser Processing (WASM-powered):
   a. Capture tab stream via chrome.tabCapture API
   b. Track video element position for smart cropping
   c. FFmpeg.wasm for video compression and clipping
   d. Whisper.cpp WASM for local transcription (free tier)
   e. Stream processed chunks via Phoenix Channels (WebSocket)
   f. Maintain 5-min IndexedDB buffer with WASM-processed clips
   
3. Phoenix Application Receives Stream:
   - Phoenix Channels handle WebSocket connections
   - Built-in rate limiting and backpressure
   - Automatic process spawning per connection
   - Real-time presence tracking
   
4. GenStage Processing Pipeline:
   a. Ingests video chunks from channels
   b. Parallel processing stages:
      - Video: FFmpeg via Elixir NIFs
      - Audio: Extract and queue for transcription
      - Transcription: Worker pool calling Whisper API
      - AI Analysis: Groq/GPT-4 via HTTP clients
   c. Flow control with automatic backpressure
   d. Supervised processes with auto-restart
   
5. Elixir's Built-in Scaling:
   - Millions of lightweight processes
   - Automatic load distribution
   - No external message queue needed
   - Sub-millisecond process spawning
   
6. Storage Management:
   - Hot: ETS tables (in-memory, microsecond access)
   - Warm: Phoenix distributed cache
   - Cold: R2/S3 via ExAws (48-hour archive)
   - GenServer for cleanup scheduling
```

## 📁 Project Structure

```
clippy-mono/
├── apps/
│   ├── chrome-extension/      # Vue 3 Chrome extension (recording)
│   ├── clippy/               # Phoenix/Elixir application
│   │   ├── lib/
│   │   │   ├── clippy/      # Business logic
│   │   │   │   ├── pipeline/    # GenStage processors
│   │   │   │   ├── workers/     # Task processors
│   │   │   │   ├── storage/     # Storage adapters
│   │   │   │   └── ai/          # AI integrations
│   │   │   └── clippy_web/   # Phoenix web layer
│   │   │       ├── channels/    # WebSocket handlers
│   │   │       ├── controllers/ # REST API
│   │   │       └── live/        # LiveView dashboard pages
│   │   │           ├── dashboard_live.ex    # Main dashboard
│   │   │           ├── clips_live/          # Clip management
│   │   │           ├── analytics_live/      # Analytics views
│   │   │           ├── settings_live/       # User settings
│   │   │           └── components/          # Reusable LiveView components
│   │   └── config/           # Environment configs
│   └── website/              # Next.js marketing website
│
├── packages/                 # Shared JavaScript packages
│   ├── shared/              # Shared types & utils
│   └── wasm/                # WebAssembly modules
│
└── infrastructure/
    ├── docker/              # Container config
    └── deployment/          # Deployment scripts
```

## 🛠️ Technology Stack

### Marketing Website
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4 + Vercel Analytics
- **Components**: Radix UI + Heroicons
- **Performance**: 95+ Lighthouse score target

### Chrome Extension (WASM-Powered Recording)
- **Framework**: Vue 3 + TypeScript
- **Purpose**: Recording and local processing
- **Recording**: chrome.tabCapture API
- **WASM Modules**:
  - FFmpeg.wasm: Video compression, clipping, format conversion
  - Whisper.cpp WASM: Local transcription (free tier)
  - WebCodecs API: Hardware-accelerated video encoding
- **Build Tool**: Vite
- **Storage**: IndexedDB for 5-min buffer of processed clips
- **Communication**: WebSocket to Phoenix backend (optimized chunks)

### Web Dashboard (Phoenix LiveView)
- **Framework**: Phoenix LiveView
- **Purpose**: Full clip management and analytics
- **UI Components**: Surface UI or custom LiveView components
- **Styling**: Tailwind CSS
- **Real-time Updates**: LiveView's built-in WebSocket
- **Features**:
  - Clip gallery with search and filters
  - Video player with editing controls
  - Export management interface
  - Analytics dashboards
  - Account settings
  - Team collaboration tools

### Backend Processing
- **Core**: Phoenix/Elixir application server
- **Concurrency**: BEAM VM with millions of lightweight processes
- **Processing**: GenStage pipelines for streaming data
- **Features**: Built-in fault tolerance, auto-scaling, hot code reloading

### AI/ML (Tiered Approach)
- **Browser**: Whisper.cpp WASM (free, client-side)
- **Primary**: Groq API (Whisper + Llama 3.1) via Phoenix workers
- **Fallback**: GPT-4 for complex context only
- **Processing**: Task.Supervisor for parallel AI calls

### Data Layer
- **Real-Time Processing**: Phoenix/Elixir
  - GenStage pipeline for stream processing
  - Built-in process supervision
  - Automatic backpressure handling
  - No external queue needed
- **Database**: Fly.io Managed PostgreSQL
  - Direct Ecto integration with zero overhead
  - Built-in connection pooling
  - Automated backups and failover
  - Single-region or multi-region replication
- **Cache Layers**:
  - L1: ETS (in-memory, microsecond access)
  - L2: Phoenix cache (distributed across cluster)
  - L3: Browser IndexedDB
- **Storage Tiers**:
  - Hot: ETS (5-min buffer)
  - Warm: CDN (recent clips)
  - Cold: Cloudflare R2/S3 (archives)
- **CDN**: Cloudflare with smart caching

## 📊 Phoenix Application Modules

### Authentication Module
- User registration/login via Phoenix controllers
- JWT token generation with Guardian
- Session management in ETS

### Stream Processing Pipeline (GenStage)
- Receive video chunks via Phoenix Channels (10-30 sec intervals)
- Dual storage management:
  - Hot buffer: 5-minute rolling buffer in ETS (microsecond access)
  - Cold storage: 48-hour archive in R2 via ExAws
- GenStage pipeline with automatic flow control
- Quantum scheduler for cleanup tasks
- Efficient chunk retrieval from storage tiers

### Audio Transcription Module
- Extract audio from video chunks using FFmpeg NIFs
- Parallel processing with Task.Supervisor worker pools
- Call Whisper AI (Groq/OpenAI) via HTTP clients
- Return timestamped transcript segments:
```json
{
  "chunk_id": "chunk_123",
  "start_time": 300.0,  // Stream time in seconds
  "transcript": [
    {
      "text": "This is amazing!",
      "start": 310.5,
      "end": 311.8,
      "confidence": 0.98
    }
  ]
}
```

### Video Processing Module
- Maintain video buffer in ETS tables
- Quick clip extraction via FFmpeg NIFs
- Real-time quality optimization in GenStage
- Parallel thumbnail generation with Task.async_stream

### Clip Detection Module (AI Analysis)
- Dual analysis mode in GenStage:
  - Immediate: Sliding window (last 2-3 minutes)
  - Historical: Query last 48 hours via Ecto
- Enhanced AI detection with full context:
  - Immediate triggers: excitement, key phrases, sentiment
  - Contextual triggers: callbacks, story arcs, predictions
  - Cross-stream references: "Remember yesterday..."
- Smart clip generation:
  - Include relevant flashbacks from archives
  - Automatic context overlay for callbacks
  - Multi-segment clips for story completion
- Retroactive clipping when context emerges later

### Export Module
- Platform-specific formatting via parallel Task.Supervisor:
  - YouTube Shorts (9:16, <60s)
  - TikTok (9:16, <3min)
  - Twitter/X (various ratios, <2:20)
  - Instagram Reels (9:16, <90s)
- FFmpeg NIFs for caption overlay
- GenServer for export queue management

## 🚀 Getting Started

### Prerequisites
```bash
# Core Requirements
Elixir 1.15+
Erlang/OTP 26+
Node.js 20+ (for Chrome extension and website)
FFmpeg 6.0+ (for video processing)
PostgreSQL 14+ (for local development)

# Deployment Requirements
Fly.io CLI (for deployment)
Git (for version control)
```

### Local Development Setup

#### 1. Install Fly.io CLI
```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Authenticate with Fly.io
fly auth signup  # or fly auth login if you have an account
```

#### 2. Database Setup (Local Development)
```bash
# For local development, use PostgreSQL locally
sudo apt-get install postgresql-14  # Ubuntu/Debian
brew install postgresql@14          # macOS

# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql@14  # macOS

# Create local development database and user
sudo -u postgres psql << EOF
CREATE USER clippy_user WITH PASSWORD 'localdev123';
CREATE DATABASE clippy_dev OWNER clippy_user;
CREATE DATABASE clippy_test OWNER clippy_user;
GRANT ALL PRIVILEGES ON DATABASE clippy_dev TO clippy_user;
GRANT ALL PRIVILEGES ON DATABASE clippy_test TO clippy_user;
EOF
```

#### 3. Setup Phoenix Application
```bash
# Clone repository
git clone https://github.com/yourusername/clippy-mono.git
cd clippy-mono

# Install JavaScript dependencies for Chrome extension
npm install

# Setup Phoenix application
cd apps/clippy
mix deps.get
mix ecto.create
mix ecto.migrate

# Configure database connection
export DATABASE_URL="postgresql://clippy_user:localdev123@localhost/clippy_dev"

# Or create config/dev.secret.exs for local development
cat > config/dev.secret.exs << 'EOF'
import Config

config :clippy, Clippy.Repo,
  username: "clippy_user",
  password: "localdev123",
  hostname: "localhost",
  database: "clippy_dev",
  pool_size: 10
EOF

# Start Phoenix server
mix phx.server
# Phoenix is now running at http://localhost:4000
```

### Chrome Extension Development
```bash
cd apps/chrome-extension
npm install
npm run dev

# Load extension in Chrome:
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select dist/ directory
```

### Marketing Website Development
```bash
cd apps/website
npm install
npm run dev

# Open http://localhost:3000 in browser
# Website will auto-reload on changes
```

## 🖄 Development Workflow

### Key Phoenix/Elixir Dependencies
```elixir
# mix.exs dependencies
defp deps do
  [
    {:phoenix, "~> 1.7.10"},
    {:phoenix_ecto, "~> 4.4"},
    {:ecto_sql, "~> 3.11"},
    {:postgrex, ">= 0.0.0"},
    {:phoenix_live_view, "~> 0.20"},
    {:phoenix_live_dashboard, "~> 0.8"},
    {:gen_stage, "~> 1.2"},
    {:flow, "~> 1.2"},
    {:ex_aws, "~> 2.4"},
    {:ex_aws_s3, "~> 2.4"},
    {:httpoison, "~> 2.2"},
    {:jason, "~> 1.4"},
    {:guardian, "~> 2.3"},
    {:quantum, "~> 3.5"},
    {:ffmpex, "~> 0.10"},
    {:telemetry_metrics, "~> 0.6"},
    {:telemetry_poller, "~> 1.0"},
    {:cachex, "~> 3.6"},
    {:hammer, "~> 6.1"}
  ]
end
```

### Adding a New Module to Phoenix
```bash
# Create a new context module
cd apps/clippy
mix phx.gen.context Streaming Video videos title:string

# Create a new GenStage processor
mix phx.gen.context Pipeline VideoProcessor

# Generate a new channel
mix phx.gen.channel Stream
```

### Running the Application
```bash
# Start Phoenix with interactive shell
cd apps/clippy
iex -S mix phx.server

# Run tests with coverage
mix test --cover

# Run specific test file
mix test test/clippy/pipeline_test.exs

# Check code quality
mix format --check-formatted
mix credo --strict
mix dialyzer

# Performance monitoring
iex> :observer.start()  # GUI system monitor
iex> :etop.start()      # Terminal process monitor

# Live Dashboard (available at http://localhost:4000/dashboard)
mix phx.server
```

### Phoenix/Elixir Performance Tuning
```elixir
# config/runtime.exs
config :clippy, ClippyWeb.Endpoint,
  http: [port: 4000, transport_options: [num_acceptors: 100]]

# Increase ETS table limits
config :clippy, :ets_settings,
  max_tables: 10_000,
  max_memory: 1_073_741_824  # 1GB

# Configure connection pools
config :clippy, Clippy.Repo,
  pool_size: 20,
  queue_target: 5000,
  queue_interval: 1000
```

## 🚀 Deployment to Fly.io

### Initial Setup

#### 1. Create Fly.io Application
```bash
cd apps/clippy

# Initialize Fly.io app (one-time setup)
fly launch --name clippy-app --region lax \
  --no-deploy \
  --org personal

# This creates:
# - fly.toml configuration file
# - Dockerfile for Phoenix deployment
# - Release configuration
```

#### 2. Setup Managed PostgreSQL Database
```bash
# Create a PostgreSQL cluster on Fly.io
fly postgres create --name clippy-db \
  --region lax \
  --initial-cluster-size 1 \
  --vm-size shared-cpu-1x \
  --volume-size 10

# Attach database to your app (creates DATABASE_URL secret)
fly postgres attach clippy-db --app clippy-app

# Get connection string for verification
fly postgres connect -a clippy-db
```

#### 3. Configure Secrets and Environment Variables
```bash
# Set required secrets for production
fly secrets set SECRET_KEY_BASE="$(mix phx.gen.secret)" \
  PHX_HOST="clippy-app.fly.dev" \
  GROQ_API_KEY="your-groq-api-key" \
  OPENAI_API_KEY="your-openai-key" \
  R2_ACCESS_KEY="your-r2-access-key" \
  R2_SECRET_KEY="your-r2-secret-key" \
  R2_BUCKET="your-bucket-name" \
  R2_ENDPOINT="https://your-account.r2.cloudflarestorage.com"

# Verify secrets are set
fly secrets list
```

#### 4. Configure fly.toml for Phoenix
```toml
# fly.toml
app = "clippy-app"
primary_region = "lax"
kill_signal = "SIGTERM"
kill_timeout = 5

[build]
  builder = "hexpm/elixir:1.15.7-erlang-26.1.2-debian-bookworm-20231009"

[env]
  PHX_HOST = "clippy-app.fly.dev"
  PORT = "8080"
  POOL_SIZE = "20"
  MIX_ENV = "prod"

[experimental]
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"
  script_checks = []

  [services.concurrency]
    hard_limit = 1000
    soft_limit = 900
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"

  [[services.http_checks]]
    interval = "30s"
    grace_period = "5s"
    method = "GET"
    path = "/health"
    protocol = "http"
    timeout = "2s"
    tls_skip_verify = false

# Scale memory/CPU as needed
[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

#### 5. Deploy the Application
```bash
# Initial deployment
fly deploy

# Monitor deployment
fly logs

# Open application in browser
fly open

# Check application status
fly status
```

### Database Management

#### Connect to Production Database
```bash
# Direct connection to PostgreSQL
fly postgres connect -a clippy-db

# Run migrations on production
fly ssh console -a clippy-app
/app/bin/clippy eval "Clippy.Release.migrate"
```

#### Database Backups
```bash
# Create a manual backup
fly postgres backup create -a clippy-db

# List available backups
fly postgres backup list -a clippy-db

# Restore from backup (if needed)
fly postgres backup restore <backup-id> -a clippy-db
```

### Scaling and Performance

#### Horizontal Scaling
```bash
# Scale to multiple instances
fly scale count 3 --app clippy-app

# Check current scale
fly scale show --app clippy-app
```

#### Vertical Scaling
```bash
# Upgrade VM size
fly scale vm shared-cpu-2x --memory 1024 --app clippy-app

# Scale PostgreSQL
fly scale vm shared-cpu-2x --memory 2048 -a clippy-db
```

#### Add Regions (Multi-region deployment)
```bash
# Add additional regions
fly regions add ord sjc --app clippy-app

# List current regions
fly regions list --app clippy-app

# Setup PostgreSQL read replicas
fly postgres replicas create --region ord -a clippy-db
```

### Monitoring and Debugging

#### View Logs
```bash
# Stream live logs
fly logs --app clippy-app

# View recent logs
fly logs --app clippy-app --recent

# Filter logs
fly logs --app clippy-app | grep ERROR
```

#### SSH into Running Instance
```bash
# Connect to running instance
fly ssh console --app clippy-app

# Run Elixir remote console
fly ssh console --app clippy-app
/app/bin/clippy remote
```

#### Health Checks
```bash
# Check app status
fly status --app clippy-app

# Monitor metrics
fly monitor --app clippy-app
```

### CI/CD with GitHub Actions

#### Create GitHub Action for Auto-deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy to Fly.io

on:
  push:
    branches:
      - main
    paths:
      - 'apps/clippy/**'
      - '.github/workflows/deploy.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Fly.io CLI
        uses: superfly/flyctl-actions/setup-flyctl@master
      
      - name: Deploy to Fly.io
        run: |
          cd apps/clippy
          flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

#### Setup GitHub Secrets
```bash
# Get your Fly.io API token
fly auth token

# Add to GitHub repository secrets:
# Settings > Secrets > Actions > New repository secret
# Name: FLY_API_TOKEN
# Value: [paste token from above]
```

### Custom Domain Setup

```bash
# Add custom domain
fly certs add clippy.yourdomain.com --app clippy-app

# Get DNS records to configure
fly certs show clippy.yourdomain.com --app clippy-app

# Verify certificate
fly certs check clippy.yourdomain.com --app clippy-app
```

### Production Checklist

- [ ] Set all required environment variables and secrets
- [ ] Configure production database with appropriate size
- [ ] Setup database backups and retention policy
- [ ] Configure health checks in fly.toml
- [ ] Setup monitoring and alerting
- [ ] Configure auto-scaling rules
- [ ] Setup CI/CD pipeline
- [ ] Configure custom domain and SSL
- [ ] Test database migrations on staging first
- [ ] Configure rate limiting and DDoS protection
- [ ] Setup log aggregation (if needed)
- [ ] Configure CDN for static assets

## 🎩 MVP Milestones

### Phase 1: Core Infrastructure (Week 1-2)
- [ ] Chrome extension with Vue 3 setup
- [ ] Tab capture implementation
- [ ] FFmpeg.wasm integration for video processing
- [ ] Whisper.cpp WASM integration for transcription
- [ ] IndexedDB setup for local clip storage
- [ ] WebSocket streaming to Phoenix
- [ ] Basic LiveView dashboard setup
- [ ] Authentication system

### Phase 2: Processing Pipeline (Week 3-4)
- [ ] GenStage pipeline setup
- [ ] Real-time audio extraction
- [ ] Streaming Whisper AI integration
- [ ] Dual buffer implementation (5min + 48hr)
- [ ] Auto-cleanup scheduler

### Phase 3: Web Dashboard Development (Week 5-6)
- [ ] LiveView clip gallery with search/filters
- [ ] Video player with preview controls
- [ ] Export interface for multiple platforms
- [ ] Analytics dashboard
- [ ] Account settings page
- [ ] Team collaboration features

### Phase 4: AI & Export Features (Week 7-8)
- [ ] Context-aware AI detection
- [ ] Cross-stream reference detection
- [ ] Platform-specific formatting
- [ ] Batch export functionality
- [ ] Real-time notifications in extension
- [ ] Download & share functionality

## 💰 Pricing Tiers

### Free Tier
- **1 hour/day** recording limit
- **3 clips per day** generation limit
- **12-hour** storage retention
- Basic AI detection only
- Watermarked exports
- Limited to 720p quality
- Browser-only processing

### Pro Tier ($9.99/month)
- **4 hours/day** recording
- **Unlimited clips** generation
- **48-hour** storage retention
- Extended Context System™
- Advanced AI detection with Groq
- All export formats (YouTube, TikTok, etc.)
- Priority processing
- **1080p** quality support
- Email support

### Business Tier ($29.99/month)
- **Unlimited** recording
- **7-day** storage retention
- GPT-4 priority access for complex clips
- API access for automation
- Team features (5 users included)
- Custom AI prompts
- Webhook integrations
- **4K** quality support
- Priority support
- Custom branding options

## 🔮 Future Enhancements
- Custom AI models for specific games/streamers
- Automated posting to social media platforms
- Multi-stream support (multiple tabs simultaneously)
- Advanced video editing tools (transitions, effects)
- Community marketplace for AI detection models
- Twitch/YouTube chat integration for better context
- Viewer reaction tracking (chat velocity, emotes)
- Mobile app for clip management on the go
- Webhooks and API for third-party integrations
- White-label solutions for enterprises

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.
