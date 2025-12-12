/**
 * WebSocket Service
 *
 * Manages WebSocket connections for real-time presentation sync.
 * Uses native browser WebSocket API with automatic reconnection.
 */

import { QueryClient } from '@tanstack/react-query';
import { getAccessToken } from './tokenManager';
import { Presentation, Slide } from '../../types';
import { WS_BASE_URL } from '../../config';

// WebSocket message types (must match backend)
export type MessageType =
  // Client -> Server
  | 'slide:update'
  | 'slide:create'
  | 'slide:delete'
  | 'slide:reorder'
  | 'presentation:update'
  | 'cursor:move'
  | 'selection:change'
  // Server -> Client
  | 'sync:state'
  | 'sync:ack'
  | 'sync:conflict'
  | 'user:joined'
  | 'user:left'
  | 'error'
  | 'image:generating'
  | 'image:completed'
  | 'image:failed';

export interface WebSocketMessage {
  type: MessageType;
  message_id?: string;
  [key: string]: unknown;
}

export interface SyncStateMessage {
  type: 'sync:state';
  presentation: Record<string, unknown>;
  slides: Record<string, unknown>[];
  active_users: Array<{ user_id: string; name: string | null; avatar_url: string | null }>;
  version: number;
}

export interface SyncAckMessage {
  type: 'sync:ack';
  original_message_id: string;
  success: boolean;
  new_version?: number;
  server_id?: string;
}

export interface SyncConflictMessage {
  type: 'sync:conflict';
  original_message_id: string;
  conflict_type: 'version_mismatch' | 'concurrent_edit' | 'deleted' | 'permission_denied';
  server_state: Record<string, unknown>;
  server_version: number;
}

export interface UserInfo {
  user_id: string;
  name: string | null;
  avatar_url: string | null;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

type MessageHandler = (message: WebSocketMessage) => void;
type StatusHandler = (status: ConnectionStatus) => void;

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_BASE = 1000; // 1 second base, exponential backoff

class WebSocketService {
  private ws: WebSocket | null = null;
  private queryClient: QueryClient | null = null;
  private currentPresentationId: string | null = null;
  private status: ConnectionStatus = 'disconnected';
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private pendingMessages: Map<string, { resolve: (value: unknown) => void; reject: (error: Error) => void }> = new Map();
  // Track pending connection to handle React StrictMode double-mounting
  private pendingConnectionId: string | null = null;

  // Generate unique message ID
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // Set query client for cache updates
  setQueryClient(client: QueryClient): void {
    this.queryClient = client;
  }

  // Get current connection status
  getStatus(): ConnectionStatus {
    return this.status;
  }

  // Subscribe to messages
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  // Subscribe to status changes
  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    // Immediately call with current status
    handler(this.status);
    return () => this.statusHandlers.delete(handler);
  }

  private setStatus(newStatus: ConnectionStatus): void {
    this.status = newStatus;
    this.statusHandlers.forEach(handler => handler(newStatus));
  }

