import type {
  Activity,
  ActivityView,
  LevelConfig,
  PlatformSupportOrder,
  PointLedgerEntry,
  Registration,
  UserProfile,
} from './types/domain'

export class BusinessRuleError extends Error {
  constructor(
    public readonly code: 'DUPLICATE_REGISTRATION' | 'ACTIVITY_FULL' | 'ACTIVITY_CLOSED' | 'FORBIDDEN' | 'INVALID_AMOUNT' | 'INVALID_STATE' | 'IDEMPOTENCY_CONFLICT',
    message: string,
  ) {
    super(message)
    this.name = 'BusinessRuleError'
  }
}

export function createRegistration(input: {
  activity: Activity
  existing: readonly Registration[]
  userId: string
  message: string
  idempotencyKey: string
  now: string
}): Registration {
  const sameRequest = input.existing.find((item) => item.idempotencyKey === input.idempotencyKey)
  if (sameRequest) {
    if (sameRequest.activityId !== input.activity.id || sameRequest.userId !== input.userId) {
      throw new BusinessRuleError('IDEMPOTENCY_CONFLICT', '请求标识已被其他报名使用')
    }
    return sameRequest
  }
  const existingRegistration = input.existing.find((item) => item.activityId === input.activity.id && item.userId === input.userId)
  if (existingRegistration && existingRegistration.status !== 'cancelled') {
    throw new BusinessRuleError('DUPLICATE_REGISTRATION', '你已经在圈里了')
  }
  if (input.activity.status !== 'published') {
    throw new BusinessRuleError('ACTIVITY_CLOSED', '这场 Cypher 暂停报名')
  }
  if (input.activity.joinMode === 'direct' && input.activity.participantCount >= input.activity.maxParticipants) {
    throw new BusinessRuleError('ACTIVITY_FULL', '这场已满员')
  }
  const nextStatus = input.activity.joinMode === 'direct' ? 'approved' : 'pending'
  if (existingRegistration) {
    const { cancelledAt, cancelledBy, cancelReason, ...registration } = existingRegistration
    return {
      ...registration,
      status: nextStatus,
      message: input.message,
      idempotencyKey: input.idempotencyKey,
      updatedAt: input.now,
      history: [
        ...(existingRegistration.history ?? []),
        { action: 'rejoined', actorId: input.userId, reason: 'user_rejoined', at: input.now },
      ],
    }
  }
  return {
    id: `registration_${input.existing.length + 1}`,
    activityId: input.activity.id,
    userId: input.userId,
    status: nextStatus,
    message: input.message,
    idempotencyKey: input.idempotencyKey,
    createdAt: input.now,
    updatedAt: input.now,
  }
}

export function reviewRegistration(registration: Registration, organizerId: string, activity: Activity, approved: boolean, now: string, allRegistrations: readonly Registration[] = [registration]): Registration {
  if (activity.organizerId !== organizerId) throw new BusinessRuleError('FORBIDDEN', '只有发起者可以审核')
  if (registration.status !== 'pending') throw new BusinessRuleError('INVALID_STATE', '只有待审核报名可以处理')
  if (!['published', 'registration_closed'].includes(activity.status)) throw new BusinessRuleError('ACTIVITY_CLOSED', '活动当前不可审核报名')
  const approvedCount = allRegistrations.filter((item) => item.activityId === activity.id && item.status === 'approved').length
  if (approved && approvedCount >= activity.maxParticipants) throw new BusinessRuleError('ACTIVITY_FULL', '活动已满员，无法继续批准')
  return { ...registration, status: approved ? 'approved' : 'rejected', reviewedBy: organizerId, reviewedAt: now, updatedAt: now }
}

export function cancelActivity(activity: Activity, actorId: string, reason: string, now: string): Activity {
  if (activity.organizerId !== actorId) throw new BusinessRuleError('FORBIDDEN', '只有发起者可以取消活动')
  return { ...activity, status: 'cancelled', cancelledAt: now, cancelledBy: actorId, cancelReason: reason, updatedAt: now }
}

export function projectActivityAddress(activity: Activity, organizer: ActivityView['organizer'], viewer: { id?: string; registrationStatus?: Registration['status'] }): ActivityView {
  const canRead = activity.addressVisibility === 'public' || viewer.id === activity.organizerId || viewer.registrationStatus === 'approved'
  const { address, ...publicActivity } = activity
  return {
    ...publicActivity,
    ...(canRead ? { address } : {}),
    addressHint: canRead ? address : '报名通过后可见详细地址',
    organizer,
  }
}

