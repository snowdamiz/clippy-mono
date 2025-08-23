import { z } from 'zod'

// User types
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type User = z.infer<typeof UserSchema>

// Recording types
export const RecordingStatusSchema = z.enum([
  'idle',
  'recording',
  'processing',
  'paused',
  'error',
])

export type RecordingStatus = z.infer<typeof RecordingStatusSchema>

export const RecordingSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: RecordingStatusSchema,
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  url: z.string().url(),
  metadata: z.record(z.any()).optional(),
})

export type Recording = z.infer<typeof RecordingSchema>

// Clip types
export const ClipSchema = z.object({
  id: z.string().uuid(),
  recordingId: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.number(),
  endTime: z.number(),
  duration: z.number(),
  thumbnailUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  transcript: z.string().optional(),
  confidence: z.number().min(0).max(1),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Clip = z.infer<typeof ClipSchema>

// Transcript types
export const TranscriptSegmentSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number().optional(),
})

export type TranscriptSegment = z.infer<typeof TranscriptSegmentSchema>

export const TranscriptSchema = z.object({
  id: z.string().uuid(),
  recordingId: z.string().uuid(),
  segments: z.array(TranscriptSegmentSchema),
  fullText: z.string(),
  language: z.string().default('en'),
  createdAt: z.string().datetime(),
})

export type Transcript = z.infer<typeof TranscriptSchema>

// Stream chunk types
export const StreamChunkSchema = z.object({
  id: z.string(),
  recordingId: z.string().uuid(),
  chunkIndex: z.number(),
  timestamp: z.number(),
  duration: z.number(),
  videoBlob: z.instanceof(Blob).optional(),
  audioBlob: z.instanceof(Blob).optional(),
  metadata: z.record(z.any()).optional(),
})

export type StreamChunk = z.infer<typeof StreamChunkSchema>

// AI Detection types
export const DetectionTypeSchema = z.enum([
  'highlight',
  'funny_moment',
  'epic_play',
  'fail',
  'emotional',
  'technical',
  'tutorial',
  'reaction',
  'custom',
])

export type DetectionType = z.infer<typeof DetectionTypeSchema>

export const AIDetectionSchema = z.object({
  id: z.string().uuid(),
  clipId: z.string().uuid(),
  type: DetectionTypeSchema,
  confidence: z.number().min(0).max(1),
  keywords: z.array(z.string()),
  context: z.string().optional(),
  llmResponse: z.record(z.any()).optional(),
})

export type AIDetection = z.infer<typeof AIDetectionSchema>

// Export platform types
export const ExportPlatformSchema = z.enum([
  'youtube_shorts',
  'tiktok',
  'twitter',
  'instagram_reels',
  'twitch',
  'raw',
])

export type ExportPlatform = z.infer<typeof ExportPlatformSchema>

export const ExportSettingsSchema = z.object({
  platform: ExportPlatformSchema,
  resolution: z.string().default('1080p'),
  aspectRatio: z.string().default('16:9'),
  maxDuration: z.number().optional(),
  watermark: z.boolean().default(false),
  captions: z.boolean().default(true),
  format: z.string().default('mp4'),
})

export type ExportSettings = z.infer<typeof ExportSettingsSchema>

// Message types for extension communication
export const ExtensionMessageTypeSchema = z.enum([
  'START_RECORDING',
  'STOP_RECORDING',
  'PAUSE_RECORDING',
  'RESUME_RECORDING',
  'SELECT_ELEMENT',
  'ELEMENT_SELECTED',
  'CHUNK_READY',
  'CLIP_DETECTED',
  'ERROR',
  'STATUS_UPDATE',
])

export type ExtensionMessageType = z.infer<typeof ExtensionMessageTypeSchema>

export const ExtensionMessageSchema = z.object({
  type: ExtensionMessageTypeSchema,
  payload: z.any(),
  timestamp: z.number(),
  tabId: z.number().optional(),
})

export type ExtensionMessage = z.infer<typeof ExtensionMessageSchema>
