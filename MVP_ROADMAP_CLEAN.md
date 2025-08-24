# MVP Implementation Roadmap

## Phase 1: Environment Setup

### Development Tools
- [ ] Install Erlang/OTP 26+
- [ ] Install Elixir 1.15+
- [ ] Install Phoenix 1.7+ via `mix archive.install hex phx_new`
- [ ] Install Node.js 20+ and npm 10+
- [ ] Install Docker Desktop
- [ ] Install VS Code with extensions (ElixirLS, Vue, TypeScript, Tailwind)
- [ ] Configure Git with SSH keys

### Service Accounts
- [ ] Create PostgreSQL database (Supabase or self-hosted)
- [ ] Create Cloudflare account (R2 storage and CDN)
- [ ] Create Groq API account and get API key
- [ ] Create OpenAI account as fallback
- [ ] Set up GitHub repository

### Project Configuration
- [ ] Create .env file with all API keys
- [ ] Configure TypeScript path aliases
- [ ] Set up Husky commit hooks
- [ ] Configure ESLint and Prettier

## Phase 2: Backend Foundation

### Phoenix Application
- [ ] Navigate to monorepo root and initialize Phoenix app: `mix phx.new apps/clippy --no-html --no-assets --database postgres`
- [ ] Move into Phoenix app directory: `cd apps/clippy`
- [ ] Configure Phoenix for API-only mode in `config/config.exs`
- [ ] Set up Ecto for Supabase PostgreSQL connection in `config/dev.exs` and `config/runtime.exs`
- [ ] Run database setup: `mix ecto.create && mix ecto.migrate`
- [ ] Configure Phoenix Channels for WebSocket communication
- [ ] Set up Phoenix PubSub for real-time updates

### Database Setup (PostgreSQL via Ecto)
- [ ] Create Ecto migrations for database schema:
  - [ ] profiles table (user metadata)
  - [ ] recordings table (status tracking)
  - [ ] transcripts table (with segments)
  - [ ] clips table (relationships)
  - [ ] clip_exports table (platform versions)
  - [ ] stream_archives table (48-hour TTL)
- [ ] Configure authentication system with Guardian
- [ ] Create database indexes for performance
- [ ] Set up Quantum scheduler for 48-hour cleanup
- [ ] Implement Ecto schemas and changesets
- [ ] Create database seeds for development

### Processing Pipeline (GenStage)
- [ ] Create video processing pipeline:
  - [ ] GenStage producer for chunk reception via Phoenix Channels
  - [ ] Video processor consumer with FFmpeg NIFs
  - [ ] Backpressure handling built into GenStage
  - [ ] Progress tracking with Phoenix.PubSub
- [ ] Create transcription pipeline:
  - [ ] Audio extraction with FFmpeg NIFs
  - [ ] HTTPoison client for Groq/Whisper API
  - [ ] Task.async_stream for parallel processing
  - [ ] Result caching in ETS tables
- [ ] Create AI analysis pipeline:
  - [ ] AI analyzer GenStage consumer
  - [ ] HTTPoison client for Groq API
  - [ ] OpenAI fallback with HTTPoison
  - [ ] Rate limiting with Hammer library
- [ ] Create clip generation pipeline:
  - [ ] Clip detector GenStage consumer
  - [ ] Clip assembly with FFmpeg NIFs
  - [ ] Context fetching from ETS and Ecto
  - [ ] Task.Supervisor for parallel generation
- [ ] Create export pipeline:
  - [ ] Platform formatter GenStage consumer
  - [ ] Format conversion with FFmpeg NIFs
  - [ ] ExAws for R2/S3 upload
  - [ ] Flow for batch processing

### Phoenix Core Features
- [ ] Configure Task.Supervisor for dynamic workers
- [ ] Implement Cachex for distributed caching with TTL
- [ ] Set up ETS tables for hot data storage
- [ ] Configure telemetry with Telemetry.Metrics
- [ ] Set up Phoenix.LiveDashboard for monitoring
- [ ] Configure OTP supervision trees
- [ ] Implement GenServer for stateful processes
- [ ] Set up Phoenix.Presence for user tracking

