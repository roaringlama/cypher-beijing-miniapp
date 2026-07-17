import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  appendPointEntry,
  BusinessRuleError,
  cancelActivity,
  createMockSupportOrder,
  createRegistration,
  projectActivityAddress,
  resolveLevel,
  reviewRegistration,
  withRetry,
  publicUserProfile,
} from '../miniprogram/shared/business-rules'
import { mockActivities, mockLevels, mockUsers } from '../miniprogram/mocks/data'
import type { Registration } from '../miniprogram/shared/types/domain'

const activity = mockActivities[0]!
const organizer = mockUsers[1]!
const now = '2026-07-15T12:00:00.000Z'

test('duplicate registration is rejected', () => {
  const existing = [createRegistration({ activity, existing: [], userId: 'u1', message: '', idempotencyKey: 'join-1', now })]
  assert.throws(
    () => createRegistration({ activity, existing, userId: 'u1', message: '', idempotencyKey: 'join-2', now }),
    (error: unknown) => error instanceof BusinessRuleError && error.code === 'DUPLICATE_REGISTRATION',
  )
})

test('same registration idempotency key returns the existing result', () => {
  const first = createRegistration({ activity, existing: [], userId: 'u1', message: '', idempotencyKey: 'same', now })
  const second = createRegistration({ activity, existing: [first], userId: 'u1', message: 'changed', idempotencyKey: 'same', now })
  assert.equal(second, first)
})

test('direct join is blocked when full', () => {
  const full = { ...activity, participantCount: activity.maxParticipants }
  assert.throws(
    () => createRegistration({ activity: full, existing: [], userId: 'u1', message: '', idempotencyKey: 'full', now }),
    (error: unknown) => error instanceof BusinessRuleError && error.code === 'ACTIVITY_FULL',
  )
})

test('private address is visible only to organizer or approved participant', () => {
  const organizerSummary = {
    id: organizer.id, dancerName: organizer.dancerName, avatarUrl: organizer.avatarUrl,
    primaryStyle: organizer.primaryStyle, levelId: organizer.levelId,
  }
  const publicView = projectActivityAddress(activity, organizerSummary, { id: 'visitor' })
  const approvedView = projectActivityAddress(activity, organizerSummary, { id: 'member', registrationStatus: 'approved' })
  assert.equal(publicView.address, undefined)
  assert.match(publicView.addressHint, /报名通过后/)
  assert.equal(approvedView.address, activity.address)
  assert.deepEqual(Object.keys(publicView.organizer).sort(), ['avatarUrl', 'dancerName', 'id', 'levelId', 'primaryStyle'])
})

test('only organizer can review a registration', () => {
  const approvalActivity = { ...activity, joinMode: 'approval' as const }
  const registration = createRegistration({ activity: approvalActivity, existing: [], userId: 'u1', message: '', idempotencyKey: 'review', now })
  assert.throws(() => reviewRegistration(registration, 'stranger', approvalActivity, true, now), BusinessRuleError)
  assert.equal(reviewRegistration(registration, approvalActivity.organizerId, approvalActivity, true, now).status, 'approved')
})

test('approval cannot exceed capacity or re-process a completed decision', () => {
  const approvalActivity = { ...activity, joinMode: 'approval' as const, maxParticipants: 1 }
  const pending = createRegistration({ activity: approvalActivity, existing: [], userId: 'u1', message: '', idempotencyKey: 'pending', now })
  const approved = { ...pending, id: 'approved', userId: 'u2', idempotencyKey: 'approved', status: 'approved' as const }
  assert.throws(
    () => reviewRegistration(pending, approvalActivity.organizerId, approvalActivity, true, now, [pending, approved]),
    (error: unknown) => error instanceof BusinessRuleError && error.code === 'ACTIVITY_FULL',
  )
  assert.throws(
    () => reviewRegistration(approved, approvalActivity.organizerId, approvalActivity, true, now, [approved]),
    (error: unknown) => error instanceof BusinessRuleError && error.code === 'INVALID_STATE',
  )
})

test('activity cancellation is auditable and organizer-only', () => {
  assert.throws(() => cancelActivity(activity, 'stranger', 'nope', now), BusinessRuleError)
  const cancelled = cancelActivity(activity, activity.organizerId, '场地临时不可用', now)
  assert.equal(cancelled.status, 'cancelled')
  assert.equal(cancelled.cancelledBy, activity.organizerId)
  assert.equal(cancelled.cancelReason, '场地临时不可用')
})

test('point ledger is idempotent', () => {
  const first = appendPointEntry({ ledger: [], userId: 'u1', delta: 5, reason: '参加活动', sourceType: 'attendance', sourceId: 'a1', idempotencyKey: 'points-a1', now })
  const second = appendPointEntry({ ledger: first.ledger, userId: 'u1', delta: 5, reason: '参加活动', sourceType: 'attendance', sourceId: 'a1', idempotencyKey: 'points-a1', now })
  assert.equal(second.ledger.length, 1)
  assert.equal(second.balance, 5)
})

