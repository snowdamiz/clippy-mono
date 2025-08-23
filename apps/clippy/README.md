# Clippy Phoenix Application

This is the main Phoenix/Elixir backend application for Clippy.

## Structure

This will be created when you run `mix phx.new` to initialize the Phoenix application.

Expected structure:
```
apps/clippy/
├── lib/
│   ├── clippy/           # Business logic
│   │   ├── pipeline/     # GenStage processors
│   │   ├── workers/      # Task processors
│   │   ├── storage/      # Storage adapters
│   │   └── ai/           # AI integrations
│   └── clippy_web/       # Phoenix web layer
│       ├── channels/     # WebSocket handlers
│       ├── controllers/  # REST API
│       └── live/         # LiveView (optional)
├── config/               # Environment configs
├── priv/                 # Static files & migrations
├── test/                 # Tests
└── mix.exs              # Project definition
```

## Setup Instructions

1. Install Elixir and Phoenix:
   ```bash
   # Install Erlang/OTP 26+
   # Install Elixir 1.15+
   # Install Phoenix 1.7+
   mix local.hex --force
   mix archive.install hex phx_new
   ```

2. Initialize Phoenix application:
   ```bash
   cd apps
   mix phx.new clippy --no-html --no-assets --no-mailer --no-dashboard --no-gettext
   ```

3. Configure for API-only mode and add required dependencies in mix.exs:
   - GenStage for pipeline processing
   - Phoenix Channels for WebSocket
   - Task.Supervisor for dynamic workers
   - Cachex or use built-in ETS for caching

## Features

- WebSocket handling via Phoenix Channels
- GenStage pipeline for video/audio processing
- Built-in process supervision
- ETS for in-memory caching
- Direct integration with Supabase via Ecto
- Task spawning for parallel processing
