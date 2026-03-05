import fs from 'fs';
import csv from 'csv-parser';
import { ProductRepository } from '../repositories/ProductRepository';
import { GenderCategory } from '../models/Product';

export class ImportService {
  private productRepo: ProductRepository;

  constructor() {
    this.productRepo = new ProductRepository();
  }

  async importFromCSV(filePath: string): Promise<{ success: boolean; count: number }> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(this.transformRow(data)))
        .on('end', async () => {
          try {
            // Batch upsert in chunks to avoid memory issues
            const batchSize = 1000;
            for (let i = 0; i < results.length; i += batchSize) {
              const batch = results.slice(i, i + batchSize);
              await this.productRepo.upsertMany(batch);
            }
            resolve({ success: true, count: results.length });
          } catch (error) {
            reject(error);
          }
        });
    });
  }

  private transformRow(row: any): any {
    // Column Names: Product_URL,Brand,Description,Id_Product,URL_image,Category_by_gender,Discount Price (in Rs.),Original Price (in Rs.),Color
    const discountPrice = parseFloat(row['Discount Price (in Rs.)']?.replace(/,/g, '') || '0');
    const originalPrice = parseFloat(row['Original Price (in Rs.)']?.replace(/,/g, '') || '0');

    return {
      productUrl: row['Product_URL'],
      brand: row['Brand'],
      description: row['Description'],
      idProduct: row['Id_Product'],
      imageUrl: row['URL_image'],
      categoryByGender: row['Category_by_gender'] === 'Men' ? GenderCategory.MEN : GenderCategory.WOMEN,
      discountPrice,
      originalPrice,
      color: row['Color'] || 'unknown'
    };
  }
}