## Phase 3: Chrome Extension

### Extension Setup
- [ ] Configure manifest.json v3 with permissions:
  - [ ] tabCapture
  - [ ] storage
  - [ ] activeTab
  - [ ] host permissions for supported sites
- [ ] Set up background service worker
- [ ] Implement content script injection
- [ ] Create popup UI with Vue 3
- [ ] Build options page for settings
- [ ] Set up Chrome storage API wrapper
- [ ] Implement message passing system

### Video Capture
- [ ] Implement chrome.tabCapture API
- [ ] Set up MediaRecorder for stream capture
- [ ] Create chunking system (10-30 second intervals)
- [ ] Implement quality settings (low/medium/high)
- [ ] Add recording controls (start/stop/pause)
- [ ] Create recording status indicator

### Video Detection
- [ ] Detect video elements on page
- [ ] Calculate video boundaries
- [ ] Track position changes
- [ ] Handle fullscreen transitions
- [ ] Store region metadata

### Browser Processing
- [ ] Integrate FFmpeg.wasm for video processing
- [ ] Set up WebCodecs API for compression
- [ ] Implement keyframe extraction
- [ ] Configure audio extraction
- [ ] Set up Opus audio compression

### Browser Storage
- [ ] Set up IndexedDB schema for chunks
- [ ] Implement 5-minute rolling buffer
- [ ] Create chunk storage system
- [ ] Add automatic cleanup
- [ ] Handle storage quota management

### Transcription (Browser)
- [ ] Integrate Whisper.cpp WASM
- [ ] Set up model loading system
- [ ] Implement audio preprocessing
- [ ] Create transcription worker
- [ ] Handle timestamp alignment

## Phase 4: API Endpoints

### Authentication
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/refresh

### Streaming
- [ ] POST /api/stream/init
- [ ] WS /api/stream/upload
- [ ] POST /api/stream/complete

### Clips
- [ ] GET /api/clips
- [ ] POST /api/clips/generate
- [ ] GET /api/clips/:id
- [ ] GET /api/clips/:id/export/:platform

### API Middleware (Phoenix)
- [ ] Implement authentication plug
- [ ] Set up CORS handling in Phoenix
- [ ] Create rate limiting with Hammer
- [ ] Add request validation with Ecto changesets

## Phase 5: AI Integration

### Groq Setup
- [ ] Configure Groq API client
- [ ] Set up Whisper model for transcription
- [ ] Configure Llama 3.1 70B for analysis
- [ ] Implement rate limiting
- [ ] Create OpenAI fallback system

### Transcription Pipeline
- [ ] Create audio upload to Groq
- [ ] Implement streaming transcription
- [ ] Handle transcript chunking
- [ ] Store transcripts in database
- [ ] Create transcript search index

### AI Analysis
- [ ] Implement keyword detection
- [ ] Add excitement detection (volume/pace)
- [ ] Create sentiment analysis
- [ ] Build context window system
- [ ] Implement sliding window analysis

## Phase 6: Clip Detection & Generation

### Detection Algorithm
- [ ] Implement trigger keyword system
- [ ] Create excitement spike detection
- [ ] Add volume/pace analysis
- [ ] Implement topic modeling
- [ ] Create entity recognition
- [ ] Add game-specific event detection

### Context System
- [ ] Create 48-hour archive queries
- [ ] Implement cross-stream reference detection
- [ ] Add story arc tracking
- [ ] Create prediction matching
- [ ] Implement flashback detection

### Clip Generation
- [ ] Implement clip boundary detection
- [ ] Create backtrack system (15-30 seconds)
- [ ] Add forward lookahead
- [ ] Generate clip metadata
- [ ] Create thumbnail extraction

## Phase 7: Video Processing & Export

### Video Processing
- [ ] Implement clip extraction from buffer
- [ ] Create video concatenation
- [ ] Add transition effects
- [ ] Implement quality optimization
- [ ] Create watermark system

