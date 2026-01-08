
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { Language } from '../types';
import { I18N } from '../constants';

interface Props {
  lang: Language;
}

const ThankYou: React.FC<Props> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const orderId = `KB-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="max-w-3xl mx-auto py-12 text-center">
      <div className="relative inline-block mb-8">
        <div className="bg-emerald-100 p-8 rounded-full">
          <CheckCircle size={80} className="text-emerald-600 animate-bounce" />
        </div>
        <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg">
          <ShoppingBag size={24} className="text-emerald-900" />
        </div>
      </div>

      <h1 className="text-4xl font-black text-gray-900 mb-4">{I18N.thankYou[lang]}</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
        {I18N.orderSuccess[lang]} {isRtl ? 'سنقوم بتوصيل طلبك قريباً إلى باب منزلك في جدة.' : 'Your order is being prepared for delivery in Jeddah.'}
      </p>

      <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm mb-12 max-w-md mx-auto">
        <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{I18N.orderNumber[lang]}</div>
        <div className="text-3xl font-black text-emerald-800 tracking-tighter mb-4">{orderId}</div>
        <div className="h-px bg-emerald-50 w-full mb-4"></div>
        <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-bold">
          <Package size={18} />
          {isRtl ? 'حالة الطلب: قيد المعالجة' : 'Status: Processing'}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/" 
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
        >
          {I18N.home[lang]}
        </Link>
        <Link 
          to="/shop" 
          className="bg-white border-2 border-emerald-600 text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
        >
          {I18N.shop[lang]} <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
        </Link>
      </div>

      <div className="mt-16 text-xs text-gray-400 uppercase font-black tracking-[0.2em]">
        Kabayan Hypermarket Jeddah Online Store
      </div>
    </div>
  );
};

export default ThankYou;
