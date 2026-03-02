import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ProductController } from '../controllers/ProductController';
import { WishlistController } from '../controllers/WishlistController';
import { AdminController } from '../controllers/AdminController';
import { AlertController } from '../controllers/AlertController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

const authController = new AuthController();
const productController = new ProductController();
const wishlistController = new WishlistController();
const adminController = new AdminController();
const alertController = new AlertController();

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authController.logout);

// Product Routes
router.get('/products', productController.getProducts);
router.get('/products/search', productController.searchProducts);
router.get('/products/trending', productController.getTrending);
router.get('/products/:id', productController.getProductById);
router.get('/products/:id/recommendations', productController.getRecommendations);

// Wishlist Routes
router.get('/wishlist', authMiddleware, wishlistController.getWishlist);
router.post('/wishlist', authMiddleware, wishlistController.addToWishlist);
router.delete('/wishlist/:productId', authMiddleware, wishlistController.removeFromWishlist);

// Admin Routes
router.post('/admin/import', authMiddleware, adminController.importProducts);
router.get('/admin/analytics', authMiddleware, adminController.getAnalytics);

// Alert Routes
router.get('/alerts', authMiddleware, alertController.getUserAlerts);
router.post('/alerts', authMiddleware, alertController.createAlert);
router.delete('/alerts/:id', authMiddleware, alertController.deleteAlert);

export default router;