### Platform Formatting
- [ ] YouTube Shorts (9:16, <60s)
- [ ] TikTok (9:16, <3min)
- [ ] Twitter/X (16:9, <2:20)
- [ ] Instagram Reels (9:16, <90s)
- [ ] Implement aspect ratio conversion
- [ ] Create resolution optimization

### Caption System
- [ ] Implement subtitle generation from transcripts
- [ ] Create caption timing and sync
- [ ] Add style customization
- [ ] Implement burn-in captions
- [ ] Create SRT export

## Phase 8: User Interface

### Extension UI
- [ ] Create login/register screens
- [ ] Build main dashboard
- [ ] Implement recording controls
- [ ] Create clip gallery
- [ ] Add clip preview player
- [ ] Build export interface
- [ ] Create settings page

### Real-time Features
- [ ] Implement WebSocket connection
- [ ] Create live transcription display
- [ ] Add clip detection notifications
- [ ] Build progress indicators
- [ ] Implement error notifications

### User Experience
- [ ] Add onboarding flow
- [ ] Implement keyboard shortcuts
- [ ] Add dark mode
- [ ] Create responsive design
- [ ] Implement loading states
- [ ] Add empty states

## Phase 9: Cloud Storage & CDN

### Storage Setup
- [ ] Configure Cloudflare R2 buckets via ExAws
- [ ] Implement chunk upload system with Phoenix Channels
- [ ] Create progress tracking with Phoenix.PubSub
- [ ] Handle upload failures with Task.Supervisor retry logic
- [ ] Implement multipart uploads via ExAws.S3
- [ ] Configure Cloudflare CDN for static content
- [ ] Set up local file storage for development

## Phase 10: Testing & Optimization

### Testing
- [ ] Write ExUnit tests for Phoenix modules
- [ ] Create integration tests for Phoenix Channels
- [ ] Test GenStage pipeline with ExUnit
- [ ] Implement E2E tests for Chrome extension
- [ ] Test across different streaming sites
- [ ] Verify cross-browser compatibility
- [ ] Load test Phoenix with 10,000+ concurrent WebSocket connections
- [ ] Test OTP supervision tree recovery
- [ ] Verify ETS cache performance

### Performance Optimization
- [ ] Optimize WASM loading in browser
- [ ] Implement lazy loading for extension UI
- [ ] Use GenStage batching for efficient processing
- [ ] Optimize Ecto queries with preloading
- [ ] Implement Cachex distributed caching
- [ ] Tune BEAM VM settings for concurrency
- [ ] Configure connection pooling in Ecto
- [ ] Reduce Chrome extension bundle size

### Cost Optimization
- [ ] Implement adaptive quality based on activity
- [ ] Create smart upload throttling
- [ ] Implement tiered AI routing (Groq → OpenAI)
- [ ] Add compression optimization
- [ ] Monitor and optimize API usage

## Phase 11: Production Deployment

### Infrastructure
- [ ] Deploy Phoenix cluster (Fly.io or Render)
- [ ] Configure distributed Erlang cluster
- [ ] Set up monitoring (AppSignal/Sentry)
- [ ] Configure production environment variables
- [ ] Set up backup systems

### Chrome Web Store
- [ ] Prepare store listing
- [ ] Create promotional images
- [ ] Write extension description
- [ ] Set up privacy policy
- [ ] Submit for review

### Documentation
- [ ] Write user documentation
- [ ] Create API documentation
- [ ] Document deployment process
- [ ] Create troubleshooting guide

## MVP Success Criteria

- [ ] Can capture streaming content from Twitch/YouTube
- [ ] Transcription accuracy >90%
- [ ] Clip detection rate >80%
- [ ] Processing latency <5 seconds via GenStage pipeline
- [ ] Storage cost <$5/user/month
- [ ] Chrome extension size <10MB
- [ ] Phoenix handles 10,000+ concurrent WebSocket connections
- [ ] 48-hour archive with automatic cleanup via Quantum
- [ ] All platform exports working (YouTube, TikTok, Twitter, Instagram)
- [ ] Zero message loss with OTP supervision
- [ ] Sub-second WebSocket response times
