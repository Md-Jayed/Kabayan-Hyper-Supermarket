
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import Cart from './pages/Cart.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import Checkout from './pages/Checkout.tsx';
import ThankYou from './pages/ThankYou.tsx';
import { Language, Product, CartItem, CategoryItem } from './types.ts';
import { PRODUCTS as FALLBACK_PRODUCTS } from './constants.tsx';
import { db } from './lib/supabase.ts';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kb_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        db.getProducts(),
        db.getCategories()
      ]);
      
      if (prodRes.data && prodRes.data.length > 0) {
        setProducts(prodRes.data);
      }
      
      if (catRes.data && catRes.data.length > 0) {
        setCategories(catRes.data);
      } else {
        setCategories([
          { id: '1', nameEn: 'Grocery', nameAr: 'بقالة', icon: 'Package' },
          { id: '2', nameEn: 'Frozen', nameAr: 'مجمدات', icon: 'Snowflake' },
          { id: '3', nameEn: 'Delicatessen', nameAr: 'مأكولات جاهزة', icon: 'Utensils' },
          { id: '4', nameEn: 'Roastary', nameAr: 'محمصة', icon: 'Coffee' },
          { id: '5', nameEn: 'Household', nameAr: 'منزليات', icon: 'Home' },
        ]);
      }
    } catch (err) {
      console.error("Database connection failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <Layout 
        lang={lang} 
        setLang={setLang} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        categories={categories}
      >
        <Routes>
          <Route path="/" element={<Home lang={lang} onAddToCart={handleAddToCart} products={products} />} />
          <Route path="/shop" element={<Shop lang={lang} onAddToCart={handleAddToCart} products={products} isLoading={isLoading} categories={categories} />} />
          <Route path="/offers" element={<Shop lang={lang} onAddToCart={handleAddToCart} products={products} isLoading={isLoading} categories={categories} />} />
          <Route path="/product/:id" element={<ProductDetail lang={lang} onAddToCart={handleAddToCart} products={products} />} />
          <Route 
            path="/cart" 
            element={
              <Cart 
                lang={lang} 
                cart={cart} 
                updateQuantity={updateQuantity} 
                removeFromCart={removeFromCart} 
              />
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <Checkout 
                lang={lang} 
                cart={cart} 
                onPlaceOrder={handleClearCart}
              />
            } 
          />
          <Route path="/thank-you" element={<ThankYou lang={lang} />} />
          <Route path="/admin" element={<AdminDashboard globalCategories={categories} onRefresh={fetchData} />} />
          <Route path="/tracking" element={
            <div className="text-center py-20">
              <h1 className="text-3xl font-black mb-4">Track Your Order</h1>
              <p className="text-gray-500 max-w-md mx-auto mb-8">Enter your order ID below to see the current status of your Kabayan shipment in Jeddah.</p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input type="text" placeholder="Order ID (e.g. KB-12345)" className="flex-1 px-4 py-2 border rounded-lg" />
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">Track</button>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
