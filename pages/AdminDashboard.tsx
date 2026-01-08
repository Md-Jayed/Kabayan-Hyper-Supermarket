
import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, ShoppingBag, TrendingUp, DollarSign, Package, Plus, Edit, Trash2, X, Save, Database, Loader2, RefreshCw, AlertCircle, CheckCircle2, Info, Filter, Settings2, Copy, ExternalLink } from 'lucide-react';
import { Product, CategoryItem } from '../types';
import { db } from '../lib/supabase';
import { PRODUCTS as DEFAULT_PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';

interface AdminProps {
  globalCategories: CategoryItem[];
  onRefresh: () => void;
}

const AdminDashboard: React.FC<AdminProps> = ({ globalCategories, onRefresh }) => {
  const [liveStats, setLiveStats] = useState({ orderCount: 0, totalRevenue: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  const [filterCategory, setFilterCategory] = useState<string | 'All'>('All');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isVisible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isVisible: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return filterCategory === 'All' 
      ? products 
      : products.filter(p => p.category === filterCategory);
  }, [products, filterCategory]);

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 5000);
  };

  const fetchData = async () => {
    setIsSyncing(true);
    setDbError(null);
    try {
      const statsRes = await db.getStats();
      const prodRes = await db.getProducts();
      
      setLiveStats(statsRes);
      if (prodRes.error) {
        setDbError(prodRes.error.message);
      } else if (prodRes.data) {
        setProducts(prodRes.data);
      }
    } catch (err: any) {
      setDbError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const executeSeed = async () => {
    setIsSeeding(true);
    setConfirmDialog(prev => ({ ...prev, isVisible: false }));
    try {
      const { error } = await db.seedProducts(DEFAULT_PRODUCTS);
      if (error) {
        showToast(`Seeding Error: ${error.message}`, 'error');
      } else {
        showToast("Initial inventory products seeded successfully!", 'success');
        await fetchData();
        onRefresh();
      }
    } catch (err: any) {
      showToast("System failure: " + err.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const executeSeedCategories = async () => {
    setIsSaving(true);
    try {
      const defaults = [
        { nameEn: 'Grocery', nameAr: 'بقالة', icon: 'Package' },
        { nameEn: 'Frozen', nameAr: 'مجمدات', icon: 'Snowflake' },
        { nameEn: 'Delicatessen', nameAr: 'مأكولات جاهزة', icon: 'Utensils' },
        { nameEn: 'Roastary', nameAr: 'محمصة', icon: 'Coffee' },
        { nameEn: 'Household', nameAr: 'منزليات', icon: 'Home' },
      ];
      const { error } = await db.seedCategories(defaults);
      if (error) {
        if (error.message.includes('not found') || error.message.includes('schema cache')) {
           setIsFixModalOpen(true);
        }
        showToast(`Error: ${error.message}`, 'error');
      } else {
        showToast("Default categories seeded to database!", 'success');
        onRefresh();
      }
    } catch (err: any) {
      showToast("Initialization failed: " + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsSaving(true);
    try {
      const { error } = await db.upsertCategory(editingCategory);
      if (error) {
        if (error.message.includes('not found') || error.message.includes('schema cache')) {
           setIsFixModalOpen(true);
        }
        showToast('Save Error: ' + error.message, 'error');
      } else {
        showToast('Category saved successfully!', 'success');
        setIsCatModalOpen(false);
        onRefresh();
      }
    } catch (err: any) {
      showToast("Error: " + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const executeDelete = async (id: string) => {
    const { error } = await db.deleteProduct(id);
    setConfirmDialog(prev => ({ ...prev, isVisible: false }));
    if (error) {
      showToast('Delete failed: ' + error.message, 'error');
    } else {
      showToast('Product deleted successfully', 'success');
      fetchData();
    }
  };

  const executeCatDelete = async (id: string) => {
    const { error } = await db.deleteCategory(id);
    setConfirmDialog(prev => ({ ...prev, isVisible: false }));
    if (error) {
      showToast('Could not delete: ' + error.message, 'error');
    } else {
      showToast('Category removed successfully', 'success');
      onRefresh();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSaving(true);
    try {
      const { error } = await db.upsertProduct(editingProduct);
      if (error) {
        showToast('Save Error: ' + error.message, 'error');
      } else {
        showToast('Inventory updated successfully', 'success');
        setIsModalOpen(false);
        await fetchData();
      }
    } catch (err: any) {
      showToast("System error: " + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const CATEGORY_SQL = `CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  icon TEXT DEFAULT 'Package'
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON categories FOR DELETE USING (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(CATEGORY_SQL);
    showToast("SQL copied to clipboard!", "success");
  };

  const COLORS = ['#059669', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-8 pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Database Stream</span>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => {
              setConfirmDialog({
                isVisible: true,
                title: 'Seed Products',
                message: 'This will add 10 default items to your product table.',
                onConfirm: executeSeed
              });
            }} 
            disabled={isSeeding}
            className="whitespace-nowrap bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Database size={16} /> Seed Products
          </button>
          <button onClick={() => { setIsCatModalOpen(true); setEditingCategory({ nameEn: '', nameAr: '', icon: 'Package' }); }} className="whitespace-nowrap bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
            <Settings2 size={16} /> Manage Categories
          </button>
          <button onClick={() => { setEditingProduct({ nameEn: '', nameAr: '', price: 0, stock: 0, category: globalCategories[0]?.nameEn || 'Grocery', image: '', unit: 'Each', isOffer: false }); setIsModalOpen(true); }} className="whitespace-nowrap bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {dbError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Database Table Missing</p>
            <p className="text-sm opacity-90 mb-3">{dbError}</p>
            <button 
              onClick={() => setIsFixModalOpen(true)}
              className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Settings2 size={14} /> View SQL Fix
            </button>
          </div>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Revenue', value: `SAR ${liveStats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="text-emerald-600" /> },
          { label: 'Orders', value: liveStats.orderCount.toLocaleString(), icon: <ShoppingBag className="text-blue-600" /> },
          { label: 'Products', value: products.length, icon: <Package className="text-purple-600" /> },
          { label: 'Categories', value: globalCategories.length, icon: <TrendingUp className="text-orange-600" /> }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category List & Distribution */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Categories</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
              {globalCategories.length > 0 ? globalCategories.map((cat, i) => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-none">{cat.nameEn}</p>
                      <p className="text-[10px] text-gray-400" dir="rtl">{cat.nameAr}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingCategory(cat); setIsCatModalOpen(true); }}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => {
                        setConfirmDialog({
                          isVisible: true,
                          title: 'Delete Category',
                          message: `Are you sure you want to remove ${cat.nameEn}?`,
                          isDestructive: true,
                          onConfirm: () => executeCatDelete(cat.id)
                        });
                      }}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                   <p className="text-xs text-gray-400 italic">No categories found in database.</p>
                   <button 
                    onClick={executeSeedCategories}
                    className="mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                   >
                     Initialize Categories
                   </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Inventory Share</h3>
             <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryStats} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                      {categoryStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Product Management Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
            <h3 className="font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Package size={20} className="text-emerald-600" /> Inventory Manager
            </h3>
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200">
              <Filter size={14} className="text-gray-400 ml-2" />
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-[10px] font-black uppercase outline-none bg-transparent"
              >
                <option value="All">All Categories</option>
                {globalCategories.map(c => <option key={c.id} value={c.nameEn}>{c.nameEn}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={product.image} className="w-10 h-10 rounded-lg object-cover border bg-gray-50" alt="" onError={(e) => (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE} />
                      <div>
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{product.nameEn}</p>
                        <p className="text-[10px] text-gray-400" dir="rtl">{product.nameAr}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-[10px] font-black uppercase px-2 py-1 bg-gray-100 text-gray-500 rounded-md">{product.category}</span></td>
                    <td className="px-6 py-4 font-black text-sm text-emerald-700">{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg"><Edit size={16} /></button>
                        <button onClick={() => { setConfirmDialog({ isVisible: true, title: 'Delete Product', message: 'Delete this item?', isDestructive: true, onConfirm: () => executeDelete(product.id) }); }} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Fix Database Modal --- */}
      {isFixModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsFixModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-red-600 p-8 text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/20 rounded-xl">
                    <Database size={24} />
                   </div>
                   <h2 className="text-2xl font-black uppercase tracking-tight">Database Repair Guide</h2>
                </div>
                <button onClick={() => setIsFixModalOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={24} /></button>
              </div>
              <p className="text-red-50 text-sm font-medium leading-relaxed opacity-90">
                It looks like the <b>categories</b> table is missing from your Supabase project. 
                Follow these simple steps to fix it:
              </p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                 <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black shrink-0">1</div>
                    <div>
                      <p className="font-bold text-gray-800">Open Supabase SQL Editor</p>
                      <p className="text-xs text-gray-500">Go to your project dashboard and click on the "SQL Editor" tab.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black shrink-0">2</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">Paste & Run this Script</p>
                      <div className="mt-3 relative group">
                        <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-[10px] overflow-x-auto leading-relaxed border border-slate-800">
                          {CATEGORY_SQL}
                        </pre>
                        <button 
                          onClick={copySql}
                          className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold"
                        >
                          <Copy size={14} /> Copy Code
                        </button>
                      </div>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black shrink-0">3</div>
                    <div>
                      <p className="font-bold text-gray-800">Refresh this Page</p>
                      <p className="text-xs text-gray-500">Once the script executes successfully, come back here and try again.</p>
                    </div>
                 </div>
              </div>

              <div className="pt-4 flex gap-4">
                 <button 
                  onClick={() => setIsFixModalOpen(false)}
                  className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-all"
                 >
                  I'll do it later
                 </button>
                 <a 
                  href="https://supabase.com/dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
                 >
                  Open Supabase <ExternalLink size={18} />
                 </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Rest of the Modals --- */}
      
      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCatModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {editingCategory?.id ? 'Edit Category' : 'New Category'}
                </h2>
                {!editingCategory?.id && (
                  <button 
                    onClick={executeSeedCategories}
                    className="text-[10px] font-black text-emerald-600 flex items-center gap-1 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Database size={12} /> Seed Defaults
                  </button>
                )}
             </div>
             
             <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Name (English)</label>
                  <input required value={editingCategory?.nameEn || ''} onChange={e => setEditingCategory({...editingCategory!, nameEn: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-xl" placeholder="e.g. Beverages" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Name (Arabic)</label>
                  <input required dir="rtl" value={editingCategory?.nameAr || ''} onChange={e => setEditingCategory({...editingCategory!, nameAr: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-xl" placeholder="مثال: مشروبات" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Icon</label>
                  <select value={editingCategory?.icon || 'Package'} onChange={e => setEditingCategory({...editingCategory!, icon: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-xl">
                    <option value="Package">Standard (Box)</option>
                    <option value="Snowflake">Frozen (Snow)</option>
                    <option value="Utensils">Food (Cutlery)</option>
                    <option value="Coffee">Cafe (Coffee)</option>
                    <option value="Home">Home (House)</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="button" onClick={() => setIsCatModalOpen(false)} className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-50 rounded-xl">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-[2] bg-purple-600 text-white py-3 rounded-2xl font-black flex justify-center items-center shadow-lg shadow-purple-100">
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} className="mr-2" />}
                    {editingCategory?.id ? 'Update' : 'Save'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-black uppercase tracking-tight">{editingProduct?.id ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Name (En)</label>
                <input required value={editingProduct?.nameEn || ''} onChange={e => setEditingProduct({...editingProduct!, nameEn: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Name (Ar)</label>
                <input required dir="rtl" value={editingProduct?.nameAr || ''} onChange={e => setEditingProduct({...editingProduct!, nameAr: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price</label>
                <input required type="number" step="0.01" value={editingProduct?.price || ''} onChange={e => setEditingProduct({...editingProduct!, price: Number(e.target.value)})} className="w-full px-4 py-2 bg-gray-50 border rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
                <select value={editingProduct?.category || ''} onChange={e => setEditingProduct({...editingProduct!, category: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-xl">
                  {globalCategories.map(c => <option key={c.id} value={c.nameEn}>{c.nameEn}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Image URL</label>
                <input required value={editingProduct?.image || ''} onChange={e => setEditingProduct({...editingProduct!, image: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-xl" />
              </div>
              <div className="md:col-span-2 flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-gray-400 border rounded-xl">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-[2] bg-emerald-600 text-white py-3 rounded-xl font-black flex justify-center items-center shadow-lg shadow-emerald-50">
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} className="mr-2" />} 
                  {editingProduct?.id ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isVisible && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 animate-in zoom-in">
            <h2 className="text-xl font-black text-center mb-2">{confirmDialog.title}</h2>
            <p className="text-gray-500 text-center text-sm mb-8">{confirmDialog.message}</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDialog({...confirmDialog, isVisible: false})} className="flex-1 py-3 font-bold text-gray-400">Cancel</button>
              <button onClick={confirmDialog.onConfirm} className={`flex-1 py-3 rounded-2xl font-black text-white shadow-xl ${confirmDialog.isDestructive ? 'bg-red-600 shadow-red-100' : 'bg-emerald-600 shadow-emerald-100'}`}>Proceed</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`fixed bottom-8 right-8 z-[500] transition-all transform duration-500 ${toast.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20 min-w-[320px] max-w-md ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <div className="flex-1">
             <p className="font-bold text-sm leading-tight">{toast.message}</p>
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, isVisible: false }))}>
            <X size={16} className="opacity-70 hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