export function appendPointEntry(input: {
  ledger: readonly PointLedgerEntry[]
  userId: string
  delta: number
  reason: string
  sourceType: PointLedgerEntry['sourceType']
  sourceId: string
  idempotencyKey: string
  now: string
}): { ledger: PointLedgerEntry[]; balance: number } {
  const userEntries = input.ledger.filter((entry) => entry.userId === input.userId)
  const current = userEntries[userEntries.length - 1]?.balanceAfter ?? 0
  const sameRequest = input.ledger.find((entry) => entry.idempotencyKey === input.idempotencyKey)
  if (sameRequest) {
    if (sameRequest.userId !== input.userId) throw new BusinessRuleError('IDEMPOTENCY_CONFLICT', '积分请求标识已被其他用户使用')
    return { ledger: [...input.ledger], balance: current }
  }
  const sameSettlement = input.ledger.find((entry) =>
    entry.userId === input.userId && entry.sourceType === input.sourceType &&
    entry.sourceId === input.sourceId && entry.reason === input.reason,
  )
  if (sameSettlement) return { ledger: [...input.ledger], balance: current }
  const entry: PointLedgerEntry = {
    id: `point_${input.ledger.length + 1}`,
    userId: input.userId,
    delta: input.delta,
    reason: input.reason,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    idempotencyKey: input.idempotencyKey,
    balanceAfter: Math.max(0, current + input.delta),
    createdAt: input.now,
  }
  return { ledger: [...input.ledger, entry], balance: entry.balanceAfter }
}

export function resolveLevel(points: number, levels: readonly LevelConfig[]): LevelConfig {
  const sorted = [...levels].filter((level) => level.enabled).sort((a, b) => b.minPoints - a.minPoints)
  const match = sorted.find((level) => points >= level.minPoints && (level.maxPoints === undefined || points <= level.maxPoints))
  if (!match) throw new Error('No level configuration matches the point balance')
  return match
}

export function createMockSupportOrder(input: {
  existing: readonly PlatformSupportOrder[]
  userId: string
  amountFen: number
  message: string
  anonymous: boolean
  showOnWall: boolean
  idempotencyKey: string
  now: string
}): PlatformSupportOrder {
  const sameRequest = input.existing.find((order) => order.idempotencyKey === input.idempotencyKey)
  if (sameRequest) {
    if (sameRequest.userId !== input.userId) throw new BusinessRuleError('IDEMPOTENCY_CONFLICT', '订单请求标识已被其他用户使用')
    return sameRequest
  }
  if (!Number.isInteger(input.amountFen) || input.amountFen < 100 || input.amountFen > 50000) {
    throw new BusinessRuleError('INVALID_AMOUNT', '请选择 1–500 元的赞助金额')
  }
  return {
    id: `support_${input.existing.length + 1}`,
    orderNo: `MOCK-${String(input.existing.length + 1).padStart(6, '0')}`,
    userId: input.userId,
    amountFen: input.amountFen,
    message: input.message,
    anonymous: input.anonymous,
    showOnWall: input.showOnWall,
    status: 'mock_paid',
    provider: 'mock',
    idempotencyKey: input.idempotencyKey,
    createdAt: input.now,
    updatedAt: input.now,
  }
}

export async function withRetry<T>(operation: () => Promise<T>, options: { retries: number; delayMs?: number }): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= options.retries; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (attempt < options.retries && options.delayMs) await new Promise((resolve) => setTimeout(resolve, options.delayMs))
    }
  }
  throw lastError
}

export function publicUserProfile(user: UserProfile): Omit<UserProfile, 'instagram' | 'douyin' | 'crew'> & { instagram?: string; douyin?: string; crew?: string } {
  const { instagram, douyin, crew, ...profile } = user
  const result: Omit<UserProfile, 'instagram' | 'douyin' | 'crew'> & { instagram?: string; douyin?: string; crew?: string } = profile
  if (user.instagramPublic && instagram) result.instagram = instagram
  if (user.douyinPublic && douyin) result.douyin = douyin
  if (user.crewPublic && crew) result.crew = crew
  return result
}
