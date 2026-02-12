import { Request, Response } from 'express';
import { AlertService } from '../services/AlertService';

export class AlertController {
  private alertService: AlertService;

  constructor() {
    this.alertService = new AlertService();
  }

  createAlert = async (req: any, res: Response) => {
    try {
      const { productId, targetPrice } = req.body;
      const alert = await this.alertService.createAlert(req.user.userId, productId, targetPrice);
      res.status(201).json(alert);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getUserAlerts = async (req: any, res: Response) => {
    try {
      const alerts = await this.alertService.getUserAlerts(req.user.userId);
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  deleteAlert = async (req: any, res: Response) => {
    try {
      await this.alertService.deleteAlert(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
