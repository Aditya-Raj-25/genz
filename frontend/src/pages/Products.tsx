import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import type { Product, ProductResponse } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '1');
  const q = searchParams.get('q') || '';
  const brand = searchParams.get('brand') || '';
  const gender = searchParams.get('gender') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const endpoint = q ? '/products/search' : '/products';
        const res = await api.get<ProductResponse>(endpoint, {
          params: {
            q,
            brand,
            gender,
            page,
            limit: 12
          }
        });
        setProducts(Array.isArray(res.data.products) ? res.data.products : []);
        setTotal(res.data.total || 0);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, page, q, brand, gender]);

  return (
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">
            {q ? `Results for "${q}"` : gender ? `${gender}'s Style` : 'The Discovery'}
          </h1>
          <p className="text-gray-500 font-bold italic uppercase tracking-widest text-[10px]">
             Showing {products.length} of {total} items
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="glass flex items-center space-x-2 px-6 py-3 rounded-full hover:border-primary/50 transition-all font-black uppercase text-[10px] tracking-widest italic">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="glass flex items-center space-x-2 px-6 py-3 rounded-full hover:border-primary/50 transition-all font-black uppercase text-[10px] tracking-widest italic">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Sort By</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-surface-light animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 glass rounded-[40px] border-dashed border-white/10">
          <SearchIcon className="w-16 h-16 mx-auto mb-6 text-gray-700" />
          <h3 className="text-2xl font-black italic uppercase">No drips found</h3>
          <p className="text-gray-500 mt-2 font-medium italic uppercase tracking-widest text-[10px]">Try searching for something else</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {total > 12 && (
            <div className="flex justify-center items-center space-x-4">
              <button 
                disabled={page === 1}
                onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: (page - 1).toString() })}
                className="glass p-4 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="text-sm font-black italic uppercase tracking-widest">
                PAGE {page} <span className="text-gray-600">OF {Math.ceil(total / 12)}</span>
              </div>
              <button 
                disabled={page >= Math.ceil(total / 12)}
                onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: (page + 1).toString() })}
                className="glass p-4 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
