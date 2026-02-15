import { Request, Response } from 'express';
import { WishlistService } from '../services/WishlistService';

export class WishlistController {
  private wishlistService: WishlistService;

  constructor() {
    this.wishlistService = new WishlistService();
  }

  getWishlist = async (req: any, res: Response) => {
    try {
      const items = await this.wishlistService.getWishlist(req.user.userId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  addToWishlist = async (req: any, res: Response) => {
    try {
      const { productId } = req.body;
      const item = await this.wishlistService.addToWishlist(req.user.userId, productId);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  removeFromWishlist = async (req: any, res: Response) => {
    try {
      const { productId } = req.params;
      await this.wishlistService.removeFromWishlist(req.user.userId, productId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
