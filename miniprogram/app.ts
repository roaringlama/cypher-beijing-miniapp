import { feedbackManager } from './services/feedback-manager'

const defaultSettings: FeedbackSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
}

App<MiniProgramAppOptions>({
  globalData: {
    settings: defaultSettings,
  },
  onLaunch() {
    const stored = wx.getStorageSync<Partial<FeedbackSettings>>('feedbackSettings')
    const settings = { ...defaultSettings, ...(stored ?? {}) }
    this.globalData.settings = settings
    feedbackManager.configure(settings)
  },
})

