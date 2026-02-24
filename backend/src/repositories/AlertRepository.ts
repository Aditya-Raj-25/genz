import PriceAlert, { IPriceAlert } from '../models/PriceAlert';
import { BaseRepository } from './BaseRepository';

export class AlertRepository extends BaseRepository<IPriceAlert> {
  constructor() {
    super(PriceAlert);
  }

  async findByUser(userId: string): Promise<IPriceAlert[]> {
    return this.model.find({ user: userId }).populate('product').exec();
  }

  async findPendingAlerts(): Promise<IPriceAlert[]> {
    return this.model.find({ triggered: false }).populate('product').exec();
  }

  async markAsTriggered(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { triggered: true, triggeredAt: new Date() }).exec();
  }
}
