
import { Product, Translations } from './types';

export const LOGO_URL = 'https://cdn.d4donline.com/u/c/0e780194ffa3f295bfcb50c8a2e62d90.png';

// Fallback image if any specific product image fails
export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1506617564039-2f3b650ad755?q=80&w=400&auto=format&fit=crop';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    nameEn: 'Lucky Me! Pancit Canton Kalamansi 6x60g',
    nameAr: 'لاكي مي بان سيت كانتون كالامانسي ٦ × ٦٠ جرام',
    price: 12.50,
    originalPrice: 15.00,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=400',
    unit: 'Pack',
    stock: 100,
    isOffer: true,
    descriptionEn: 'The original Filipino instant stir-fry noodles with a citrus twist.',
    descriptionAr: 'نودلز القلي السريع الفلبينية الأصلية مع لمسة من الحمضيات.'
  },
  {
    id: '2',
    nameEn: 'Century Tuna Flakes in Vegetable Oil 180g',
    nameAr: 'سنتشري تونة قطع في زيت نباتي ١٨٠ جرام',
    price: 7.95,
    originalPrice: 9.50,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1544333346-60199e1966a3?auto=format&fit=crop&q=80&w=400',
    unit: 'Each',
    stock: 250,
    isOffer: true,
    descriptionEn: 'Premium tuna flakes rich in Omega-3 and protein.',
    descriptionAr: 'رقائق تونة فاخرة غنية بالأوميغا ٣ والبروتين.'
  },
  {
    id: '3',
    nameEn: 'Datu Puti Soy Sauce & Vinegar Value Pack 2x1L',
    nameAr: 'داتو بوتي صلصة صويا وخل عبوة توفير ٢ × ١ لتر',
    price: 18.95,
    originalPrice: 22.00,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400',
    unit: 'Pack',
    stock: 45,
    isOffer: true,
    descriptionEn: 'The perfect duo for Filipino adobo and dipping sauces.',
    descriptionAr: 'الثنائي المثالي للأدوبو الفلبيني وصلصات التغميس.'
  },
  {
    id: '4',
    nameEn: 'Purefoods Corned Beef 340g',
    nameAr: 'بيور فودز لحم بقري معلب ٣٤٠ جرام',
    price: 24.50,
    originalPrice: 28.00,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1599059021750-8271632f6347?auto=format&fit=crop&q=80&w=400',
    unit: 'Each',
    stock: 80,
    isOffer: false,
    descriptionEn: 'Premium corned beef made from 100% pure beef.',
    descriptionAr: 'لحم بقري معلب فاخر مصنوع من لحم بقري صافي ١٠٠٪.'
  },
  {
    id: '5',
    nameEn: 'SkyFlakes Crackers Plastic Tub 800g',
    nameAr: 'سكاي فليكس بسكويت مالح عبوة بلاستيكية ٨٠٠ جرام',
    price: 29.95,
    originalPrice: 34.00,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400',
    unit: 'Tub',
    stock: 60,
    isOffer: true,
    descriptionEn: 'The number one cracker brand in the Philippines, crisp and fresh.',
    descriptionAr: 'العلامة التجارية الأولى للبسكويت المالح في الفلبين، مقرمشة وطازجة.'
  },
  {
    id: '6',
    nameEn: 'Magnolia Ice Cream Ube 1.5L',
    nameAr: 'ماجنوليا آيس كريم بنكهة الأوبي ١.٥ لتر',
    price: 38.00,
    originalPrice: 45.00,
    category: 'Frozen',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400',
    unit: 'Each',
    stock: 30,
    isOffer: true,
    descriptionEn: 'Authentic Filipino purple yam ice cream.',
    descriptionAr: 'آيس كريم اليام الأرجواني الفلبيني الأصلي.'
  },
  {
    id: '7',
    nameEn: 'Kopiko Brown Coffee 3-in-1 (30 Sticks)',
    nameAr: 'كوبيكو قهوة بني ٣ في ١ (٣٠ ظرف)',
    price: 22.00,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400',
    unit: 'Pack',
    stock: 120,
    isOffer: false,
    descriptionEn: 'Creamy coffee mix with a rich brown sugar flavor.',
    descriptionAr: 'مزيج قهوة كريمي مع نكهة السكر البني الغنية.'
  },
  {
    id: '8',
    nameEn: 'Fresh Philippine Mangoes (Per KG)',
    nameAr: 'مانجو فلبيني طازج (للكيلو)',
    price: 24.95,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400',
    unit: 'KG',
    stock: 15,
    isOffer: false,
    descriptionEn: 'World-famous sweet and juicy carabao mangoes.',
    descriptionAr: 'مانجو كاراباو الحلوة والعصيرية المشهورة عالمياً.'
  },
  {
    id: '9',
    nameEn: 'Mama Sita\'s Sinigang Mix 50g',
    nameAr: 'ماما سيتا خلطة سينيجانج ٥٠ جرام',
    price: 4.50,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400',
    unit: 'Each',
    stock: 300,
    isOffer: false,
    descriptionEn: 'Authentic tamarind soup base for the classic Filipino Sinigang.',
    descriptionAr: 'قاعدة حساء التمر الهندي الأصلية لطبق السينيجانج الفلبيني الكلاسيكي.'
  },
  {
    id: '10',
    nameEn: 'Boy Bawang Garlic Cornick 100g',
    nameAr: 'بوي باوانج ذرة محمصة بالثوم ١٠٠ جرام',
    price: 3.50,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1599490659223-e153c073f867?auto=format&fit=crop&q=80&w=400',
    unit: 'Each',
    stock: 500,
    isOffer: false,
    descriptionEn: 'Crunchy garlic-flavored corn kernels, a perfect snack.',
    descriptionAr: 'حبيبات الذرة المقرمشة بنكهة الثوم، وجبة خفيفة مثالية.'
  }
];

