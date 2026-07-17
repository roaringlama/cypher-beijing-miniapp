import type { FeatureFlag, FeatureFlagKey } from '../shared/types/domain'
import type { FeatureFlagService } from '../shared/types/services'

export const defaultFeatureFlags: readonly FeatureFlag[] = [
  { key: 'activity.cypher', enabled: true, description: 'Enable Cypher activities.' },
  { key: 'activity.party', enabled: false, description: 'Reserve Party activities.' },
  { key: 'activity.video', enabled: false, description: 'Reserve video session activities.' },
  { key: 'activity.practice', enabled: false, description: 'Reserve practice activities.' },
  { key: 'support.mock', enabled: true, description: 'Enable visibly marked mock support flow.' },
  { key: 'boost', enabled: false, description: 'Enable activity Boost.' },
  { key: 'waitlist', enabled: false, description: 'Enable activity waitlists.' },
  { key: 'cohost', enabled: false, description: 'Enable co-hosts.' },
]

export class LocalFeatureFlagService implements FeatureFlagService {
  private readonly flags: Map<FeatureFlagKey, boolean>

  constructor(flags: readonly FeatureFlag[] = defaultFeatureFlags) {
    this.flags = new Map(flags.map((flag) => [flag.key, flag.enabled]))
  }

  isEnabled(key: FeatureFlagKey): boolean {
    return this.flags.get(key) ?? false
  }
}

export const featureFlagService = new LocalFeatureFlagService()

