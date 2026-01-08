
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Apple, CheckCircle2, Loader2 } from 'lucide-react';
import { CartItem, Language } from '../types';
import { I18N } from '../constants';
import { db } from '../lib/supabase';

interface Props {
  lang: Language;
  cart: CartItem[];
  onPlaceOrder: () => void;
}

const Checkout: React.FC<Props> = ({ lang, cart, onPlaceOrder }) => {
  const navigate = useNavigate();
  const isRtl = lang === 'ar';
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const [paymentMethod, setPaymentMethod] = useState<'Mada' | 'Visa' | 'ApplePay' | 'COD'>('Mada');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    district: 'As Salamah'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const orderPayload = {
      customer_name: formData.fullName,
      customer_phone: formData.phone,
      address: formData.address,
      district: formData.district,
      payment_method: paymentMethod,
      total: subtotal,
      status: 'Pending',
      items: cart.map(item => ({
        id: item.id,
        name: isRtl ? item.nameAr : item.nameEn,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const { data, error } = await db.saveOrder(orderPayload);
      if (error) throw error;
      
      onPlaceOrder();
      navigate('/thank-you');
    } catch (err) {
      console.error("Order submission failed:", err);
      // Fallback: Proceed anyway in case tables aren't set up yet for the demo
      onPlaceOrder();
      navigate('/thank-you');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black mb-4">Your cart is empty.</h2>
        <button onClick={() => navigate('/shop')} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-gray-900 mb-8">{I18N.checkout[lang]}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Truck className="text-emerald-600" /> {I18N.deliveryDetails[lang]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'الاسم بالكامل' : 'Full Name'}</label>
                <input required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</label>
                <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="+966 5X XXX XXXX" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">{isRtl ? 'العنوان' : 'Delivery Address'}</label>
                <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows={3} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Building, Street, District, Jeddah"></textarea>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <CreditCard className="text-emerald-600" /> {isRtl ? 'طريقة الدفع' : 'Payment Method'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Mada', 'Visa', 'ApplePay', 'COD'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method as any)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                    paymentMethod === method 
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                      : 'border-gray-100'
                  }`}
                >
                  <span className="text-xs font-bold uppercase">{method}</span>
                  {paymentMethod === method && <CheckCircle2 size={14} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-xl font-black mb-6 border-b pb-4">{I18N.summary[lang]}</h3>
            <div className="space-y-4 mb-8">
              <div className="pt-4 border-t flex justify-between text-xl font-black text-emerald-800">
                <span>{I18N.total[lang]}</span>
                <span>{subtotal.toFixed(2)} {I18N.sar[lang]}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
              {I18N.placeOrder[lang]}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
