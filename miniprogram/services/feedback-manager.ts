export type FeedbackType =
  | 'tap' | 'select' | 'join' | 'publish' | 'success' | 'error'
  | 'levelUp' | 'pointGain' | 'checkIn' | 'platformSupport' | 'switch'

const strongFeedback = new Set<FeedbackType>(['join', 'publish', 'levelUp', 'pointGain', 'checkIn', 'platformSupport'])

class FeedbackManager {
  private settings: FeedbackSettings = { soundEnabled: true, hapticsEnabled: true, reducedMotion: false }
  private lastTriggered = new Map<FeedbackType, number>()
  private audioContexts = new Set<wx.InnerAudioContext>()
  private pendingActions = new Set<string>()
  private timers = new Set<ReturnType<typeof setTimeout>>()

  configure(settings: FeedbackSettings): void {
    this.settings = { ...settings }
    wx.setStorageSync('feedbackSettings', this.settings)
  }

  getSettings(): FeedbackSettings {
    return { ...this.settings }
  }

  trigger(type: FeedbackType, toast?: string): boolean {
    const now = Date.now()
    if (now - (this.lastTriggered.get(type) ?? 0) < 280) return false
    this.lastTriggered.set(type, now)

    if (this.settings.hapticsEnabled) {
      wx.vibrateShort({ type: strongFeedback.has(type) ? 'medium' : 'light', fail: () => undefined })
    }
    if (this.settings.soundEnabled) this.playSound(strongFeedback.has(type) ? 'strong' : type === 'error' ? 'error' : 'tap')
    if (toast) wx.showToast({ title: toast, icon: type === 'error' ? 'error' : 'none' })
    return true
  }

  acquireAction(key: string): boolean {
    if (this.pendingActions.has(key)) return false
    this.pendingActions.add(key)
    return true
  }

  releaseAction(key: string): void {
    this.pendingActions.delete(key)
  }

  schedule(callback: () => void, delayMs: number): void {
    const timer = setTimeout(() => {
      this.timers.delete(timer)
      callback()
    }, delayMs)
    this.timers.add(timer)
  }

  registerAudio(context: wx.InnerAudioContext): void {
    this.audioContexts.add(context)
  }

  private playSound(name: 'tap' | 'strong' | 'error'): void {
    const context = wx.createInnerAudioContext()
    context.src = `/assets/audio/${name}.wav`
    context.volume = name === 'tap' ? 0.2 : 0.32
    context.onError(() => {
      context.destroy()
      this.audioContexts.delete(context)
    })
    context.onEnded(() => {
      context.destroy()
      this.audioContexts.delete(context)
    })
    this.registerAudio(context)
    context.play()
  }

  release(): void {
    for (const context of this.audioContexts) {
      context.stop()
      context.destroy()
    }
    this.audioContexts.clear()
    for (const timer of this.timers) clearTimeout(timer)
    this.timers.clear()
    this.lastTriggered.clear()
    this.pendingActions.clear()
  }
}

export const feedbackManager = new FeedbackManager()
