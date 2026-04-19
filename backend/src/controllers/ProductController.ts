import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getProducts = async (req: Request, res: Response) => {
    try {
      const { brand, color, gender, minPrice, maxPrice, page, limit } = req.query;
      const filters = {
        brand: brand as string,
        color: color as string,
        categoryByGender: gender as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined
      };
      
      const result = await this.productService.getProducts(
        filters,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getProductById = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(req.params.id as string);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  searchProducts = async (req: Request, res: Response) => {
    try {
      const { q, page, limit } = req.query;
      const result = await this.productService.searchProducts(
        q as string,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getTrending = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getTrending();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRecommendations = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getRecommendations(req.params.id as string);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
