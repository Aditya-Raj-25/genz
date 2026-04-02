import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const auth = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await auth.login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await auth.register(formData.name, formData.email, formData.password);
        toast.success('Account created!');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-10 rounded-[40px] border-white/10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl rotate-12 mb-6 shadow-2xl shadow-primary/40">
            <Zap className="w-8 h-8 text-black fill-black" />
          </div>
          <h1 className="text-4xl font-black italic uppercase italic tracking-tighter">
            {isLogin ? 'Welcome Back' : 'Join The Vibe'}
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            {isLogin ? 'Ready to find your next fit?' : 'Start curating your GenZ style.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2 italic">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="input-field w-full pl-12"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2 italic">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@vibe.com"
                className="input-field w-full pl-12"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2 italic">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                className="input-field w-full pl-12"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 flex items-center justify-center space-x-2 group"
          >
            <span className="font-black uppercase tracking-widest italic">{isLogin ? 'GET IN' : 'CREATE ACCOUNT'}</span>
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-gray-400 hover:text-primary transition-colors italic"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
