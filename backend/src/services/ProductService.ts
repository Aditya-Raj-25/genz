import { ProductRepository, ProductFilters } from '../repositories/ProductRepository';
import { IProduct } from '../models/Product';

export class ProductService {
  private productRepo: ProductRepository;

  constructor() {
    this.productRepo = new ProductRepository();
  }

  async getProducts(filters: ProductFilters, page: number = 1, limit: number = 20) {
    return this.productRepo.findWithFilters(filters, page, limit);
  }

  async getProductById(id: string): Promise<IProduct | null> {
    const product = await this.productRepo.findById(id);
    if (product) {
      await this.productRepo.incrementViewCount(id);
    }
    return product;
  }

  async searchProducts(query: string, page: number = 1, limit: number = 20) {
    return this.productRepo.search(query, page, limit);
  }

  async getTrending(limit: number = 10): Promise<IProduct[]> {
    return this.productRepo.findTrending(limit);
  }

  async getRecommendations(productId: string, limit: number = 4): Promise<IProduct[]> {
    const product = await this.productRepo.findById(productId);
    if (!product) return [];

    // Simple recommendation: same brand or same category
    const recommendations = await this.productRepo.findAll({
      _id: { $ne: product._id },
      $or: [
        { brand: product.brand },
        { categoryByGender: product.categoryByGender }
      ]
    });

    return recommendations.slice(0, limit);
  }
}
