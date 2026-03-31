import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/client';
import type { Analytics } from '../types';
import { BarChart3, Users, Package, RefreshCw, Box } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      }
    };
    if (user?.role === 'ADMIN') {
      fetchAnalytics();
    }
  }, [user]);

  const triggerImport = async () => {
    try {
      setImporting(true);
      const res = await api.post('/admin/import');
      toast.success(`Imported ${res.data.count} items!`);
    } catch (e: any) {
      toast.error('Import failed. Make sure genz.csv exists.');
    } finally {
      setImporting(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="pt-40 text-center text-red-500 font-black text-3xl uppercase italic tracking-tighter">
        ACCESS DENIED
      </div>
    );
  }

  return (
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
          Admin <span className="text-primary">Ops</span>
        </h1>
        <button 
          onClick={triggerImport} 
          disabled={importing}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${importing ? 'animate-spin' : ''}`} />
          <span>{importing ? 'SYNCING DATA...' : 'MANUAL SYNC'}</span>
        </button>
      </div>

      {analytics && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden">
              <Package className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-primary opacity-10" />
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 italic">Total Products</p>
              <h2 className="text-5xl font-black text-primary italic">{analytics.totalProducts.toLocaleString()}</h2>
            </div>
            <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden">
              <Users className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-secondary opacity-10" />
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 italic">Active Users</p>
              <h2 className="text-5xl font-black text-secondary italic">4,520</h2>
            </div>
            <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden">
              <BarChart3 className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-accent opacity-10" />
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 italic">Alerts Sent</p>
              <h2 className="text-5xl font-black text-accent italic">12.1k</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-3xl border-white/5">
              <h3 className="text-xl font-black italic uppercase tracking-widest mb-6">Trending Brands</h3>
              <div className="space-y-4">
                {['Netplay', 'Levis', 'The Indian Garage Co', 'Superdry'].map((brand, i) => (
                  <div key={i} className="flex justify-between items-center bg-surface p-4 rounded-xl">
                    <span className="font-bold uppercase tracking-widest text-xs italic">{brand}</span>
                    <span className="text-primary font-black italic">#{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-3xl border-white/5">
              <h3 className="text-xl font-black italic uppercase tracking-widest mb-6">Recent System Logs</h3>
              <div className="space-y-4 font-mono text-xs text-gray-400">
                <p><span className="text-primary">[INFO]</span> Cron job executed: Price alerts sent (42 users)</p>
                <p><span className="text-primary">[INFO]</span> Database backup completed successfully</p>
                <p><span className="text-secondary">[WARN]</span> Redis cache memory approaching 80%</p>
                <p><span className="text-primary">[INFO]</span> Admin "aditya" logged in from 192.168.1.5</p>
                <p><span className="text-primary">[INFO]</span> CSV parsing: Processed 10k products in batch #34</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
