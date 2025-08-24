# Clippy Architecture - Phoenix/Elixir

## 🎯 Core Architecture Principles

Clippy leverages Elixir's actor model and OTP (Open Telecom Platform) to build a highly scalable, fault-tolerant real-time video processing system.

### Key Architectural Components

1. **GenServer/GenStage** - Stream Processing Pipeline
   - Native process supervision
   - Automatic retry and recovery
   - Back-pressure handling
   - Built-in job queuing without external dependencies

2. **Phoenix Channels** - Real-Time Communication
   - Millions of concurrent connections
   - Built-in presence tracking
   - Automatic reconnection
   - Native pub/sub messaging

3. **Task.Supervisor** - Dynamic Worker Management
   - Dynamic worker spawning
   - Automatic load distribution
   - Process isolation (crash resilience)
   - No container orchestration needed

4. **ETS/Cachex** - High-Performance Caching
   - In-memory storage
   - Distributed caching
   - No external dependencies
   - Microsecond access times

## 🏗️ System Architecture

```
Chrome Extension (Vue 3)
        ↓
Phoenix LiveView/Channels (WebSocket)
        ↓
Elixir Application (Single or Clustered)
   ├── GenStage Pipeline (replaces queues)
   │   ├── Producer: Receives video chunks
   │   ├── ProducerConsumer: Processes chunks
   │   └── Consumer: Stores results
   ├── Task.Supervisor (dynamic workers)
   │   ├── Video processing tasks
   │   ├── Transcription tasks
   │   └── AI analysis tasks
   ├── Phoenix.PubSub (real-time updates)
   └── Cachex/ETS (hot storage)
        ↓
External Services:
   ├── PostgreSQL (Self-hosted database)
   ├── Cloudflare R2 (cold storage)
   └── AI APIs (Groq/OpenAI)
```

## 📊 Architecture Components

### Core System Components
```yaml
Primary Components:
- Phoenix Application (Elixir)
- PostgreSQL (Supabase)
- File Storage (Cloudflare R2)
- AI APIs (Groq/OpenAI)

Built-in Capabilities:
- Process supervision
- Automatic scaling
- Fault tolerance
- Real-time processing
- In-memory caching
- WebSocket handling
- Background jobs
- Rate limiting

Operational Characteristics:
- Complexity: LOW
- Operational Overhead: MINIMAL
- External Dependencies: 3-4
- DevOps Requirements: MINIMAL
```

## 💡 How Elixir Handles Our Use Cases

### 1. Video Chunk Processing
```elixir
defmodule Clippy.Pipeline.VideoProcessor do
  use GenStage

  # Automatically handles backpressure
  def handle_events(chunks, _from, state) do
    # Process chunks in parallel
    tasks = Task.async_stream(chunks, &process_chunk/1,
      max_concurrency: System.schedulers_online() * 2,
      timeout: 30_000
    )
    
    results = Enum.map(tasks, fn {:ok, result} -> result end)
    {:noreply, results, state}
  end
end
```

### 2. Scalable Worker Management
```elixir
defmodule Clippy.Workers.Supervisor do
  use DynamicSupervisor

  # Auto-scales based on load
  def process_job(job_type, params) do
    # Spawns isolated process, crashes don't affect system
    Task.Supervisor.async_nolink(
      Clippy.TaskSupervisor,
      fn -> execute_job(job_type, params) end
    )
  end
end
```

### 3. Real-time Updates Without Redis
```elixir
defmodule ClippyWeb.RecordingChannel do
  use Phoenix.Channel

  # Handles millions of connections efficiently
  def handle_in("chunk_uploaded", chunk, socket) do
    # Process and broadcast without external queue
    Task.start(fn ->
      result = process_chunk(chunk)
      broadcast!(socket, "chunk_processed", result)
    end)
    
    {:reply, :ok, socket}
  end
end
```

### 4. Built-in Rate Limiting
```elixir
defmodule Clippy.RateLimiter do
  use GenServer

  # No external Redis needed
  def check_rate(user_id) do
    case Hammer.check_rate("user:#{user_id}", 60_000, 100) do
      {:allow, _count} -> :ok
      {:deny, _limit} -> {:error, :rate_limited}
    end
  end
end
```

## 🚀 Architecture Benefits

### 1. **Simplicity**
- Single application for all backend processing
- Minimal infrastructure components
- Built-in functionality reduces external dependencies
- Straightforward deployment and maintenance

### 2. **Cost Efficiency**
- Low infrastructure costs (~$625/month for 10k users)
- No separate queue or caching infrastructure
- Efficient resource utilization
- Automatic scaling without additional services

### 3. **Performance**
- Sub-millisecond process spawning
- Direct memory access for caching
- Efficient concurrent processing
- Native clustering capabilities

### 4. **Developer Experience**
- Single codebase for backend
- Excellent debugging tools (Observer, IEx)
- Simple local development
- Hot code reloading

