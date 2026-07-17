import { mockActivities, mockUsers } from '../../mocks/data'
import { feedbackManager } from '../../services/feedback-manager'
import { featureFlagService } from '../../services/feature-flag-service'
import { registrationService } from '../../services/mock-registration-service'
import { BusinessRuleError, projectActivityAddress } from '../../shared/business-rules'

const activity = mockActivities[0]!
const organizer = mockUsers[1]!

function pageActivity(activityId: string) {
  const selected = mockActivities.find((item) => item.id === activityId) ?? activity
  const selectedOrganizer = mockUsers.find((user) => user.id === selected.organizerId) ?? organizer
  const organizerSummary = {
    id: selectedOrganizer.id,
    dancerName: selectedOrganizer.dancerName,
    avatarUrl: selectedOrganizer.avatarUrl,
    primaryStyle: selectedOrganizer.primaryStyle,
    levelId: selectedOrganizer.levelId,
  }
  const start = new Date(selected.startsAt)
  const end = new Date(selected.endsAt)
  const words = selected.title.split(' ')
  const titleBottom = words.pop() ?? selected.title
  return {
    activity: projectActivityAddress(selected, organizerSummary, { id: 'user_momo' }),
    titleTop: words.join(' '),
    titleBottom,
    dateLabel: `${String(start.getMonth() + 1).padStart(2, '0')}.${String(start.getDate()).padStart(2, '0')}`,
    timeLabel: `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}–${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`,
  }
}

const initial = pageActivity(activity.id)

Page({
  data: {
    activity: initial.activity,
    activityId: activity.id,
    titleTop: initial.titleTop,
    titleBottom: initial.titleBottom,
    dateLabel: initial.dateLabel,
    timeLabel: initial.timeLabel,
    joinOpen: false,
    joined: false,
    submitting: false,
    reducedMotion: false,
  },
  onLoad(options: { id?: string }) {
    const selected = pageActivity(options.id ?? activity.id)
    if (!featureFlagService.isEnabled(`activity.${selected.activity.type}`)) {
      feedbackManager.trigger('error', '该活动类型暂未开放')
      return
    }
    this.setData({
      ...selected,
      activityId: selected.activity.id,
      reducedMotion: feedbackManager.getSettings().reducedMotion,
    })
  },
  goBack() {
    feedbackManager.trigger('tap')
    wx.navigateBack()
  },
  toggleJoin() {
    feedbackManager.trigger('tap')
    this.setData({ joinOpen: !this.data.joinOpen })
  },
  async confirmJoin() {
    const actionKey = `join:${this.data.activityId}`
    if (!feedbackManager.acquireAction(actionKey)) return
    this.setData({ submitting: true })
    try {
      const registration = await registrationService.join(
        this.data.activityId,
        'user_momo',
        'Ready to step in.',
        `join:user_momo:${this.data.activityId}`,
      )
      this.setData({ submitting: false, joinOpen: false, joined: true })
      feedbackManager.trigger('join', registration.status === 'approved' ? 'You’re in the circle!' : '报名已提交审核')
    } catch (error) {
      const message = error instanceof BusinessRuleError ? error.message : '报名失败，请稍后重试'
      this.setData({ submitting: false })
      feedbackManager.trigger('error', message)
    } finally {
      feedbackManager.releaseAction(actionKey)
    }
  },
  shareActivity() {
    feedbackManager.trigger('success', '分享卡已准备')
  },
  noop() {},
  onUnload() {
    feedbackManager.release()
  },
})
