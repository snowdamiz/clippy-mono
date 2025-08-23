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
- [ ] Create Supabase account and project
- [ ] Create Cloudflare account (R2 storage + Workers)
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

### Database Setup (Supabase)
- [ ] Create database schema:
  - [ ] profiles table (user metadata)
  - [ ] recordings table (status tracking)
  - [ ] transcripts table (with segments)
  - [ ] clips table (relationships)
  - [ ] clip_exports table (platform versions)
  - [ ] jobs table (async processing)
  - [ ] stream_archives table (48-hour TTL)
- [ ] Enable Row Level Security on all tables
- [ ] Create storage buckets (recordings, clips, exports, thumbnails)
- [ ] Set up storage policies and CORS
- [ ] Enable realtime for clips and jobs tables
- [ ] Configure authentication (email/password)
- [ ] Create database indexes for performance
- [ ] Set up pg_cron for 48-hour cleanup

### Processing Pipeline (GenStage)
- [ ] Create video processing pipeline:
  - [ ] GenStage producer for chunk reception
  - [ ] Video processor consumer
  - [ ] Backpressure handling
  - [ ] Progress tracking with PubSub
- [ ] Create transcription pipeline:
  - [ ] Audio extraction stage
  - [ ] Whisper API integration
  - [ ] Parallel processing
  - [ ] Result caching in ETS
- [ ] Create AI analysis pipeline:
  - [ ] AI analyzer stage
  - [ ] Groq API client
  - [ ] GPT-4 fallback logic
  - [ ] Rate limiting with GenServer
- [ ] Create clip generation pipeline:
  - [ ] Clip detector stage
  - [ ] Clip assembly logic
  - [ ] Context fetching
  - [ ] Parallel generation
- [ ] Create export pipeline:
  - [ ] Platform formatter stage
  - [ ] Format conversion
  - [ ] CDN upload integration
  - [ ] Batch processing

### Phoenix Features
- [ ] Configure Task.Supervisor for dynamic workers
- [ ] Implement ETS caching with TTL
- [ ] Set up telemetry and monitoring
- [ ] Configure process supervision trees

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

### Edge Functions
- [ ] Set up Cloudflare Workers project
- [ ] Create API router with Hono
- [ ] Implement authentication middleware
- [ ] Set up CORS handling
- [ ] Create rate limiting with KV
- [ ] Add request validation with Zod

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
- [ ] Configure Cloudflare R2 buckets
- [ ] Set up Supabase Storage integration
- [ ] Implement chunk upload system
- [ ] Create progress tracking
- [ ] Handle upload failures and retries
- [ ] Implement multipart uploads
- [ ] Configure Cloudflare CDN

## Phase 10: Testing & Optimization

### Testing
- [ ] Write unit tests for Phoenix modules
- [ ] Create integration tests for API
- [ ] Implement E2E tests for extension
- [ ] Test across different streaming sites
- [ ] Verify cross-browser compatibility
- [ ] Load test with 100+ concurrent connections

### Performance Optimization
- [ ] Optimize WASM loading
- [ ] Implement lazy loading
- [ ] Add request batching
- [ ] Optimize database queries
- [ ] Implement caching strategies
- [ ] Reduce bundle size

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
- [ ] Processing latency <5 seconds
- [ ] Storage cost <$5/user/month
- [ ] Extension size <10MB
- [ ] Support 100+ concurrent users
- [ ] 48-hour archive functionality working
- [ ] All platform exports working (YouTube, TikTok, Twitter, Instagram)
