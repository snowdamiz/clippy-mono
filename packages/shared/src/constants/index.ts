// Recording Configuration
export const RECORDING_CONFIG = {
  CHUNK_DURATION_MS: 30000, // 30 seconds
  BUFFER_SIZE_MINUTES: 5,
  MAX_CHUNK_SIZE_MB: 50,
  VIDEO_QUALITY: {
    LOW: { width: 640, height: 360, bitrate: 500000 },
    MEDIUM: { width: 1280, height: 720, bitrate: 2500000 },
    HIGH: { width: 1920, height: 1080, bitrate: 5000000 },
  },
  AUDIO_SAMPLE_RATE: 16000, // For Whisper compatibility
  AUDIO_CHANNELS: 1, // Mono for smaller size
} as const

// Activity Detection
export const ACTIVITY_CONFIG = {
  SILENCE_THRESHOLD_DB: -50,
  MOTION_THRESHOLD: 0.3,
  INACTIVE_DURATION_MS: 60000, // 1 minute
  EXCITEMENT_KEYWORDS: [
    'wow', 'omg', 'insane', 'crazy', 'unbelievable',
    'lets go', 'no way', 'gg', 'clutch', 'epic',
  ],
} as const

// AI Configuration
export const AI_CONFIG = {
  WHISPER_MODEL: 'base',
  GROQ_MODEL: 'llama-3.1-70b-versatile',
  GPT_MODEL: 'gpt-4-turbo-preview',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  CONFIDENCE_THRESHOLD: 0.7,
} as const

// Storage Configuration  
export const STORAGE_CONFIG = {
  INDEXEDDB_NAME: 'clippy-storage',
  INDEXEDDB_VERSION: 1,
  STORES: {
    CHUNKS: 'chunks',
    CLIPS: 'clips',
    METADATA: 'metadata',
    TRANSCRIPTS: 'transcripts',
  },
  RETENTION_HOURS: 48,
  CLEANUP_INTERVAL_MS: 3600000, // 1 hour
} as const

// API Endpoints
export const API_ENDPOINTS = {
  SUPABASE: {
    AUTH: '/auth/v1',
    REST: '/rest/v1',
    REALTIME: '/realtime/v1',
    STORAGE: '/storage/v1',
    FUNCTIONS: '/functions/v1',
  },
  CLOUDFLARE: {
    STREAM: '/stream',
    ANALYZE: '/analyze',
    EXPORT: '/export',
  },
  GROQ: {
    CHAT: '/openai/v1/chat/completions',
    TRANSCRIBE: '/openai/v1/audio/transcriptions',
  },
} as const

// Platform Export Specifications
export const PLATFORM_SPECS = {
  youtube_shorts: {
    maxDuration: 60,
    aspectRatio: '9:16',
    resolution: '1080x1920',
    format: 'mp4',
    codec: 'h264',
  },
  tiktok: {
    maxDuration: 180,
    aspectRatio: '9:16',
    resolution: '1080x1920',
    format: 'mp4',
    codec: 'h264',
  },
  twitter: {
    maxDuration: 140,
    aspectRatio: '16:9',
    resolution: '1280x720',
    format: 'mp4',
    codec: 'h264',
  },
  instagram_reels: {
    maxDuration: 90,
    aspectRatio: '9:16',
    resolution: '1080x1920',
    format: 'mp4',
    codec: 'h264',
  },
} as const

// Error Messages
export const ERROR_MESSAGES = {
  RECORDING: {
    NO_VIDEO_ELEMENT: 'No video element found on the page',
    PERMISSION_DENIED: 'Permission to record was denied',
    STREAM_ENDED: 'The video stream has ended',
    QUOTA_EXCEEDED: 'Storage quota exceeded',
  },
  NETWORK: {
    OFFLINE: 'You are currently offline',
    UPLOAD_FAILED: 'Failed to upload chunk',
    API_ERROR: 'API request failed',
  },
  AUTH: {
    UNAUTHORIZED: 'You must be logged in',
    SESSION_EXPIRED: 'Your session has expired',
  },
} as const

// Feature Flags (can be overridden by env vars)
export const FEATURES = {
  ENABLE_WASM_WHISPER: true,
  ENABLE_ACTIVITY_DETECTION: true,
  ENABLE_EXTENDED_CONTEXT: true,
  ENABLE_AUTO_EXPORT: false,
  ENABLE_TEAM_FEATURES: false,
} as const
