import { WishlistRepository } from '../repositories/WishlistRepository';
import { IWishlistItem } from '../models/Wishlist';

export class WishlistService {
  private wishlistRepo: WishlistRepository;

  constructor() {
    this.wishlistRepo = new WishlistRepository();
  }

  async getWishlist(userId: string): Promise<IWishlistItem[]> {
    return this.wishlistRepo.findByUser(userId);
  }

  async addToWishlist(userId: string, productId: string): Promise<IWishlistItem> {
    const existing = await this.wishlistRepo.findByUserAndProduct(userId, productId);
    if (existing) {
      return existing;
    }
    return this.wishlistRepo.create({ user: userId, product: productId });
  }

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.wishlistRepo.findByUserAndProduct(userId, productId);
    if (!item) return false;
    return this.wishlistRepo.delete(item._id.toString());
  }
}
