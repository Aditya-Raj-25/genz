import { AlertRepository } from '../repositories/AlertRepository';
import { IPriceAlert } from '../models/PriceAlert';

export class AlertService {
  private alertRepo: AlertRepository;

  constructor() {
    this.alertRepo = new AlertRepository();
  }

  async createAlert(userId: string, productId: string, targetPrice: number): Promise<IPriceAlert> {
    return this.alertRepo.create({
      user: userId,
      product: productId,
      targetPrice,
      triggered: false
    });
  }

  async getUserAlerts(userId: string): Promise<IPriceAlert[]> {
    return this.alertRepo.findByUser(userId);
  }

  async deleteAlert(alertId: string): Promise<boolean> {
    return this.alertRepo.delete(alertId);
  }
}
