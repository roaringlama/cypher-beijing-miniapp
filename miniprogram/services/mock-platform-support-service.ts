import { createMockSupportOrder } from '../shared/business-rules'
import type { PlatformSupportOrder } from '../shared/types/domain'
import type { PlatformSupportPaymentService } from '../shared/types/services'
import { featureFlagService } from './feature-flag-service'

export class MockPlatformSupportPaymentProvider implements PlatformSupportPaymentService {
  readonly mode = 'TEST_MODE'
  private orders: PlatformSupportOrder[] = []

  async createOrder(input: {
    userId: string
    amountFen: number
    message: string
    anonymous: boolean
    showOnWall: boolean
    idempotencyKey: string
  }): Promise<PlatformSupportOrder> {
    if (!featureFlagService.isEnabled('support.mock')) throw new Error('Mock support is disabled')
    const order = createMockSupportOrder({ ...input, existing: this.orders, now: new Date().toISOString() })
    if (!this.orders.some((item) => item.id === order.id)) this.orders.push(order)
    return order
  }

  async queryOrder(orderNo: string): Promise<PlatformSupportOrder | undefined> {
    return this.orders.find((order) => order.orderNo === orderNo)
  }
}

export const platformSupportPaymentService = new MockPlatformSupportPaymentProvider()