  // Connect to a presentation's WebSocket room
  async connect(presentationId: string): Promise<void> {
    // If already connected to same presentation, do nothing
    if (this.currentPresentationId === presentationId && this.status === 'connected') {
      return;
    }

    // If already connecting to same presentation, wait for that connection
    if (this.pendingConnectionId === presentationId && this.status === 'connecting') {
      return;
    }

    // Disconnect from previous presentation if any (but not if connecting to same one)
    if (this.ws && this.currentPresentationId !== presentationId) {
      this.disconnect();
    }

    const token = getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Generate unique connection ID to track this connection attempt
    const connectionId = this.generateMessageId();
    this.pendingConnectionId = connectionId;
    this.currentPresentationId = presentationId;
    this.setStatus('connecting');

    const url = `${WS_BASE_URL}/api/v1/ws/presentations/${presentationId}?token=${encodeURIComponent(token)}`;

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        // Check if this connection is still wanted (handles React StrictMode)
        if (this.pendingConnectionId !== connectionId) {
          console.log('WebSocket connected but connection was superseded, closing');
          this.ws?.close(1000, 'Connection superseded');
          return;
        }
        this.reconnectAttempts = 0;
        this.setStatus('connected');
        resolve();
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        // Only update status if this is still the active connection
        if (this.pendingConnectionId === connectionId || this.currentPresentationId === presentationId) {
          this.setStatus('disconnected');

          // Attempt reconnection if not intentionally closed
          if (event.code !== 1000 && this.currentPresentationId) {
            this.attemptReconnect();
          }
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (this.status === 'connecting' && this.pendingConnectionId === connectionId) {
          reject(new Error('Failed to connect to WebSocket'));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          this.handleMessage(message);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };
    });
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnected');
      this.ws = null;
    }

    this.currentPresentationId = null;
    this.pendingConnectionId = null;
    this.setStatus('disconnected');
    this.reconnectAttempts = 0;
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log('Max reconnection attempts reached');
      this.setStatus('disconnected');
      return;
    }

    this.reconnectAttempts++;
    this.setStatus('reconnecting');

    const delay = RECONNECT_DELAY_BASE * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      if (this.currentPresentationId) {
        this.connect(this.currentPresentationId).catch(console.error);
      }
    }, delay);
  }

  private handleMessage(message: WebSocketMessage): void {
    // Handle ACK messages for pending operations
    if (message.type === 'sync:ack' || message.type === 'sync:conflict' || message.type === 'error') {
      const originalId = message.original_message_id as string;
      const pending = this.pendingMessages.get(originalId);
      if (pending) {
        this.pendingMessages.delete(originalId);
        if (message.type === 'sync:ack' && (message as unknown as SyncAckMessage).success) {
          pending.resolve(message);
        } else {
          pending.reject(new Error((message as { error_message?: string }).error_message || 'Operation failed'));
        }
      }
    }

    // Update query cache based on message type
    this.updateQueryCache(message);

    // Notify all handlers
    this.messageHandlers.forEach(handler => handler(message));
  }

  private updateQueryCache(message: WebSocketMessage): void {
    if (!this.queryClient || !this.currentPresentationId) return;

    const presentationKey = ['presentation', this.currentPresentationId];

    switch (message.type) {
      case 'sync:state': {
        const syncState = message as unknown as SyncStateMessage;
        // Get existing presentation data to preserve images (WebSocket doesn't send them)
        const existing = this.queryClient.getQueryData<Presentation>(presentationKey);
        // Convert backend format to frontend format, preserving existing images
        const presentation = this.convertPresentationFromBackend(
          syncState.presentation,
          syncState.slides,
          existing?.slides
        );
        this.queryClient.setQueryData(presentationKey, presentation);
        break;
      }

      case 'slide:update': {
        this.queryClient.setQueryData(presentationKey, (old: Presentation | undefined) => {
          if (!old) return old;
          const slideId = message.slide_id as string;
          const changes = message.changes as Record<string, unknown>;
          return {
            ...old,
            slides: old.slides.map(slide =>
              slide.id === slideId
                ? { ...slide, ...this.convertSlideChangesFromBackend(changes) }
                : slide
            ),
          };
        });
        break;
      }

      case 'slide:create': {
        this.queryClient.setQueryData(presentationKey, (old: Presentation | undefined) => {
          if (!old) return old;
          const newSlide = this.convertSlideFromBackend(message.slide as Record<string, unknown>);
          const slides = [...old.slides];
          slides.splice(newSlide.id ? old.slides.findIndex(s => s.id === message.temp_id) : slides.length, 0, newSlide);
          return { ...old, slides };
        });
        break;
      }

      case 'slide:delete': {
        this.queryClient.setQueryData(presentationKey, (old: Presentation | undefined) => {
          if (!old) return old;
          const slideId = message.slide_id as string;
          return {
            ...old,
            slides: old.slides.filter(slide => slide.id !== slideId),
          };
        });
        break;
      }

      case 'slide:reorder': {
        this.queryClient.setQueryData(presentationKey, (old: Presentation | undefined) => {
          if (!old) return old;
          const orders = message.slide_orders as Array<{ slide_id: string; new_position: number }>;
          const slideMap = new Map(old.slides.map(s => [s.id, s]));
          const reorderedSlides = orders
            .sort((a, b) => a.new_position - b.new_position)
            .map(order => slideMap.get(order.slide_id))
            .filter((s): s is Slide => s !== undefined);
          return { ...old, slides: reorderedSlides };
        });
        break;
      }

      case 'presentation:update': {
        this.queryClient.setQueryData(presentationKey, (old: Presentation | undefined) => {
          if (!old) return old;
          const changes = message.changes as Record<string, unknown>;
          return { ...old, ...this.convertPresentationChangesFromBackend(changes) };
        });
        break;
      }

      case 'image:completed': {
        this.queryClient.setQueryData(presentationKey, (old: Presentation | undefined) => {
          if (!old) return old;
          const slideId = message.slide_id as string;
          const imageUrl = message.image_url as string;
          return {
            ...old,
            slides: old.slides.map(slide =>
              slide.id === slideId
                ? { ...slide, imageUrl, isImageLoading: false }
                : slide
            ),
          };
        });
        break;
      }

      case 'image:generating': {
        this.queryClient.setQueryData(presentationKey, (old: Presentation | undefined) => {
          if (!old) return old;
          const slideId = message.slide_id as string;
          return {
            ...old,
            slides: old.slides.map(slide =>
              slide.id === slideId
                ? { ...slide, isImageLoading: true }
                : slide
            ),
          };
        });
        break;
      }

      case 'image:failed': {
        this.queryClient.setQueryData(presentationKey, (old: Presentation | undefined) => {
          if (!old) return old;
          const slideId = message.slide_id as string;
          const error = message.error as string;
          return {
            ...old,
            slides: old.slides.map(slide =>
              slide.id === slideId
                ? { ...slide, isImageLoading: false, imageError: error }
                : slide
            ),
          };
        });
        break;
      }
    }
  }

  // Send a message and wait for ACK
  async send(message: Omit<WebSocketMessage, 'message_id'>): Promise<unknown> {
    if (!this.ws || this.status !== 'connected') {
      throw new Error('WebSocket not connected');
    }

    const messageId = this.generateMessageId();
    const fullMessage = { ...message, message_id: messageId };

    return new Promise((resolve, reject) => {
      // Set timeout for ACK
      const timeout = setTimeout(() => {
        this.pendingMessages.delete(messageId);
        reject(new Error('Operation timed out'));
      }, 10000);

      this.pendingMessages.set(messageId, {
        resolve: (value) => {
          clearTimeout(timeout);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
      });

      this.ws!.send(JSON.stringify(fullMessage));
    });
  }

  // Fire-and-forget send (for cursor/selection updates)
  sendNoAck(message: Omit<WebSocketMessage, 'message_id'>): void {
    if (!this.ws || this.status !== 'connected') {
      return;
    }

    const messageId = this.generateMessageId();
    const fullMessage = { ...message, message_id: messageId };
    this.ws.send(JSON.stringify(fullMessage));
  }

  // Conversion helpers (backend snake_case -> frontend camelCase)
  // Note: WebSocket sync excludes image_url to avoid large payloads.
  // The frontend should retain existing images or fetch via REST API.
  private convertSlideFromBackend(slide: Record<string, unknown>, existingSlide?: Slide): Slide {
    return {
      id: slide.id as string,
      title: (slide.title as string) || '',
      content: (slide.content as string[]) || [],
      speakerNotes: (slide.speaker_notes as string) || '',
      imagePrompt: (slide.image_prompt as string) || '',
      // Preserve existing image if WebSocket doesn't provide one (it sends has_image instead)
      imageUrl: slide.image_url as string | undefined || existingSlide?.imageUrl,
      isImageLoading: false,
      layoutType: (slide.layout_type as Slide['layoutType']) || 'split',
      alignment: (slide.alignment as Slide['alignment']) || 'left',
      fontScale: slide.font_scale as Slide['fontScale'],
      layoutVariant: slide.layout_variant as Slide['layoutVariant'],
      textStyles: (slide.style_overrides as Record<string, unknown>)?.textStyles as Slide['textStyles'],
      imageStyles: (slide.style_overrides as Record<string, unknown>)?.imageStyles as Slide['imageStyles'],
      contentItemStyles: (slide.style_overrides as Record<string, unknown>)?.contentItemStyles as Slide['contentItemStyles'],
    };
  }

  private convertSlideChangesFromBackend(changes: Record<string, unknown>): Partial<Slide> {
    const result: Partial<Slide> = {};
    if (changes.title !== undefined) result.title = changes.title as string;
    if (changes.content !== undefined) result.content = changes.content as string[];
    if (changes.speaker_notes !== undefined) result.speakerNotes = changes.speaker_notes as string;
    if (changes.image_prompt !== undefined) result.imagePrompt = changes.image_prompt as string;
    if (changes.image_url !== undefined) result.imageUrl = changes.image_url as string;
    if (changes.layout_type !== undefined) result.layoutType = changes.layout_type as Slide['layoutType'];
    if (changes.alignment !== undefined) result.alignment = changes.alignment as Slide['alignment'];
    if (changes.font_scale !== undefined) result.fontScale = changes.font_scale as Slide['fontScale'];
    if (changes.layout_variant !== undefined) result.layoutVariant = changes.layout_variant as Slide['layoutVariant'];
    return result;
  }

  private convertPresentationFromBackend(
    presentation: Record<string, unknown>,
    slides: Record<string, unknown>[],
    existingSlides?: Slide[]
  ): Presentation {
    // Create a map of existing slides by ID for quick lookup
    const existingSlideMap = new Map(existingSlides?.map(s => [s.id, s]) || []);

    return {
      id: presentation.id as string,
      topic: presentation.topic as string,
      themeId: (presentation.theme_id as string) || 'neoBrutalist',
      visualStyle: (presentation.visual_style as string) || '',
      wabiSabiLayout: presentation.wabi_sabi_layout as string | undefined,
      lastModified: new Date(presentation.updated_at as string).getTime(),
      slides: slides.map(s => {
        const existingSlide = existingSlideMap.get(s.id as string);
        return this.convertSlideFromBackend(s, existingSlide);
      }),
      analytics: [],
    };
  }

  private convertPresentationChangesFromBackend(changes: Record<string, unknown>): Partial<Presentation> {
    const result: Partial<Presentation> = {};
    if (changes.topic !== undefined) result.topic = changes.topic as string;
    if (changes.theme_id !== undefined) result.themeId = changes.theme_id as string;
    if (changes.visual_style !== undefined) result.visualStyle = changes.visual_style as string;
    if (changes.wabi_sabi_layout !== undefined) result.wabiSabiLayout = changes.wabi_sabi_layout as string;
    return result;
  }
}

// Singleton instance
export const wsService = new WebSocketService();

export default wsService;
