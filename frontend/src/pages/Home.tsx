import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, TrendingUp, Sparkles, Heart } from 'lucide-react';

const Home = () => {
  const [trending, setTrending] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, featuredRes] = await Promise.all([
          api.get('/products/trending'),
          api.get('/products?limit=8')
        ]);
        setTrending(trendingRes.data);
        setFeatured(featuredRes.data.products);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-24 pb-12">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden px-4 mb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-6 italic">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="text-xs font-black uppercase tracking-widest">Spring Collection 2026</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] mb-8">
            Own The <span className="text-primary italic">Vibe.</span> <br />
            Define The <span className="text-secondary italic underline decoration-4 underline-offset-8">Trend.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
            Discover 367,000+ curated looks from AJIO. Personalized discovery, 
            price-drop alerts, and the aesthetic you crave.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="btn-primary flex items-center space-x-2 group w-full sm:w-auto justify-center">
              <span>EXPLORE NOW</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/products?gender=Women" className="btn-secondary w-full sm:w-auto justify-center">
              FOR HER
            </Link>
            <Link to="/products?gender=Men" className="btn-secondary w-full sm:w-auto justify-center">
              FOR HIM
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats/Features */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { icon: <TrendingUp className="text-primary" />, label: 'Trending', val: 'Fast-Fashion' },
          { icon: <Sparkles className="text-secondary" />, label: 'Curated', val: 'GenZ Visuals' },
          { icon: <Zap className="text-accent" />, label: 'Smart', val: 'Price Alerts' },
          { icon: <Heart className="text-red-500" />, label: 'Loved', val: '360K+ Items' }
        ].map((item, i) => (
          <div key={i} className="glass p-6 rounded-2xl border-white/5 hover:border-white/20 transition-colors">
            <div className="mb-4">{item.icon}</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{item.label}</p>
            <p className="font-black italic text-lg">{item.val}</p>
          </div>
        ))}
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Hottest Right <span className="text-primary">Now</span></h2>
            <p className="text-gray-500 mt-2 font-medium italic">Most wishlisted by the community</p>
          </div>
          <Link to="/products" className="text-primary font-bold hover:underline flex items-center space-x-1 italic">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="aspect-[3/4] bg-surface-light animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories / Banner */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/products?gender=Women" className="relative h-96 group rounded-3xl overflow-hidden block">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt="Women"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="text-6xl font-black italic uppercase text-white drop-shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Femme</span>
            </div>
          </Link>
          <Link to="/products?gender=Men" className="relative h-96 group rounded-3xl overflow-hidden block">
            <img 
              src="https://images.unsplash.com/photo-1488161628813-244a2ceba245?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt="Men"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="text-6xl font-black italic uppercase text-white drop-shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Homme</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
