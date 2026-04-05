import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/client';
import type { PriceAlert } from '../types';
import { Bell, Trash2, MapPin, User, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/alerts');
        setAlerts(res.data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };
    if (user) fetchAlerts();
  }, [user]);

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await api.delete(`/alerts/${alertId}`);
      setAlerts(alerts.filter(a => a._id !== alertId));
      toast.success('Alert removed');
    } catch {
      toast.error('Failed to remove alert');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass p-6 rounded-3xl text-center border-white/5">
            <div className="w-24 h-24 bg-primary/20 text-primary mx-auto rounded-full flex items-center justify-center mb-4">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-black italic uppercase">{user.name || 'HYPE BEAST'}</h2>
            <p className="text-gray-400 text-xs font-bold uppercase mt-1">{user.email}</p>
          </div>

          <div className="glass rounded-3xl overflow-hidden border-white/5 flex flex-col">
            <button className="w-full text-left px-6 py-4 border-b border-white/5 font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-colors text-primary italic">
              PRICE ALERTS
            </button>
            <button className="w-full text-left px-6 py-4 border-b border-white/5 font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-colors italic">
              ORDER HISTORY
            </button>
            <button className="w-full text-left px-6 py-4 border-b border-white/5 font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-colors italic">
              ADDRESSES
            </button>
            <button onClick={handleLogout} className="w-full text-left px-6 py-4 font-black uppercase text-xs tracking-widest text-red-500 hover:bg-red-500/10 transition-colors flex items-center space-x-2 italic">
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="glass p-8 rounded-3xl border-white/5 h-full">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              Active Alerts
            </h3>

            {alerts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">
                  No price alerts set. Go drop some items you want to track!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert._id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-surface rounded-2xl border border-white/5">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <img src={alert.product?.imageUrl} alt="img" className="w-16 h-16 object-cover rounded-xl" />
                      <div>
                        <h4 className="font-bold uppercase text-xs tracking-widest italic">{alert.product?.brand}</h4>
                        <p className="text-gray-400 text-sm truncate max-w-[200px]">{alert.product?.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-6">
                      <div className="text-center">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">TARGET</p>
                        <p className="text-secondary font-black italic text-lg">₹{alert.targetPrice}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">STATUS</p>
                        <p className={`text-xs font-black uppercase tracking-widest ${alert.triggered ? 'text-primary' : 'text-yellow-500'}`}>
                          {alert.triggered ? 'TRIGGERED' : 'PENDING'}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDeleteAlert(alert._id)}
                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
