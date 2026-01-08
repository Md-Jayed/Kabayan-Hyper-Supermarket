
import React from 'react';
import { Product, Language } from '../types.ts';
import { I18N } from '../constants.tsx';
import ProductCard from '../components/ProductCard.tsx';
import { ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  lang: Language;
  onAddToCart: (p: Product) => void;
  products: Product[];
}

const Home: React.FC<Props> = ({ lang, onAddToCart, products }) => {
  const isRtl = lang === 'ar';
  const offers = products.filter(p => p.isOffer).slice(0, 8);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-transparent"></div>
        </div>
        <div className={`relative h-full flex flex-col justify-center px-8 md:px-16 text-white max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold mb-4 self-start">
            <Zap size={14} fill="currentColor" />
            {I18N.welcome2026[lang]} {I18N.weeklySale[lang]}
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {isRtl ? 'عروض كبرى بأسعار لا تقبل المنافسة' : 'Big Savings on Your Daily Needs'}
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-md">
            {isRtl ? 'تسوق الآن واحصل على أفضل العروض الأسبوعية في جدة والرياض.' : 'Experience the best of Kabayan Hypermarket in Jeddah. Exclusive deals on fresh groceries and frozen treats.'}
          </p>
          <div className="flex gap-4">
            <Link to="/shop" className="bg-white text-emerald-800 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2">
              {I18N.shop[lang]} <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <ShieldCheck className="text-emerald-600" size={32} />, title: isRtl ? 'دفع آمن ١٠٠٪' : '100% Secure Payment', desc: isRtl ? 'نحن نستخدم أحدث تقنيات التشفير' : 'Mada, Visa, Apple Pay supported' },
          { icon: <Truck className="text-emerald-600" size={32} />, title: isRtl ? 'توصيل سريع' : 'Fast Delivery', desc: isRtl ? 'توصيل في نفس اليوم داخل جدة' : 'Same-day delivery across Jeddah' },
          { icon: <Zap className="text-emerald-600" size={32} />, title: isRtl ? 'عروض يومية' : 'Daily Deals', desc: isRtl ? 'أفضل الأسعار المتاحة يومياً' : 'Unbeatable prices every day' }
        ].map((badge, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
            {badge.icon}
            <div>
              <h4 className="font-bold text-gray-800">{badge.title}</h4>
              <p className="text-xs text-gray-500">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Offers Grid */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">{I18N.weeklySale[lang]}</h2>
            <div className="h-1 w-20 bg-red-500 mt-2"></div>
          </div>
          <Link to="/offers" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
            {isRtl ? 'عرض الكل' : 'View All'} <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {offers.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              lang={lang} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
