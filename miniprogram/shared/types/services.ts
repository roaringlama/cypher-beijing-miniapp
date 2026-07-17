import type {
  Activity,
  ActivityView,
  FeatureFlagKey,
  PlatformSupportOrder,
  Registration,
  UserProfile,
} from './domain'

export interface ActivityFilters {
  district?: string
  danceStyle?: string
  beginnerFriendly?: boolean
  query?: string
}

export interface CreateActivityInput extends Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'participantCount' | 'status'> {
  idempotencyKey: string
}

export interface ActivityService {
  list(filters?: ActivityFilters): Promise<ActivityView[]>
  getById(id: string, viewerId?: string): Promise<ActivityView | undefined>
  create(input: CreateActivityInput): Promise<Activity>
  cancel(activityId: string, actorId: string, reason: string): Promise<Activity>
}

export interface RegistrationService {
  join(activityId: string, userId: string, message: string, idempotencyKey: string): Promise<Registration>
  review(registrationId: string, organizerId: string, approved: boolean): Promise<Registration>
  cancel(registrationId: string, userId: string): Promise<Registration>
}

export interface UserService {
  getProfile(userId: string): Promise<UserProfile | undefined>
  updateOwnProfile(userId: string, patch: Partial<UserProfile>): Promise<UserProfile>
}

export interface PointService {
  award(userId: string, delta: number, reason: string, sourceId: string, idempotencyKey: string): Promise<number>
  getBalance(userId: string): Promise<number>
}

export interface FeatureFlagService {
  isEnabled(key: FeatureFlagKey): boolean
}

export interface PlatformSupportPaymentService {
  createOrder(input: {
    userId: string
    amountFen: number
    message: string
    anonymous: boolean
    showOnWall: boolean
    idempotencyKey: string
  }): Promise<PlatformSupportOrder>
  queryOrder(orderNo: string): Promise<PlatformSupportOrder | undefined>
}

export interface ReportService {
  submit(input: { reporterId: string; targetType: 'activity' | 'user'; targetId: string; reason: string; details: string }): Promise<string>
}

