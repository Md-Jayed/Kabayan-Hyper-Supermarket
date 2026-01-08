
import React from 'react';
import { CartItem, Language } from '../types';
import { I18N } from '../constants';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  lang: Language;
  cart: CartItem[];
  updateQuantity: (id: string, q: number) => void;
  removeFromCart: (id: string) => void;
}

const Cart: React.FC<Props> = ({ lang, cart, updateQuantity, removeFromCart }) => {
  const isRtl = lang === 'ar';
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = subtotal * 0.15; // Included logic for display, but price usually has it

  if (cart.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">{isRtl ? 'سلتك فارغة' : 'Your cart is empty'}</h2>
        <p className="text-gray-500 mb-8">{isRtl ? 'ابدأ بالتسوق لإضافة منتجات رائعة!' : 'Start shopping to add some amazing items!'}</p>
        <Link to="/shop" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700">
          {isRtl ? 'الذهاب للمتجر' : 'Browse Shop'}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Items List */}
      <div className="flex-1 space-y-6">
        <h2 className="text-2xl font-black text-gray-900 mb-8">{I18N.cart[lang]} ({cart.length})</h2>
        {cart.map(item => (
          <div key={item.id} className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex gap-4 md:gap-6 items-center shadow-sm">
            <img src={item.image} className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-xl" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 text-base md:text-lg truncate">{isRtl ? item.nameAr : item.nameEn}</h3>
              <p className="text-sm text-gray-500 mb-3">{item.unit}</p>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-gray-100 rounded-lg border text-gray-600"><Minus size={16} /></button>
                <span className="font-bold text-lg min-w-[20px] text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-gray-100 rounded-lg border text-gray-600"><Plus size={16} /></button>
              </div>
            </div>
            <div className={`text-right ${isRtl ? 'mr-auto' : 'ml-auto'}`}>
              <p className="text-lg font-black text-emerald-700">{(item.price * item.quantity).toFixed(2)} {I18N.sar[lang]}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 mt-2">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="w-full lg:w-96">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
          <h2 className="text-xl font-black mb-6 pb-4 border-b">{I18N.summary[lang]}</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-600">
              <span>{I18N.subtotal[lang]}</span>
              <span className="font-semibold">{subtotal.toFixed(2)} {I18N.sar[lang]}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>{I18N.vat[lang]}</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{isRtl ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
              <span className="text-emerald-600 font-bold uppercase text-xs">{isRtl ? 'مجاناً' : 'Free'}</span>
            </div>
            <div className="pt-4 border-t flex justify-between text-xl font-black text-gray-900">
              <span>{I18N.total[lang]}</span>
              <span>{subtotal.toFixed(2)} {I18N.sar[lang]}</span>
            </div>
          </div>
          <Link to="/checkout" className="w-full bg-emerald-600 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all font-black text-lg">
            {I18N.placeOrder[lang]}
            <ArrowRight size={20} className={isRtl ? 'rotate-180' : ''} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
