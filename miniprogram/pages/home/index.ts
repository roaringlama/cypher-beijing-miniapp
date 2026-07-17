import { mockActivities } from '../../mocks/data'
import { feedbackManager } from '../../services/feedback-manager'
import { featureFlagService } from '../../services/feature-flag-service'

const filters = ['ALL', 'POPPING', 'LOCKING', 'BEGINNER'] as const
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const

function activityCards(filter: string) {
  return mockActivities
    .filter((activity) => featureFlagService.isEnabled(`activity.${activity.type}`))
    .filter((activity) => {
      if (filter === 'POPPING') return activity.danceStyles.includes('Popping')
      if (filter === 'LOCKING') return activity.danceStyles.includes('Locking')
      if (filter === 'BEGINNER') return activity.beginnerFriendly
      return true
    })
    .map((activity) => {
      const start = new Date(activity.startsAt)
      return {
        ...activity,
        day: String(start.getDate()).padStart(2, '0'),
        month: months[start.getMonth()] ?? '',
        time: `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`,
        spotsLeft: activity.maxParticipants - activity.participantCount,
      }
    })
}

Page({
  data: {
    filters,
    activeFilter: 'ALL',
    activities: activityCards('ALL'),
    reducedMotion: false,
  },
  onShow() {
    this.setData({ reducedMotion: feedbackManager.getSettings().reducedMotion })
  },
  selectFilter(event: { currentTarget: { dataset: { value: string } } }) {
    const value = event.currentTarget.dataset.value
    feedbackManager.trigger('select')
    this.setData({ activeFilter: value, activities: activityCards(value) })
  },
  openActivity(event: { currentTarget: { dataset: { id: string } } }) {
    feedbackManager.trigger('tap')
    wx.navigateTo({ url: `/pages/activity-detail/index?id=${event.currentTarget.dataset.id}` })
  },
  openCreate() {
    if (!featureFlagService.isEnabled('activity.cypher')) {
      feedbackManager.trigger('error', '创建 Cypher 暂未开放')
      return
    }
    feedbackManager.trigger('tap')
    wx.navigateTo({ url: '/pages/create/index' })
  },
  openProfile() {
    feedbackManager.trigger('tap')
    wx.navigateTo({ url: '/pages/profile/index' })
  },
  openSupport() {
    if (!featureFlagService.isEnabled('support.mock')) {
      feedbackManager.trigger('error', '平台支持暂未开放')
      return
    }
    feedbackManager.trigger('tap')
    wx.navigateTo({ url: '/pages/support/index' })
  },
  onUnload() {
    feedbackManager.release()
  },
})
