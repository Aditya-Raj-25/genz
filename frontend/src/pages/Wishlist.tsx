import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { isAuthenticated } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchWishlist = async () => {
        try {
          const res = await api.get('/wishlist');
          setItems(res.data);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="pt-40 text-center px-4 min-h-screen">
        <Heart className="w-20 h-20 mx-auto mb-8 text-gray-800" />
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Saved Your Faves?</h2>
        <p className="text-gray-500 mb-10 font-bold italic uppercase tracking-widest text-xs">Join the hub to start curating your dream closet.</p>
        <Link to="/login" className="btn-primary inline-flex items-center space-x-2">
          <span>GET STARTED</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-16">
        <div className="inline-flex items-center space-x-2 bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-full mb-6 italic">
          <Sparkles className="w-4 h-4 text-secondary fill-secondary" />
          <span className="text-xs font-black uppercase tracking-widest text-secondary">Your Personal Hub</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">My <span className="text-primary">Stash</span></h1>
        <p className="text-gray-500 mt-4 font-bold italic uppercase tracking-widest text-xs">
          {items.length} items curated by you
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-surface-light animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 glass rounded-[40px] border-dashed border-white/10">
          <Heart className="w-16 h-16 mx-auto mb-6 text-gray-700" />
          <h3 className="text-2xl font-black italic uppercase italic">Your stash is empty</h3>
          <p className="text-gray-500 mt-2 font-medium italic uppercase tracking-widest text-[10px]">Go explore and heart some looks!</p>
          <Link to="/products" className="btn-secondary mt-8 inline-block">START DISCOVERING</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <ProductCard key={item._id} product={item.product} isWishlisted={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
