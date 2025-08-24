# Clippy - Automatic Stream Clipping Platform

## 🎯 Project Overview

Clippy is a real-time stream clipping tool that processes live streams as they happen, automatically identifying and creating highlight clips in real-time. Using smart tab recording with automatic focus detection, the system continuously analyzes the stream, generating clips of noteworthy moments on-the-fly, ready for various social media platforms.

## 🚀 MVP Features

- **Smart Tab Recording**: Capture streaming content with automatic video region detection
- **Real-Time Processing**: Process stream chunks as they arrive (10-30 second windows)
- **Continuous Transcription**: Rolling transcription using Whisper AI on audio chunks
- **Live Clip Detection**: AI continuously analyzes recent transcript segments for highlights
- **Instant Clip Generation**: Automatically create clips when highlights are detected
- **Dual Buffer System**:
  - 5-minute rolling buffer for immediate clip generation
  - 48-hour raw storage for extended context and retroactive clipping
- **Context-Aware AI**: References historical conversations for better clip detection
- **Smart Clip Generation**: Include context from previous streams when relevant
- **Multi-Platform Export**: Pre-formatted clips ready for social media platforms
- **Real-Time Notifications**: Alert users when new clips are generated
- **Auto-Cleanup**: Automatic deletion of raw streams after 48 hours

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
2. Browser Processing:
   a. Capture tab stream via chrome.tabCapture API
   b. Track video element position for smart cropping
   c. Local processing with WebCodecs/WASM (optional)
   d. Stream chunks via Phoenix Channels (WebSocket)
   e. Maintain 5-min IndexedDB buffer (fallback)
   
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
│   ├── chrome-extension/      # Vue 3 Chrome extension
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
│   │   │       └── live/        # LiveView UI
│   │   └── config/           # Environment configs
│   └── website/              # Next.js marketing website
│
├── packages/                 # Shared JavaScript packages
│   ├── shared/              # Shared types & utils
│   └── wasm/                # WebAssembly modules
│
└── infrastructure/
    ├── docker/              # Container config (single Dockerfile)
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

### Chrome Extension
- **Framework**: Vue 3 + TypeScript
- **Recording**: chrome.tabCapture API
- **Processing**: WebAssembly (Whisper.cpp, FFmpeg with smart cropping)
- **Build Tool**: Vite
- **Storage**: IndexedDB for 5-min buffer
- **APIs**: MediaRecorder, WebCodecs, Chrome Extension APIs

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
- **Database**: Self-hosted PostgreSQL
  - Direct Ecto integration with zero overhead
  - PgBouncer for connection pooling
  - Custom backup strategy with pg_dump
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
PostgreSQL 14+ (self-hosted)
FFmpeg 6.0+ (for video processing)

# Optional but Recommended
PgBouncer (for connection pooling)
Docker (for containerized deployment)
```

### Installation

#### 1. Database Setup

**PostgreSQL Installation**
```bash
# Install PostgreSQL locally
sudo apt-get install postgresql-14 postgresql-contrib  # Ubuntu/Debian
brew install postgresql@14                              # macOS

# Create database and user
sudo -u postgres createuser -s clippy_user
sudo -u postgres psql -c "ALTER USER clippy_user PASSWORD 'secure_password';"
sudo -u postgres createdb clippy_db -O clippy_user

# Enable required extensions
sudo -u postgres psql -d clippy_db -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
sudo -u postgres psql -d clippy_db -c "CREATE EXTENSION IF NOT EXISTS btree_gin;"

# Optional: Install PgBouncer for connection pooling
sudo apt-get install pgbouncer  # Ubuntu/Debian
brew install pgbouncer          # macOS
```

#### 2. Setup Phoenix Application
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

# Create .env file
cp .env.example .env
# Add your PostgreSQL credentials to .env
# DATABASE_URL="postgresql://clippy_user:secure_password@localhost/clippy_db"

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

## 🎯 MVP Milestones

### Phase 1: Real-Time Streaming (Week 1-2)
- [ ] Chrome extension with Vue 3
- [ ] Tab capture implementation
- [ ] WebSocket streaming of chunks
- [ ] Rolling buffer implementation

### Phase 2: Dual Storage & Processing (Week 3-4)
- [ ] Real-time audio extraction
- [ ] Streaming Whisper AI integration
- [ ] Dual buffer implementation (5min + 48hr)
- [ ] Continuous transcript generation
- [ ] Auto-cleanup scheduler

### Phase 3: Context-Aware AI (Week 5-6)
- [ ] Historical context querying
- [ ] Enhanced AI detection with context
- [ ] Retroactive clip generation
- [ ] Cross-stream reference detection
- [ ] Smart flashback inclusion

### Phase 4: Export & Notifications (Week 7-8)
- [ ] Auto-format for platforms
- [ ] Real-time notifications in extension
- [ ] Clip dashboard in extension
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
- Web dashboard for clip management
- Custom AI models for specific games/streamers
- Automated posting to social media
- Multi-stream support (multiple tabs)
- Team/organization accounts
- Advanced editing tools
- Community marketplace for AI detection models
- Twitch/YouTube chat integration for better context
- Viewer reaction tracking (chat velocity, emotes)
- Collaborative clipping (multiple users, same stream)

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.
