
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, Language } from '../types.ts';
import { I18N, PLACEHOLDER_IMAGE } from '../constants.tsx';
import { ShoppingCart, Heart } from 'lucide-react';

interface Props {
  product: Product;
  lang: Language;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, lang, onAddToCart }) => {
  const isRtl = lang === 'ar';
  const [imgSrc, setImgSrc] = useState(product.image);
  
  const handleImageError = () => {
    if (imgSrc !== PLACEHOLDER_IMAGE) {
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group overflow-hidden flex flex-col h-full">
      <div className="relative bg-gray-50">
        <Link to={`/product/${product.id}`}>
          <img 
            src={imgSrc} 
            alt={isRtl ? product.nameAr : product.nameEn} 
            onError={handleImageError}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {product.isOffer && (
          <div className={`absolute top-2 ${isRtl ? 'right-2' : 'left-2'} bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-md`}>
            {I18N.offers[lang]}
          </div>
        )}
        <button className={`absolute top-2 ${isRtl ? 'left-2' : 'right-2'} p-2 bg-white/80 rounded-full hover:bg-white text-gray-600 transition-colors shadow-sm`}>
          <Heart size={16} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-emerald-600 font-bold mb-1 uppercase tracking-tight">{product.category}</p>
        <Link to={`/product/${product.id}`} className="hover:text-emerald-600 transition-colors">
          <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem] mb-2 leading-tight">
            {isRtl ? product.nameAr : product.nameEn}
          </h3>
        </Link>
        
        <div className="flex items-end gap-2 mb-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-red-600">
              {product.price.toFixed(2)} <span className="text-xs">{I18N.sar[lang]}</span>
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {product.originalPrice.toFixed(2)} {I18N.sar[lang]}
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-500 mb-1">/ {product.unit}</span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors text-sm font-bold shadow-sm active:scale-95"
        >
          <ShoppingCart size={16} />
          {I18N.addToCart[lang]}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
