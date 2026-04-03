import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Heart, Shovel as Share, Bell, ChevronRight, ShieldCheck, Truck, RefreshCcw, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, recRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/products/${id}/recommendations`)
        ]);
        setProduct(prodRes.data);
        setRecommendations(recRes.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePriceAlert = async () => {
    if (!product) return;
    const targetPriceStr = window.prompt(`Current price is ₹${product.discountPrice}. Enter target price to track:`);
    if (!targetPriceStr) return;
    
    const targetPrice = parseInt(targetPriceStr, 10);
    if (isNaN(targetPrice) || targetPrice >= product.discountPrice || targetPrice <= 0) {
      return toast.error('Invalid price. Must be lower than current price.');
    }
    
    try {
      await api.post('/alerts', {
        productId: product._id,
        targetPrice
      });
      toast.success(`Alert set! We'll notify you when price hits ₹${targetPrice}`);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Login to set price alerts');
    }
  };

  if (loading) return (
    <div className="pt-32 flex justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="pt-32 text-center min-h-screen">
      <h2 className="text-2xl font-black italic">PRODUCT NOT FOUND :(</h2>
    </div>
  );

  const discount = Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100);

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-gray-500 mb-8 tracking-widest italic">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span>{product.categoryByGender}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary">{product.brand}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-surface relative">
            <img 
              src={product.imageUrl} 
              alt={product.description} 
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-6 left-6 bg-secondary text-white font-black text-xs px-4 py-2 rounded-full uppercase tracking-widest italic shadow-xl">
                -{discount}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h2 className="text-primary font-black uppercase tracking-[0.2em] text-sm mb-2 italic">
            {product.brand}
          </h2>
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-6 leading-tight">
            {product.description}
          </h1>

          <div className="flex items-center space-x-4 mb-8">
            <span className="text-4xl font-black italic">₹{product.discountPrice}</span>
            {product.originalPrice > product.discountPrice && (
              <span className="text-xl text-gray-500 line-through italic">₹{product.originalPrice}</span>
            )}
          </div>

          <div className="glass p-6 rounded-2xl border-white/5 space-y-4 mb-8">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-xs font-black uppercase text-gray-400">Color</span>
              <span className="text-sm font-bold uppercase italic">{product.color}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-gray-400">Available</span>
              <span className="text-sm font-bold text-primary italic uppercase">In Stock</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a 
              href={product.productUrl} 
              target="_blank" 
              rel="noreferrer"
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5 fill-black" />
              <span>SHOP ON AJIO</span>
            </a>
            <button 
              className="btn-secondary flex-1 flex items-center justify-center space-x-2"
              onClick={() => toast.success('Added to wishlist')}
            >
              <Heart className="w-5 h-5" />
              <span>WISHLIST</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-10">
            <button onClick={handlePriceAlert} className="flex flex-col items-center justify-center p-4 glass rounded-xl hover:border-primary/40 transition-colors hover:text-primary">
              <Bell className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase mt-2 text-white">Price Drop</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 glass rounded-xl hover:border-primary/40 transition-colors">
              <Share className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase mt-2">Share</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 glass rounded-xl hover:border-primary/40 transition-colors">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase mt-2">Genuine</span>
            </button>
          </div>

          {/* Value Props */}
          <div className="space-y-4 text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
            <div className="flex items-center space-x-3">
              <Truck className="w-4 h-4 text-primary" />
              <span>Free Delivery on orders above ₹799</span>
            </div>
            <div className="flex items-center space-x-3">
              <RefreshCcw className="w-4 h-4 text-primary" />
              <span>Easy 15 days returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Items */}
      <section>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10">More Like <span className="text-primary">This</span></h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
