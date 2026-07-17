import { mockLevels, mockUsers } from '../../mocks/data'
import { feedbackManager } from '../../services/feedback-manager'
import { featureFlagService } from '../../services/feature-flag-service'
import { resolveLevel } from '../../shared/business-rules'

const profileUser = mockUsers[0]!
const profileLevel = resolveLevel(profileUser.points, mockLevels)
const nextLevel = [...mockLevels].sort((a, b) => a.minPoints - b.minPoints).find((level) => level.minPoints > profileUser.points)
const levelSpan = nextLevel ? nextLevel.minPoints - profileLevel.minPoints : 1
const levelProgress = nextLevel ? Math.round(((profileUser.points - profileLevel.minPoints) / levelSpan) * 100) : 100

Page({
  data: {
    user: profileUser,
    level: profileLevel,
    levelName: profileLevel.name.toUpperCase(),
    nextLevelName: nextLevel?.name ?? 'MAX LEVEL',
    pointsToNext: nextLevel ? nextLevel.minPoints - profileUser.points : 0,
    levelProgress,
    settings: feedbackManager.getSettings(),
  },
  onShow() {
    this.setData({ settings: feedbackManager.getSettings() })
  },
  toggleSetting(event: { currentTarget: { dataset: { key: keyof FeedbackSettings } } }) {
    const key = event.currentTarget.dataset.key
    const settings = { ...this.data.settings, [key]: !this.data.settings[key] }
    feedbackManager.configure(settings)
    feedbackManager.trigger('switch')
    this.setData({ settings })
  },
  openSupport() {
    if (!featureFlagService.isEnabled('support.mock')) {
      feedbackManager.trigger('error', '平台支持暂未开放')
      return
    }
    feedbackManager.trigger('tap')
    wx.navigateTo({ url: '/pages/support/index' })
  },
  openCreate() {
    if (!featureFlagService.isEnabled('activity.cypher')) {
      feedbackManager.trigger('error', '创建 Cypher 暂未开放')
      return
    }
    feedbackManager.trigger('tap')
    wx.navigateTo({ url: '/pages/create/index' })
  },
  goHome() {
    wx.navigateBack()
  },
  copyInstagram() {
    const account = this.data.user.instagram
    if (account) wx.setClipboardData({ data: account, success: () => feedbackManager.trigger('success', 'Instagram 已复制') })
  },
  onUnload() {
    feedbackManager.release()
  },
})
