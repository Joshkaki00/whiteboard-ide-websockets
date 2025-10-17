/**
 * Analytics Service - Privacy-first event tracking
 * No personal data collected, only usage patterns
 */

type AnalyticsEvent = 
  | 'page_view'
  | 'room_created'
  | 'room_joined'
  | 'problem_selected'
  | 'timer_started'
  | 'whiteboard_used'
  | 'code_written'
  | 'message_sent'
  | 'view_mode_changed'
  | 'feedback_opened'
  | 'feedback_submitted'

interface EventData {
  [key: string]: string | number | boolean
}

class Analytics {
  private enabled: boolean
  private sessionId: string
  private events: Array<{ event: AnalyticsEvent; data?: EventData; timestamp: number }>

  constructor() {
    this.enabled = import.meta.env.PROD // Only track in production
    this.sessionId = this.generateSessionId()
    this.events = []
    
    if (this.enabled) {
      this.trackPageView()
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * Track an event with optional metadata
   */
  track(event: AnalyticsEvent, data?: EventData) {
    if (!this.enabled) {
      console.log('[Analytics - Dev Mode]', event, data)
      return
    }

    const eventData = {
      event,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId
    }

    this.events.push(eventData)

    // Send to backend analytics endpoint
    this.sendToBackend(eventData)

    // Optional: Send to Google Analytics or Plausible
    if (typeof window !== 'undefined' && (window as any).plausible) {
      ;(window as any).plausible(event, { props: data })
    }
  }

  private async sendToBackend(eventData: any) {
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
      await fetch(`${serverUrl}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }

  /**
   * Track page views
   */
  trackPageView() {
    this.track('page_view', {
      path: window.location.pathname,
      referrer: document.referrer
    })
  }

  /**
   * Track room creation
   */
  trackRoomCreated(roomId: string) {
    this.track('room_created', { roomId })
  }

  /**
   * Track room joining
   */
  trackRoomJoined(roomId: string, isCreator: boolean) {
    this.track('room_joined', { roomId, isCreator })
  }

  /**
   * Track problem selection
   */
  trackProblemSelected(problemTitle: string, difficulty: string) {
    this.track('problem_selected', { problemTitle, difficulty })
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature: 'timer' | 'whiteboard' | 'code' | 'chat') {
    const eventMap = {
      timer: 'timer_started' as const,
      whiteboard: 'whiteboard_used' as const,
      code: 'code_written' as const,
      chat: 'message_sent' as const
    }
    this.track(eventMap[feature])
  }

  /**
   * Track view mode changes
   */
  trackViewModeChanged(viewMode: string) {
    this.track('view_mode_changed', { viewMode })
  }

  /**
   * Get session statistics
   */
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      eventCount: this.events.length,
      events: this.events
    }
  }
}

// Singleton instance
export const analytics = new Analytics()

