
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronLeft, ShieldCheck, Truck, RefreshCw, Plus, Minus } from 'lucide-react';
import { I18N, PLACEHOLDER_IMAGE } from '../constants';
import { Language, Product } from '../types';

interface Props {
  lang: Language;
  onAddToCart: (p: Product, quantity?: number) => void;
  products: Product[];
}

const ProductDetail: React.FC<Props> = ({ lang, onAddToCart, products }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const isRtl = lang === 'ar';

  const product = products.find((p) => p.id === id);
  const [imgSrc, setImgSrc] = useState(product?.image || PLACEHOLDER_IMAGE);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black mb-4">{isRtl ? 'المنتج غير موجود' : 'Product Not Found'}</h2>
        <Link to="/shop" className="text-emerald-600 font-bold hover:underline">
          {isRtl ? 'العودة للمتجر' : 'Return to Shop'}
        </Link>
      </div>
    );
  }

  const handleImageError = () => {
    if (imgSrc !== PLACEHOLDER_IMAGE) {
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <nav className="flex mb-8 text-sm text-gray-500 items-center gap-2">
        <Link to="/" className="hover:text-emerald-600">{I18N.home[lang]}</Link>
        <ChevronLeft size={14} className={isRtl ? 'rotate-180' : ''} />
        <Link to="/shop" className="hover:text-emerald-600">{I18N.shop[lang]}</Link>
        <ChevronLeft size={14} className={isRtl ? 'rotate-180' : ''} />
        <span className="font-semibold text-gray-900 line-clamp-1">{isRtl ? product.nameAr : product.nameEn}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative group">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner flex items-center justify-center">
            <img 
              src={imgSrc} 
              alt={isRtl ? product.nameAr : product.nameEn}
              onError={handleImageError}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          {product.isOffer && (
            <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} bg-red-600 text-white font-black px-4 py-1.5 rounded-full text-sm uppercase shadow-lg animate-pulse`}>
              {I18N.offers[lang]}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-6 pb-6 border-b border-gray-100">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full mb-4 uppercase tracking-widest">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              {isRtl ? product.nameAr : product.nameEn}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-red-600">
                {product.price.toFixed(2)} <span className="text-sm font-bold">{I18N.sar[lang]}</span>
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">{isRtl ? 'وصف المنتج' : 'Product Description'}</h3>
            <p className="text-gray-600 leading-relaxed text-lg italic">{isRtl ? product.descriptionAr : product.descriptionEn}</p>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row gap-4">
            <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-2 justify-between sm:w-40 border">
              <button onClick={handleDecrement} disabled={quantity <= 1} className="p-2 hover:bg-white rounded-xl disabled:opacity-30 transition-colors"><Minus size={20} /></button>
              <span className="text-xl font-black text-emerald-900">{quantity}</span>
              <button onClick={handleIncrement} disabled={quantity >= product.stock} className="p-2 hover:bg-white rounded-xl disabled:opacity-30 transition-colors"><Plus size={20} /></button>
            </div>

            <button
              onClick={() => { onAddToCart(product, quantity); setQuantity(1); }}
              disabled={product.stock === 0}
              className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg hover:bg-emerald-700 transition-all active:scale-[0.98]"
            >
              <ShoppingCart size={24} />
              {I18N.addToCart[lang]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