export const I18N: Translations = {
  home: { en: 'Home', ar: 'الرئيسية' },
  shop: { en: 'Shop', ar: 'المتجر' },
  offers: { en: 'Offers', ar: 'العروض' },
  tracking: { en: 'Track Order', ar: 'تتبع الطلب' },
  cart: { en: 'Cart', ar: 'السلة' },
  checkout: { en: 'Checkout', ar: 'الدفع' },
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  admin: { en: 'Admin', ar: 'لوحة التحكم' },
  categories: { en: 'Categories', ar: 'الأقسام' },
  addToCart: { en: 'Add to Cart', ar: 'أضف إلى السلة' },
  search: { en: 'Search products...', ar: 'بحث عن المنتجات...' },
  summary: { en: 'Summary', ar: 'الملخص' },
  subtotal: { en: 'Subtotal', ar: 'المجموع الفرعي' },
  vat: { en: 'VAT (15% Included)', ar: 'ضريبة القيمة المضافة (١٥٪ مشمولة)' },
  total: { en: 'Total', ar: 'الإجمالي' },
  placeOrder: { en: 'Place Order', ar: 'إتمام الطلب' },
  jeddahStore: { en: 'Jeddah Store', ar: 'فرع جدة' },
  weeklySale: { en: 'Weekly Super Sale', ar: 'العروض الأسبوعية الكبرى' },
  welcome2026: { en: 'Welcome 2026', ar: 'أهلاً ٢٠٢٦' },
  was: { en: 'Was', ar: 'كان' },
  now: { en: 'Now', ar: 'الآن' },
  sar: { en: 'SAR', ar: 'ريال' },
  continueShopping: { en: 'Continue Shopping', ar: 'مواصلة التسوق' },
  deliveryDetails: { en: 'Delivery Details', ar: 'تفاصيل التوصيل' },
  thankYou: { en: 'Thank You!', ar: 'شكراً لك!' },
  orderSuccess: { en: 'Your order has been placed successfully.', ar: 'تم تقديم طلبك بنجاح.' },
  orderNumber: { en: 'Order Number', ar: 'رقم الطلب' }
};
