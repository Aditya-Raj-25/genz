import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Products from './pages/Products';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#121212',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
            },
            success: {
              iconTheme: {
                primary: '#00FF94',
                secondary: '#000',
              },
            },
          }}
        />
        
        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-4 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
               <span className="text-xl font-black tracking-tighter uppercase italic">
                Gen<span className="text-primary italic">Z</span> Fashion
              </span>
              <p className="text-gray-500 text-xs font-bold mt-2 italic">POWRED BY AJIO DATASET</p>
            </div>
            <div className="flex space-x-8 text-[10px] font-black uppercase tracking-[0.2em] italic text-gray-400">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
              <a href="#" className="hover:text-primary transition-colors">About</a>
            </div>
            <p className="text-[10px] text-gray-600 font-bold italic">© 2026 GENZ FASHION HUB</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
