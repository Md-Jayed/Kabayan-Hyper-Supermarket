
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, MapPin, LayoutDashboard, Menu, X, Trash2, ArrowRight, ChevronDown, Package, Snowflake, Utensils, Coffee, Home as HomeIcon } from 'lucide-react';
import { Language, CartItem, CategoryItem } from '../types';
import { LOGO_URL, I18N } from '../constants';
import LanguageToggle from './LanguageToggle';

interface Props {
  lang: Language;
  setLang: (lang: Language) => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  children: React.ReactNode;
  categories: CategoryItem[];
  user?: any;
}

const Layout: React.FC<Props> = ({ 
  lang, setLang, cart, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen, children, categories, user 
}) => {
  const isRtl = lang === 'ar';
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: I18N.home[lang] },
    { to: '/shop', label: I18N.shop[lang] },
    { to: '/offers', label: I18N.offers[lang] },
    { to: '/tracking', label: I18N.tracking[lang] }
  ];

  const getIcon = (iconName: string = 'Package') => {
    switch (iconName) {
      case 'Package': return <Package size={16} />;
      case 'Snowflake': return <Snowflake size={16} />;
      case 'Utensils': return <Utensils size={16} />;
      case 'Coffee': return <Coffee size={16} />;
      case 'Home': return <HomeIcon size={16} />;
      default: return <Package size={16} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Mini Cart Drawer Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Mini Cart Drawer Panel */}
      <div className={`fixed top-0 bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-full max-w-sm md:max-w-md bg-white z-[101] shadow-2xl transition-transform duration-300 transform ${
        isCartOpen ? 'translate-x-0' : (isRtl ? '-translate-x-full' : 'translate-x-full')
      } flex flex-col`}>
        <div className="p-6 border-b flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} />
            <h2 className="text-xl font-bold uppercase tracking-tight">{I18N.cart[lang]} ({cartCount})</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart size={64} strokeWidth={1} />
              <p className="font-medium">{isRtl ? 'سلتك فارغة حالياً' : 'Your cart is empty'}</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 group">
                <img src={item.image} className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm" alt={item.nameEn} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{isRtl ? item.nameAr : item.nameEn}</h4>
                  <p className="text-xs text-gray-500 mb-2">{item.unit}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-emerald-600 font-bold">-</button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-emerald-600 font-bold">+</button>
                    </div>
                    <span className="font-black text-emerald-700">{(item.price * item.quantity).toFixed(2)} {I18N.sar[lang]}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-gray-50 border-t space-y-4">
            <div className="flex justify-between items-center text-lg font-black text-gray-900">
              <span>{I18N.total[lang]}</span>
              <span>{cartTotal.toFixed(2)} {I18N.sar[lang]}</span>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all"
              >
                {I18N.checkout[lang]} <ArrowRight size={20} className={isRtl ? 'rotate-180' : ''} />
              </button>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-white border-2 border-emerald-600 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
              >
                {I18N.continueShopping[lang]}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top Bar */}
      <div className="bg-emerald-900 text-white text-[11px] md:text-xs py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 opacity-90">
              <MapPin size={14} className="text-emerald-300" /> 
              <span className="font-medium">{I18N.jeddahStore[lang]}</span>
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/admin" className="hover:text-emerald-200 flex items-center gap-1.5 transition-colors font-medium">
              <LayoutDashboard size={14} /> 
              <span>{I18N.admin[lang]}</span>
            </Link>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-5 flex items-center justify-between gap-4 md:gap-10">
          <Link to="/" className="shrink-0 transition-transform active:scale-95">
            <img src={LOGO_URL} alt="Kabayan Logo" className="h-10 md:h-14 lg:h-16 w-auto" />
          </Link>

          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <input
                type="text"
                placeholder={I18N.search[lang]}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-sm"
              />
              <Search 
                className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors`} 
                size={18} 
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8 shrink-0">
            <Link to="/login" className="flex flex-col items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-emerald-50 transition-colors">
                <User size={22} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{I18N.login[lang]}</span>
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors group relative"
            >
              <div className="p-2 rounded-full group-hover:bg-emerald-50 transition-colors">
                <ShoppingCart size={22} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{I18N.cart[lang]}</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 md:gap-10 py-1 overflow-x-auto scrollbar-hide">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`relative py-4 text-sm font-bold transition-all hover:text-emerald-600 flex items-center gap-2 whitespace-nowrap ${
                        isActive ? 'text-emerald-700' : 'text-gray-600'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
              
              <div className="relative" ref={categoryMenuRef}>
                <button 
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    isCategoryMenuOpen 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'text-emerald-800 bg-emerald-50 border-emerald-100 hover:bg-emerald-100'
                  }`}
                >
                  <Menu size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">{I18N.categories[lang]}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Categories Dropdown */}
                {isCategoryMenuOpen && (
                  <div className={`absolute top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200 ${isRtl ? 'left-0' : 'right-0'}`}>
                    <div className="p-2 space-y-1">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setIsCategoryMenuOpen(false);
                            navigate(`/shop?category=${cat.nameEn}`);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors group"
                        >
                          <span className="text-gray-400 group-hover:text-emerald-500 transition-colors">
                            {getIcon(cat.icon)}
                          </span>
                          {isRtl ? cat.nameAr : cat.nameEn}
                        </button>
                      ))}
                      <div className="h-px bg-gray-50 my-1 mx-2" />
                      <button
                        onClick={() => {
                          setIsCategoryMenuOpen(false);
                          navigate('/shop');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                      >
                        <Search size={16} />
                        {isRtl ? 'عرض الكل' : 'View All Products'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 border-t border-emerald-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="bg-white inline-block p-2 rounded-xl">
                <img src={LOGO_URL} alt="Kabayan Logo" className="h-14 w-auto object-contain" />
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Jeddah's premier destination for authentic Filipino groceries and international essentials. Quality you can trust, prices you'll love.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">{I18N.categories[lang]}</h4>
              <ul className="space-y-3 text-sm">
                {categories.map(c => (
                  <li key={c.id} onClick={() => navigate(`/shop?category=${c.nameEn}`)} className="hover:text-emerald-500 transition-colors cursor-pointer">{isRtl ? c.nameAr : c.nameEn}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/tracking" className="hover:text-emerald-500 transition-colors">Track Your Order</Link></li>
                <li className="hover:text-emerald-500 transition-colors cursor-pointer">Contact Us</li>
                <li className="hover:text-emerald-500 transition-colors cursor-pointer">Privacy Policy</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Connect</h4>
              <div className="flex flex-col gap-4">
                <p className="text-sm">Get the latest Weekly Super Sales from Kabayan Jeddah.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email" className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm w-full outline-none focus:border-emerald-600" />
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Join</button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-medium tracking-wide">
            <p className="uppercase text-center md:text-left">© 2025 Kabayan Hypermarket Jeddah. Enterprise Secure Checkout Active.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
