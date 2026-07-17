import { feedbackManager } from '../../services/feedback-manager'
import { featureFlagService } from '../../services/feature-flag-service'
import { platformSupportPaymentService } from '../../services/mock-platform-support-service'
import { withRetry } from '../../shared/business-rules'

Page({
  data: {
    amounts: [1, 5, 10, 20],
    selectedAmount: 5,
    message: 'Keep the circle moving! 🪩',
    messageLength: 27,
    customAmountOpen: false,
    anonymous: false,
    showOnWall: true,
    submitting: false,
    success: false,
    orderNo: '',
    reducedMotion: false,
    featureEnabled: true,
  },
  onLoad() {
    this.setData({
      reducedMotion: feedbackManager.getSettings().reducedMotion,
      featureEnabled: featureFlagService.isEnabled('support.mock'),
    })
  },
  goBack() {
    wx.navigateBack()
  },
  selectAmount(event: { currentTarget: { dataset: { value: number } } }) {
    this.setData({ selectedAmount: Number(event.currentTarget.dataset.value), customAmountOpen: false })
    feedbackManager.trigger('select')
  },
  toggleCustomAmount() {
    this.setData({ customAmountOpen: !this.data.customAmountOpen })
    feedbackManager.trigger('select')
  },
  updateCustomAmount(event: { detail: { value: string } }) {
    const amount = Math.max(1, Math.min(500, Number(event.detail.value) || 1))
    this.setData({ selectedAmount: amount })
  },
  updateMessage(event: { detail: { value: string } }) {
    this.setData({ message: event.detail.value, messageLength: event.detail.value.length })
  },
  toggleAnonymous() {
    this.setData({ anonymous: !this.data.anonymous })
    feedbackManager.trigger('switch')
  },
  toggleWall() {
    this.setData({ showOnWall: !this.data.showOnWall })
    feedbackManager.trigger('switch')
  },
  async submitSupport() {
    if (!this.data.featureEnabled) {
      feedbackManager.trigger('error', 'Mock 支持已关闭')
      return
    }
    const actionKey = 'support:create'
    const requestKey = `support:user_momo:${Date.now()}`
    if (!feedbackManager.acquireAction(actionKey)) return
    this.setData({ submitting: true })
    try {
      const order = await withRetry(() => platformSupportPaymentService.createOrder({
        userId: 'user_momo', amountFen: this.data.selectedAmount * 100, message: this.data.message,
        anonymous: this.data.anonymous, showOnWall: this.data.showOnWall, idempotencyKey: requestKey,
      }), { retries: 2, delayMs: 120 })
      this.setData({ submitting: false, success: true, orderNo: order.orderNo })
      feedbackManager.trigger('platformSupport', 'Mock 支持成功')
    } catch {
      this.setData({ submitting: false })
      feedbackManager.trigger('error', '模拟支付失败，请重试')
    } finally {
      feedbackManager.releaseAction(actionKey)
    }
  },
  closeSuccess() {
    this.setData({ success: false })
  },
  onUnload() {
    feedbackManager.release()
  },
})