test('same point source cannot be settled twice with a different request key', () => {
  const first = appendPointEntry({ ledger: [], userId: 'u1', delta: 15, reason: '发起并完成活动', sourceType: 'activity', sourceId: 'a1', idempotencyKey: 'settle-1', now })
  const second = appendPointEntry({ ledger: first.ledger, userId: 'u1', delta: 15, reason: '发起并完成活动', sourceType: 'activity', sourceId: 'a1', idempotencyKey: 'settle-2', now })
  assert.equal(second.ledger.length, 1)
  assert.equal(second.balance, 15)
})

test('delayed point retry returns the current balance instead of an old snapshot', () => {
  const first = appendPointEntry({ ledger: [], userId: 'u1', delta: 5, reason: '参加活动', sourceType: 'attendance', sourceId: 'a1', idempotencyKey: 'old-request', now })
  const later = appendPointEntry({ ledger: first.ledger, userId: 'u1', delta: 15, reason: '发起活动', sourceType: 'activity', sourceId: 'a2', idempotencyKey: 'later-request', now })
  const retry = appendPointEntry({ ledger: later.ledger, userId: 'u1', delta: 5, reason: '参加活动', sourceType: 'attendance', sourceId: 'a1', idempotencyKey: 'old-request', now })
  assert.equal(retry.balance, 20)
  assert.equal(retry.ledger.length, 2)
})

test('negative points never create a negative balance', () => {
  const result = appendPointEntry({ ledger: [], userId: 'u1', delta: -8, reason: '无故缺席', sourceType: 'attendance', sourceId: 'a1', idempotencyKey: 'penalty', now })
  assert.equal(result.balance, 0)
})

test('level upgrades use configuration rather than hard-coded page logic', () => {
  assert.equal(resolveLevel(9, mockLevels).name, 'Feel the Beat')
  assert.equal(resolveLevel(10, mockLevels).name, 'Step In')
  assert.equal(resolveLevel(50, mockLevels).name, 'In the Circle')
  assert.equal(resolveLevel(100, mockLevels).name, 'Groove Keeper')
  assert.equal(resolveLevel(200, mockLevels).name, 'Scene Builder')
})

test('mock support is visibly mock, idempotent, and does not write points', () => {
  const first = createMockSupportOrder({ existing: [], userId: 'u1', amountFen: 500, message: 'keep moving', anonymous: false, showOnWall: true, idempotencyKey: 'support-1', now })
  const second = createMockSupportOrder({ existing: [first], userId: 'u1', amountFen: 1000, message: 'changed', anonymous: true, showOnWall: false, idempotencyKey: 'support-1', now })
  assert.equal(first.provider, 'mock')
  assert.equal(first.status, 'mock_paid')
  assert.equal(second, first)
  assert.equal('points' in first, false)
})

test('idempotency keys cannot leak another user registration or support order', () => {
  const registration = createRegistration({ activity, existing: [], userId: 'u1', message: '', idempotencyKey: 'global-key', now })
  assert.throws(
    () => createRegistration({ activity, existing: [registration], userId: 'u2', message: '', idempotencyKey: 'global-key', now }),
    (error: unknown) => error instanceof BusinessRuleError && error.code === 'IDEMPOTENCY_CONFLICT',
  )
  const order = createMockSupportOrder({ existing: [], userId: 'u1', amountFen: 500, message: '', anonymous: false, showOnWall: false, idempotencyKey: 'order-key', now })
  assert.throws(
    () => createMockSupportOrder({ existing: [order], userId: 'u2', amountFen: 500, message: '', anonymous: false, showOnWall: false, idempotencyKey: 'order-key', now }),
    (error: unknown) => error instanceof BusinessRuleError && error.code === 'IDEMPOTENCY_CONFLICT',
  )
})

test('retry recovers from a transient network failure', async () => {
  let attempts = 0
  const value = await withRetry(async () => {
    attempts += 1
    if (attempts < 2) throw new Error('temporary network failure')
    return 'ok'
  }, { retries: 2 })
  assert.equal(value, 'ok')
  assert.equal(attempts, 2)
})

test('cancelled registration can be re-created with a new request', () => {
  const cancelled: Registration = {
    id: 'old', activityId: activity.id, userId: 'u1', status: 'cancelled', message: '', idempotencyKey: 'old',
    createdAt: now, updatedAt: now, cancelledAt: now,
  }
  const next = createRegistration({ activity, existing: [cancelled], userId: 'u1', message: '', idempotencyKey: 'new', now })
  assert.equal(next.status, 'approved')
  assert.equal(next.id, 'old')
  assert.equal(next.cancelledAt, undefined)
  assert.equal(next.history?.[next.history.length - 1]?.action, 'rejoined')
})

test('social accounts respect per-field profile visibility', () => {
  const profile = publicUserProfile(mockUsers[0]!)
  assert.equal(profile.instagram, 'momo.moves')
  assert.equal(profile.douyin, undefined)
  assert.equal(profile.crew, 'DAYBREAK')
})
