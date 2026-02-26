import Product, { IProduct } from '../models/Product';
import { BaseRepository } from './BaseRepository';

export interface ProductFilters {
  brand?: string;
  color?: string;
  categoryByGender?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(Product);
  }

  async findWithFilters(filters: ProductFilters, page: number, limit: number): Promise<{ products: IProduct[], total: number }> {
    const query: any = {};

    if (filters.brand) query.brand = new RegExp(filters.brand, 'i');
    if (filters.color) query.color = new RegExp(filters.color, 'i');
    if (filters.categoryByGender) query.categoryByGender = filters.categoryByGender;
    
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.discountPrice = {};
      if (filters.minPrice !== undefined) query.discountPrice.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.discountPrice.$lte = filters.maxPrice;
    }

    const total = await this.model.countDocuments(query);
    const products = await this.model.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return { products, total };
  }

  async search(searchTerm: string, page: number, limit: number): Promise<{ products: IProduct[], total: number }> {
    const query = { $text: { $search: searchTerm } };
    const total = await this.model.countDocuments(query);
    const products = await this.model.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    
    return { products, total };
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
  }

  async upsertMany(products: Partial<IProduct>[]): Promise<void> {
    const operations = products.map(p => ({
      updateOne: {
        filter: { idProduct: p.idProduct },
        update: { $set: p },
        upsert: true
      }
    }));
    await this.model.bulkWrite(operations);
  }

  async findTrending(limit: number): Promise<IProduct[]> {
    return this.model.find()
      .sort({ viewCount: -1 })
      .limit(limit)
      .exec();
  }
}
