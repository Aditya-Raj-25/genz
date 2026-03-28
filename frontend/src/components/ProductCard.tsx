import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import type { Product } from '../types';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onWishlistToggle, isWishlisted }) => {
  const discount = Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-surface rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-white/5"
    >
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.description}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-sm font-medium line-clamp-2">{product.description}</p>
        </div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-secondary text-white font-black text-[10px] px-2 py-1 rounded-full uppercase tracking-widest italic animate-pulse">
            -{discount}% OFF
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-primary font-black uppercase text-xs tracking-widest truncate max-w-[70%] italic">
            {product.brand}
          </h3>
          <button 
            onClick={() => onWishlistToggle?.(product._id)}
            className="text-white hover:text-primary transition-colors active:scale-125"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-primary text-primary' : ''}`} />
          </button>
        </div>
        <p className="text-sm font-medium text-gray-300 truncate mb-3">{product.description}</p>
        
        <div className="flex items-baseline space-x-2">
          <span className="text-lg font-black italic">₹{product.discountPrice}</span>
          {product.originalPrice > product.discountPrice && (
            <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
          )}
        </div>
      </div>

      {/* Quick Add Button */}
      <button className="absolute bottom-[72px] right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-primary active:scale-90">
        <Plus className="w-6 h-6" />
      </button>
    </motion.div>
  );
};

export default ProductCard;
