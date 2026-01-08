
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Language, CategoryItem } from '../types.ts';
import { I18N } from '../constants.tsx';
import ProductCard from '../components/ProductCard.tsx';
import { Filter, ChevronDown, Loader2, X } from 'lucide-react';

interface Props {
  lang: Language;
  onAddToCart: (p: Product) => void;
  products: Product[];
  categories: CategoryItem[];
  isLoading: boolean;
}

const Shop: React.FC<Props> = ({ lang, onAddToCart, products, categories, isLoading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isRtl = lang === 'ar';
  
  const categoryFromUrl = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState<string | 'All'>(categoryFromUrl || 'All');

  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    } else {
      setActiveCategory('All');
    }
  }, [categoryFromUrl]);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleCategoryChange = (catName: string | 'All') => {
    setActiveCategory(catName);
    if (catName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-6 text-emerald-700 font-bold border-b pb-4">
            <Filter size={18} />
            {isRtl ? 'تصفية المنتجات' : 'Filter Products'}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {I18N.categories[lang]}
              </h4>
              {activeCategory !== 'All' && (
                <button 
                  onClick={() => handleCategoryChange('All')}
                  className="text-[10px] font-black text-red-500 hover:text-red-700 flex items-center gap-1 uppercase"
                >
                  <X size={10} /> {isRtl ? 'مسح' : 'Clear'}
                </button>
              )}
            </div>
            
            <button
              onClick={() => handleCategoryChange('All')}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all flex justify-between items-center group ${
                activeCategory === 'All' 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              style={{ textAlign: isRtl ? 'right' : 'left' }}
            >
              {isRtl ? 'الكل' : 'All'}
              <span className={`text-[10px] ${activeCategory === 'All' ? 'text-emerald-100' : 'text-gray-400'}`}>
                {products.length}
              </span>
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.nameEn)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all flex justify-between items-center group ${
                  activeCategory === cat.nameEn
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{ textAlign: isRtl ? 'right' : 'left' }}
              >
                {isRtl ? cat.nameAr : cat.nameEn}
                <span className={`text-[10px] ${activeCategory === cat.nameEn ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {products.filter(p => p.category === cat.nameEn).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Product List */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {activeCategory === 'All' ? I18N.shop[lang] : activeCategory}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-bold">
              {filteredProducts.length} {isRtl ? 'منتجات متوفرة' : 'Products available'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="text-gray-400 font-medium">{isRtl ? 'جاري تحميل المنتجات...' : 'Loading products from database...'}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                lang={lang} 
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center gap-4">
            <Filter size={48} className="text-gray-200" />
            <div className="space-y-1">
               <p className="text-gray-600 font-bold">{isRtl ? 'لا توجد منتجات' : 'No products found'}</p>
               <p className="text-gray-400 text-sm">Try clearing your filters to see more results.</p>
            </div>
            <button 
              onClick={() => handleCategoryChange('All')}
              className="mt-2 text-emerald-600 font-black text-sm uppercase tracking-widest hover:underline"
            >
              {isRtl ? 'عرض كل المنتجات' : 'View All Products'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
