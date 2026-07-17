import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { LocalFeatureFlagService, defaultFeatureFlags } from '../miniprogram/services/feature-flag-service'

test('Phase 1 exposes Cypher and hides future activity types', () => {
  const service = new LocalFeatureFlagService(defaultFeatureFlags)
  assert.equal(service.isEnabled('activity.cypher'), true)
  assert.equal(service.isEnabled('activity.party'), false)
  assert.equal(service.isEnabled('activity.video'), false)
  assert.equal(service.isEnabled('activity.practice'), false)
})

test('unknown or absent feature flags fail closed', () => {
  const service = new LocalFeatureFlagService([])
  assert.equal(service.isEnabled('boost'), false)
})