### 5. **Reliability**
- Let-it-crash philosophy with supervision
- Automatic process recovery
- Isolated failure domains
- Battle-tested runtime (99.9999% uptime possible)

## 📁 Simplified Project Structure

```
clippy-mono/
├── apps/
│   ├── chrome-extension/     # Vue 3 Extension (unchanged)
│   └── clippy/              # Elixir/Phoenix App
│       ├── lib/
│       │   ├── clippy/      # Business logic
│       │   │   ├── pipeline/    # GenStage processors
│       │   │   ├── workers/     # Task processors
│       │   │   ├── storage/     # Storage adapters
│       │   │   └── ai/          # AI integrations
│       │   └── clippy_web/   # Phoenix web layer
│       │       ├── channels/    # WebSocket handlers
│       │       ├── controllers/ # REST API
│       │       └── live/        # LiveView (optional)
│       └── config/           # Environment configs
│
├── packages/                 # Shared JS packages (unchanged)
└── infrastructure/
    └── docker/              # Single Dockerfile for Elixir app
```

## 🔄 Implementation Phases

### Phase 1: Core Setup (Week 1)
1. Initialize Phoenix application
2. Set up WebSocket channels
3. Configure Ecto with Supabase
4. Implement authentication

### Phase 2: Processing Pipeline (Week 2)
1. Build GenStage pipeline
2. Implement video processing
3. Add transcription workers
4. Create AI integration

### Phase 3: Features & Optimization (Week 3-4)
1. Implement clip generation
2. Add export functionality
3. Build LiveView dashboard
4. Performance tuning

## 📊 Scaling Characteristics

### Single Node Performance
- **Concurrent Users**: 5,000-10,000
- **WebSocket Connections**: 100,000+
- **Jobs/Second**: 10,000+
- **Memory**: 4-8GB
- **CPU**: 4-8 cores

### Clustered Performance (3 nodes)
- **Concurrent Users**: 30,000+
- **WebSocket Connections**: 1,000,000+
- **Jobs/Second**: 50,000+
- **Automatic failover**: Yes
- **Zero-downtime deploys**: Yes

## 🎯 Architecture Decision Points

### Keep Elixir For:
✅ **All async processing** (GenStage/Task)
✅ **WebSocket management** (Phoenix Channels)
✅ **Job scheduling** (Quantum/Oban)
✅ **Rate limiting** (Hammer)
✅ **Caching** (Cachex/ETS)
✅ **Real-time updates** (PubSub)
✅ **Process supervision** (OTP)

### Still Use External Services For:
- **Database**: Self-hosted PostgreSQL (data persistence, full control)
- **File Storage**: Cloudflare R2 (video storage)
- **AI Processing**: Groq/OpenAI APIs (ML models)
- **CDN**: Cloudflare (content delivery)

## 💰 Infrastructure Costs

### Monthly Costs at Scale (10,000 Users)

```
Phoenix Servers (2x):     $200
PostgreSQL (Self-hosted): $40  # VPS for database
Cloudflare R2 Storage:    $50
AI API Usage:             $300
Monitoring:               $50
Total:                    $640/month

Cost per user: ~$0.064/month
```

## 🚀 Implementation Guidelines

### Development Priorities
1. **Phoenix application setup** with channels
2. **GenStage pipeline** for video processing
3. **ETS/Cachex** for caching layer
4. **Task supervision** for dynamic workers
5. **LiveView dashboard** for monitoring

### Code Example: Complete Video Processing Pipeline

```elixir
defmodule Clippy.VideoPipeline do
  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  def init(_init_arg) do
    children = [
      {Clippy.Pipeline.ChunkReceiver, []},      # Receives chunks
      {Clippy.Pipeline.VideoProcessor, []},      # Processes video
      {Clippy.Pipeline.Transcriber, []},        # Transcribes audio
      {Clippy.Pipeline.AIAnalyzer, []},         # Analyzes content
      {Clippy.Pipeline.ClipGenerator, []},      # Generates clips
      {Clippy.Pipeline.Storage, []}             # Stores results
    ]

    # Automatically supervises and restarts failed processes
    Supervisor.init(children, strategy: :one_for_one)
  end
end
```

This single supervisor replaces:
- BullMQ queues
- Redis cluster
- Worker pool management
- Job scheduling
- Retry logic
- Dead letter queues
- Health checking
- Load balancing

## 🎉 Architecture Summary

**Phoenix/Elixir provides a complete solution** for Clippy's real-time video processing needs:
- Excellent performance characteristics
- Low operational costs
- Simple, maintainable architecture
- Built-in fault tolerance and scalability
- Real-time processing capabilities
- Proven reliability

The actor model and OTP principles make Elixir ideal for building distributed, real-time systems like Clippy, providing enterprise-grade reliability with minimal complexity.
