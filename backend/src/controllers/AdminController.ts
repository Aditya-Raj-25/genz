import { Request, Response } from 'express';
import { ImportService } from '../services/ImportService';
import path from 'path';

export class AdminController {
  private importService: ImportService;

  constructor() {
    this.importService = new ImportService();
  }

  importProducts = async (req: Request, res: Response) => {
    try {
      const csvPath = path.join(__dirname, '../../../genz.csv');
      const result = await this.importService.importFromCSV(csvPath);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getAnalytics = async (req: Request, res: Response) => {
    // Placeholder for analytics logic
    res.json({
      totalProducts: 367000,
      trendingCategories: ['T-shirts', 'Trousers'],
      topBrands: ['netplay', 'levis']
    });
  }
}
