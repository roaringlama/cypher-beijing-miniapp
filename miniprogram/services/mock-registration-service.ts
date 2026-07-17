import { createRegistration, reviewRegistration } from '../shared/business-rules'
import type { Registration } from '../shared/types/domain'
import type { RegistrationService } from '../shared/types/services'
import { mockActivities } from '../mocks/data'

export class MockRegistrationService implements RegistrationService {
  private registrations: Registration[] = []

  async join(activityId: string, userId: string, message: string, idempotencyKey: string): Promise<Registration> {
    const activity = mockActivities.find((item) => item.id === activityId)
    if (!activity) throw new Error('Activity not found')
    const registration = createRegistration({
      activity, existing: this.registrations, userId, message, idempotencyKey, now: new Date().toISOString(),
    })
    const index = this.registrations.findIndex((item) => item.id === registration.id)
    if (index >= 0) this.registrations[index] = registration
    else this.registrations.push(registration)
    return registration
  }

  async review(registrationId: string, organizerId: string, approved: boolean): Promise<Registration> {
    const registration = this.registrations.find((item) => item.id === registrationId)
    if (!registration) throw new Error('Registration not found')
    const activity = mockActivities.find((item) => item.id === registration.activityId)
    if (!activity) throw new Error('Activity not found')
    const reviewed = reviewRegistration(registration, organizerId, activity, approved, new Date().toISOString(), this.registrations)
    this.registrations = this.registrations.map((item) => item.id === reviewed.id ? reviewed : item)
    return reviewed
  }

  async cancel(registrationId: string, userId: string): Promise<Registration> {
    const registration = this.registrations.find((item) => item.id === registrationId)
    if (!registration || registration.userId !== userId) throw new Error('Registration not found')
    const cancelled: Registration = {
      ...registration, status: 'cancelled', cancelledAt: new Date().toISOString(), cancelledBy: userId,
      cancelReason: 'user_cancelled', updatedAt: new Date().toISOString(),
      history: [
        ...(registration.history ?? []),
        { action: 'cancelled', actorId: userId, reason: 'user_cancelled', at: new Date().toISOString() },
      ],
    }
    this.registrations = this.registrations.map((item) => item.id === cancelled.id ? cancelled : item)
    return cancelled
  }
}

export const registrationService = new MockRegistrationService()
