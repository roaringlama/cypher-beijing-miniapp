declare interface MiniProgramAppOptions {
  globalData: {
    settings: FeedbackSettings
  }
  onLaunch?(): void
}

declare interface FeedbackSettings {
  soundEnabled: boolean
  hapticsEnabled: boolean
  reducedMotion: boolean
}

declare const App: <T extends object>(options: T & ThisType<T>) => void
declare const Page: <T extends object>(options: T & ThisType<T & { setData(data: Record<string, unknown>): void }>) => void
declare const Component: <T extends object>(options: T & ThisType<T>) => void
declare const getApp: <T = MiniProgramAppOptions>() => T
declare function getCurrentPages(): Array<{ route?: string }>

declare namespace wx {
  function getStorageSync<T = unknown>(key: string): T
  function setStorageSync(key: string, value: unknown): void
  function showToast(options: { title: string; icon?: 'success' | 'error' | 'none'; duration?: number }): void
  function vibrateShort(options?: { type?: 'heavy' | 'medium' | 'light'; fail?: () => void }): void
  function navigateTo(options: { url: string }): void
  function switchTab(options: { url: string }): void
  function navigateBack(options?: { delta?: number }): void
  function setClipboardData(options: { data: string; success?: () => void }): void
  function createInnerAudioContext(): InnerAudioContext
  interface InnerAudioContext {
    src: string
    volume: number
    play(): void
    stop(): void
    destroy(): void
    onError(callback: () => void): void
    onEnded(callback: () => void): void
  }
}
