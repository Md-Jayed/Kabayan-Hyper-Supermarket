
import { createClient } from '@supabase/supabase-js';
import { Product, CategoryItem } from '../types';

const supabaseUrl = 'https://pddvhrwknkdujdeluzfc.supabase.co';
const supabaseKey = 'sb_publishable_UyGbfJ1_uokRwhQXeVUU-g_N8c11SMz';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const db = {
  getProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error("Supabase Fetch Error:", error);
        return { data: null, error };
      }

      const mappedData: Product[] = (data || []).map((p: any) => ({
        id: String(p.id),
        nameEn: p.name_en || '',
        nameAr: p.name_ar || '',
        price: Number(p.price) || 0,
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        category: p.category || 'Grocery',
        image: p.image || '',
        unit: p.unit || 'Each',
        stock: Number(p.stock) || 0,
        isOffer: Boolean(p.is_offer),
        descriptionEn: p.description_en || '',
        descriptionAr: p.description_ar || '',
      }));

      return { data: mappedData, error: null };
    } catch (err: any) {
      console.error("System Fetch Error:", err);
      return { data: null, error: err };
    }
  },

  upsertProduct: async (product: Partial<Product>) => {
    const payload: any = {
      name_en: product.nameEn || '',
      name_ar: product.nameAr || '',
      price: Number(product.price) || 0,
      original_price: product.originalPrice ? Number(product.originalPrice) : null,
      category: product.category || 'Grocery',
      image: product.image || '',
      unit: product.unit || 'Each',
      stock: Number(product.stock) || 0,
      is_offer: !!product.isOffer,
      description_en: product.descriptionEn || '',
      description_ar: product.descriptionAr || '',
    };

    // Use a more robust check for update vs insert (Presence of ID)
    if (product.id) {
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id)
        .select();
      return { data, error };
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select();
      return { data, error };
    }
  },

  seedProducts: async (products: Product[]) => {
    const payloads = products.map(p => ({
      name_en: p.nameEn || '',
      name_ar: p.nameAr || '',
      price: Number(p.price) || 0,
      original_price: p.originalPrice ? Number(p.originalPrice) : null,
      category: p.category || 'Grocery',
      image: p.image || '',
      unit: p.unit || 'Each',
      stock: Number(p.stock) || 0,
      is_offer: !!p.isOffer,
      description_en: p.descriptionEn || '',
      description_ar: p.descriptionAr || '',
    }));

    const { data, error } = await supabase
      .from('products')
      .insert(payloads)
      .select();
    
    return { data, error };
  },

  deleteProduct: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    return { error };
  },

  // --- Category Methods ---
  
  getCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) return { data: null, error };

      const mappedData: CategoryItem[] = (data || []).map((c: any) => ({
        id: String(c.id),
        nameEn: c.name_en || '',
        nameAr: c.name_ar || '',
        icon: c.icon || 'Package'
      }));

      return { data: mappedData, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  upsertCategory: async (category: Partial<CategoryItem>) => {
    const payload = {
      name_en: category.nameEn,
      name_ar: category.nameAr,
      icon: category.icon || 'Package'
    };

    if (category.id) {
      return await supabase.from('categories').update(payload).eq('id', category.id).select();
    } else {
      return await supabase.from('categories').insert([payload]).select();
    }
  },

  seedCategories: async (categories: Partial<CategoryItem>[]) => {
    const payloads = categories.map(c => ({
      name_en: c.nameEn,
      name_ar: c.nameAr,
      icon: c.icon || 'Package'
    }));
    return await supabase.from('categories').insert(payloads).select();
  },

  deleteCategory: async (id: string) => {
    return await supabase.from('categories').delete().eq('id', id);
  },
  
  saveOrder: async (orderData: any) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();
    return { data, error };
  },

  getStats: async () => {
    try {
      const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { data: revenueData } = await supabase.from('orders').select('total');
      const totalRevenue = revenueData?.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0) || 0;
      
      return {
        orderCount: orderCount || 0,
        totalRevenue: totalRevenue
      };
    } catch (e) {
      return { orderCount: 0, totalRevenue: 0 };
    }
  }
};
