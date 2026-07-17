import { feedbackManager } from '../../services/feedback-manager'
import { featureFlagService } from '../../services/feature-flag-service'

const steps = ["VIBE", "WHEN", "WHERE", "WHO", "CHECK"]

Page({
  data: {
    steps,
    step: 0,
    styles: ['Popping', 'Locking', 'Hip-Hop', 'Waacking'],
    selectedStyle: 'Popping',
    tagOptions: [
      { label: 'Funk', selected: true },
      { label: 'Boogaloo', selected: true },
      { label: 'All Level', selected: false },
      { label: 'Beginner Friendly', selected: false },
    ],
    selectedTags: ['Funk', 'Boogaloo'],
    tagsText: 'Funk · Boogaloo',
    title: 'FUNK ON THE ROOF',
    titleLength: 17,
    dateValue: '2026-07-25',
    date: 'SAT · JUL 25',
    startTime: '19:30',
    endTime: '22:00',
    time: '19:30 — 22:00',
    districtOptions: ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区', '昌平区', '大兴区', '顺义区'],
    districtIndex: 2,
    district: '朝阳区',
    venue: '十里堡 · Rooftop Room',
    maxParticipants: 18,
    beginnerFriendly: true,
    approvalRequired: false,
    reducedMotion: false,
    published: false,
    featureEnabled: true,
  },
  onLoad() {
    this.setData({
      reducedMotion: feedbackManager.getSettings().reducedMotion,
      featureEnabled: featureFlagService.isEnabled('activity.cypher'),
    })
  },
  selectStyle(event: { currentTarget: { dataset: { value: string } } }) {
    feedbackManager.trigger('select')
    this.setData({ selectedStyle: event.currentTarget.dataset.value })
  },
  toggleTag(event: { currentTarget: { dataset: { value: string } } }) {
    const value = event.currentTarget.dataset.value
    const alreadySelected = this.data.selectedTags.includes(value)
    if (!alreadySelected && this.data.selectedTags.length >= 3) {
      feedbackManager.trigger('error', '最多选择 3 个标签')
      return
    }
    const selected = alreadySelected
      ? this.data.selectedTags.filter((tag: string) => tag !== value)
      : [...this.data.selectedTags, value]
    feedbackManager.trigger('select')
    this.setData({
      selectedTags: selected,
      tagsText: selected.join(' · '),
      tagOptions: this.data.tagOptions.map((tag: { label: string; selected: boolean }) => ({ ...tag, selected: selected.includes(tag.label) })),
    })
  },
  updateTitle(event: { detail: { value: string } }) {
    this.setData({ title: event.detail.value, titleLength: event.detail.value.length })
  },
  changeDate(event: { detail: { value: string } }) {
    const value = event.detail.value
    const date = new Date(`${value}T00:00:00+08:00`)
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    this.setData({ dateValue: value, date: `${weekdays[date.getDay()]} · ${months[date.getMonth()]} ${date.getDate()}` })
    feedbackManager.trigger('select')
  },
  changeStartTime(event: { detail: { value: string } }) {
    const startTime = event.detail.value
    this.setData({ startTime, time: `${startTime} — ${this.data.endTime}` })
  },
  changeEndTime(event: { detail: { value: string } }) {
    const endTime = event.detail.value
    this.setData({ endTime, time: `${this.data.startTime} — ${endTime}` })
  },
  changeDistrict(event: { detail: { value: number } }) {
    const districtIndex = Number(event.detail.value)
    this.setData({ districtIndex, district: this.data.districtOptions[districtIndex] ?? '朝阳区' })
    feedbackManager.trigger('select')
  },
  updateVenue(event: { detail: { value: string } }) {
    this.setData({ venue: event.detail.value })
  },
  decreaseCapacity() {
    this.setData({ maxParticipants: Math.max(6, this.data.maxParticipants - 1) })
    feedbackManager.trigger('select')
  },
  increaseCapacity() {
    this.setData({ maxParticipants: Math.min(30, this.data.maxParticipants + 1) })
    feedbackManager.trigger('select')
  },
  next() {
    if (!this.data.featureEnabled) {
      feedbackManager.trigger('error', '创建 Cypher 暂未开放')
      return
    }
    feedbackManager.trigger('tap')
    this.setData({ step: Math.min(4, this.data.step + 1) })
  },
  back() {
    if (this.data.step === 0) wx.navigateBack()
    else this.setData({ step: this.data.step - 1 })
    feedbackManager.trigger('tap')
  },
  toggleBeginner() {
    this.setData({ beginnerFriendly: !this.data.beginnerFriendly })
    feedbackManager.trigger('switch')
  },
  toggleApproval() {
    this.setData({ approvalRequired: !this.data.approvalRequired })
    feedbackManager.trigger('switch')
  },
  publish() {
    if (!this.data.featureEnabled) {
      feedbackManager.trigger('error', '创建 Cypher 暂未开放')
      return
    }
    if (!feedbackManager.acquireAction('publish:mock-cypher')) return
    feedbackManager.schedule(() => {
      this.setData({ published: true })
      feedbackManager.releaseAction('publish:mock-cypher')
      feedbackManager.trigger('publish', 'Cypher 已发布（Mock）')
    }, 500)
  },
  finish() {
    wx.navigateBack()
  },
  onUnload() {
    feedbackManager.release()
  },
})
