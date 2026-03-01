import Wishlist, { IWishlistItem } from '../models/Wishlist';
import { BaseRepository } from './BaseRepository';

export class WishlistRepository extends BaseRepository<IWishlistItem> {
  constructor() {
    super(Wishlist);
  }

  async findByUser(userId: string): Promise<IWishlistItem[]> {
    return this.model.find({ user: userId }).populate('product').exec();
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<IWishlistItem | null> {
    return this.model.findOne({ user: userId, product: productId }).exec();
  }
}
