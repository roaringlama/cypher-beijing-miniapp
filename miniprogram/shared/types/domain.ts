export type ActivityType = 'cypher' | 'party' | 'video' | 'practice'
export type ActivityStatus = 'draft' | 'published' | 'registration_closed' | 'cancelled' | 'completed'
export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'removed'
export type JoinMode = 'direct' | 'approval'
export type AddressVisibility = 'public' | 'approved_only'
export type BeijingDistrict =
  | '东城' | '西城' | '朝阳' | '海淀' | '丰台' | '石景山' | '通州' | '昌平' | '大兴' | '顺义' | '其他'

export interface AuditFields {
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface UserStats {
  completedActivities: number
  hostedActivities: number
  noShows: number
}

export interface UserProfile extends AuditFields {
  id: string
  nickname: string
  avatarUrl: string
  dancerName: string
  district: BeijingDistrict
  primaryStyle: string
  otherStyles: string[]
  styleTags: string[]
  danceYears: number
  crew?: string
  bio?: string
  instagram?: string
  douyin?: string
  instagramPublic: boolean
  douyinPublic: boolean
  crewPublic: boolean
  representativeVideo?: string
  points: number
  levelId: string
  stats: UserStats
  badges: string[]
}

export interface Activity extends AuditFields {
  id: string
  type: ActivityType
  organizerId: string
  title: string
  danceStyles: string[]
  styleTags: string[]
  description: string
  musicDirection: string
  startsAt: string
  endsAt: string
  district: BeijingDistrict
  venueName: string
  address: string
  addressVisibility: AddressVisibility
  minParticipants: number
  maxParticipants: number
  participantCount: number
  beginnerFriendly: boolean
  entryRequirements: string
  filming: boolean
  publishVideoAllowed: boolean
  costNote: string
  joinMode: JoinMode
  notes: string[]
  status: ActivityStatus
  coverTone: 'acid' | 'tangerine' | 'ice' | 'violet'
  cancelledAt?: string
  cancelledBy?: string
  cancelReason?: string
}

export interface ActivityView extends Omit<Activity, 'address'> {
  address?: string
  addressHint: string
  organizer: Pick<UserProfile, 'id' | 'dancerName' | 'avatarUrl' | 'primaryStyle' | 'levelId'>
}

export interface Registration extends AuditFields {
  id: string
  activityId: string
  userId: string
  status: RegistrationStatus
  message: string
  idempotencyKey: string
  reviewedBy?: string
  reviewedAt?: string
  cancelledAt?: string
  cancelledBy?: string
  cancelReason?: string
  removedAt?: string
  removedBy?: string
  removeReason?: string
  history?: Array<{
    action: 'cancelled' | 'removed' | 'rejoined'
    actorId: string
    reason: string
    at: string
  }>
}

export interface PointLedgerEntry {
  id: string
  userId: string
  delta: number
  reason: string
  sourceType: 'profile' | 'activity' | 'attendance' | 'reliability' | 'correction'
  sourceId: string
  idempotencyKey: string
  balanceAfter: number
  createdAt: string
}

export interface LevelConfig {
  id: string
  code: string
  name: string
  minPoints: number
  maxPoints?: number
  badge: string
  enabled: boolean
}

export type FeatureFlagKey =
  | 'activity.cypher'
  | 'activity.party'
  | 'activity.video'
  | 'activity.practice'
  | 'support.mock'
  | 'boost'
  | 'waitlist'
  | 'cohost'

export interface FeatureFlag {
  key: FeatureFlagKey
  enabled: boolean
  description: string
}

export type SupportOrderStatus = 'created' | 'mock_paid' | 'paid' | 'failed' | 'closed'

export interface PlatformSupportOrder {
  id: string
  orderNo: string
  userId: string
  amountFen: number
  message: string
  anonymous: boolean
  showOnWall: boolean
  status: SupportOrderStatus
  provider: 'mock' | 'wechat'
  idempotencyKey: string
  createdAt: string
  updatedAt: string
}
