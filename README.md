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

## 🏗️ System Architecture (Queue-Based Scalable)

### Scalable Queue-First Architecture

```
Chrome Extension (Vue 3 + Capture Only)
        ↓
   API Gateway (Load Balanced)
        ↓
   Queue System (BullMQ + Redis Cluster)
        ↓
   Worker Pool Architecture:
  - Video Workers: Chunk processing & compression
  - Transcription Workers: Whisper AI processing
  - AI Workers: Groq/GPT-4 analysis with rate limiting
  - Clip Workers: Generation and assembly
  - Export Workers: Platform-specific formatting
        ↓
   Storage Tiers:
  - Hot: Redis (5-min buffer)
  - Warm: CDN (recent clips)
  - Cold: Cloudflare R2 (48-hour archive)
        ↓
   Database: Supabase (PostgreSQL cluster)
```

### Scalable Queue-Based Processing Flow

```
1. User activates recording → Lightweight capture
2. Browser (Minimal Processing):
   a. Capture tab stream via chrome.tabCapture API
   b. Track video element position
   c. Basic compression with WebCodecs
   d. Stream chunks to API Gateway
   e. Maintain 5-min local buffer (fallback)
   
3. API Gateway (Load Balanced):
   - Authenticate request
   - Rate limiting per user tier
   - Route to appropriate queue
   - Return job ID for tracking
   
4. Queue Processing (BullMQ + Redis):
   a. Priority-based job scheduling
   b. Distribute to worker pools:
      - Video: FFmpeg processing (10-20 workers)
      - Transcription: Whisper AI (20-30 workers)
      - AI Analysis: Groq/GPT-4 (5-10 workers)
      - Clip Generation: Assembly (10-15 workers)
   c. Automatic retry with exponential backoff
   d. Dead letter queue for failed jobs
   
5. Worker Processing:
   - Horizontal scaling based on load
   - GPU acceleration for AI tasks
   - Batch processing for efficiency
   - Circuit breakers for external APIs
   
6. Storage Strategy:
   - Hot: Redis cluster (immediate access)
   - Warm: CDN cache (recent clips)
   - Cold: R2/S3 (48-hour archive)
   - Automatic tiering and cleanup
```

## 📁 Project Structure

```
clippy-mono/
├── apps/
│   ├── chrome-extension/      # Vue 3 Chrome extension
│   ├── website/              # Next.js marketing website
│   └── edge/                # Edge functions
│
├── services/
│   ├── api-gateway/          # Load balancing & routing
│   ├── queue-manager/        # BullMQ queue orchestration
│   └── workers/              # Distributed worker pools
│       ├── video-worker/     # FFmpeg processing
│       ├── transcription/    # Whisper AI processing
│       ├── ai-analysis/      # Groq/GPT-4 analysis
│       ├── clip-generation/  # Clip assembly
│       └── export/          # Platform formatting
│
├── packages/
│   ├── shared/              # Shared types & utils
│   ├── queue/               # Queue abstractions
│   ├── cache/               # Caching strategies
│   └── database/            # DB schemas & pooling
│
└── infrastructure/
    ├── docker/              # Container configs
    ├── k8s/                 # Kubernetes manifests
    └── terraform/           # Infrastructure as code
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

### Edge Computing
- **Functions**: Cloudflare Workers + Supabase Edge Functions
- **Runtime**: Deno/V8 Isolates (0ms cold start)
- **Processing**: Rust compiled to WASM
- **Features**: Auto-scaling, global distribution

### AI/ML (Tiered Approach)
- **Browser**: Whisper.cpp WASM (free)
- **Primary**: Groq API (Whisper + Llama 3.1)
- **Fallback**: GPT-4 for complex context only
- **Embeddings**: Local ONNX models

### Data Layer
- **Queue System**: BullMQ + Redis Cluster
  - Job queues with priority levels
  - Distributed processing
  - Automatic retries and dead letter queues
  - Real-time job monitoring
- **Database**: Supabase PostgreSQL Cluster
  - Connection pooling (PgBouncer)
  - Read replicas for scaling
  - Automated backups
- **Cache Layers**:
  - L1: Redis cluster (hot data)
  - L2: CDN edge cache
  - L3: Browser IndexedDB
- **Storage Tiers**:
  - Hot: Redis (5-min buffer)
  - Warm: CDN (recent clips)
  - Cold: Cloudflare R2/S3 (archives)
- **CDN**: Cloudflare with smart caching

## 📊 Service Details

### Auth Service
- User registration/login
- JWT token generation
- Session management

### Stream Service (Dual Buffer System)
- Receive video chunks via WebSocket (10-30 sec intervals)
- Dual storage management:
  - Hot buffer: 5-minute rolling buffer in Redis for immediate access
  - Cold storage: 48-hour archive in S3/Supabase for context
- Coordinate chunk processing pipeline
- Manage automatic cleanup (48-hour expiry)
- Handle chunk retrieval from both storage tiers

### Audio Service (Continuous Transcription)
- Extract audio from video chunks in real-time
- Process with Whisper AI (streaming mode)
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

### Video Service (Buffer Management)
- Maintain video buffer for clip generation
- Quick clip extraction from buffer
- Real-time quality optimization
- Thumbnail generation on-the-fly

### Clip Service (Context-Aware Detection)
- Dual analysis mode:
  - Immediate: Sliding window (last 2-3 minutes)
  - Historical: Query last 48 hours for context
- Enhanced AI detection with full context:
  - Immediate triggers: excitement, key phrases, sentiment
  - Contextual triggers: callbacks, story arcs, predictions
  - Cross-stream references: "Remember yesterday..."
- Smart clip generation:
  - Include relevant flashbacks from archives
  - Automatic context overlay for callbacks
  - Multi-segment clips for story completion
- Retroactive clipping when context emerges later

### Export Service
- Platform-specific formatting:
  - YouTube Shorts (9:16, <60s)
  - TikTok (9:16, <3min)
  - Twitter/X (various ratios, <2:20)
  - Instagram Reels (9:16, <90s)
- Add captions/subtitles
- Apply platform requirements

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 20+
Docker & Docker Compose
Supabase Account (free tier works)
Python 3.10+ (for AI services)
```

### Installation

#### 1. Setup Supabase
```bash
# Create a Supabase project at https://supabase.com
# Follow instructions in SUPABASE_SETUP.md
# Copy your API keys
```

#### 2. Setup Project
```bash
# Clone repository
git clone https://github.com/yourusername/clippy-mono.git
cd clippy-mono

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your Supabase credentials to .env

# Start local infrastructure (Redis cluster for BullMQ)
docker-compose up -d

# Initialize Supabase database
# Run the SQL scripts from SUPABASE_SETUP.md in Supabase SQL Editor

# Start development
npm run dev
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

## 🔄 Development Workflow

### Adding a New Microservice
```bash
cd services
mkdir new-service
cd new-service
npm init -y
npm install express typescript @types/node
```

### Running Services
```bash
# All services
npm run dev

# Specific service
npm run dev --filter=auth-service

# Chrome extension
npm run dev --filter=chrome-extension
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
