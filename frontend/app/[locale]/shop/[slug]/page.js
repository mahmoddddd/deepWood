import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import enTranslations from '@/locales/en/common.json';
import arTranslations from '@/locales/ar/common.json';

// Mock Data for fallback
const MOCK_PRODUCTS = [
  {
    _id: 'mock1',
    title_en: 'Modern Oak Dining Table',
    title_ar: 'طاولة طعام مودرن من خشب البلوط',
    description_en: 'Crafted from premium solid oak, this dining table combines durability with modern aesthetics. Its clean lines and natural finish make it a perfect centerpiece for any dining room. Seats 6-8 people comfortably.',
    description_ar: 'مصنوعة من خشب البلوط الصلب الفاخر، تجمع طاولة الطعام هذه بين المتانة والجماليات العصرية. خطوطها النظيفة وتشطيبها الطبيعي يجعلها قطعة مركزية مثالية لأي غرفة طعام. تتسع لـ 6-8 أشخاص بشكل مريح.',
    price: 15000,
    category: { name_en: 'Tables', name_ar: 'طاولات' },
    image: { url: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.14 AM (1).jpeg' },
    sku: 'DW-TBL-001',
    gallery: [
      { url: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.14 AM (1).jpeg' },
      { url: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM.jpeg' }
    ],
    slug: 'modern-oak-dining-table',
    inStock: true,
    dimensions: { width: 200, height: 75, depth: 100 },
    materials_en: ['Solid Oak', 'Metal Legs'],
    materials_ar: ['بلوط صلب', 'أرجل معدنية']
  },
  {
    _id: 'mock2',
    title_en: 'Luxury Velvet Armchair',
    title_ar: 'كرسي بذراعين مخملي فاخر',
    description_en: 'Experience ultimate comfort with this luxury velvet armchair. Featuring high-density foam cushioning and a sturdy wooden frame, it is built to last while providing exceptional support.',
    description_ar: 'جرب الراحة القصوى مع هذا الكرسي المخملي الفاخر. يتميز ببطانة إسفنجية عالية الكثافة وإطار خشبي قوي، وهو مصمم ليدوم طويلاً مع توفير دعم استثنائي.',
    price: 4500,
    salePrice: 3800,
    category: { name_en: 'Chairs', name_ar: 'كراسي' },
    image: { url: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM (3).jpeg' },
    sku: 'DW-CHR-002',
    slug: 'luxury-velvet-armchair',
    inStock: true,
    dimensions: { width: 80, height: 95, depth: 85 },
    materials_en: ['Velvet Fabric', 'Beech Wood'],
    materials_ar: ['قماش مخمل', 'خشب زان']
  },
  {
    _id: 'mock3',
    title_en: 'Classic Wooden Bed Frame',
    title_ar: 'إطار سرير خشبي كلاسيكي',
    description_en: 'Ageless design meets robust construction in this classic wooden bed frame. Hand-carved details add a touch of elegance to your bedroom sanctuary.',
    description_ar: 'تصميم خالد يلتقي بالبناء القوي في إطار السرير الخشبي الكلاسيكي هذا. تضيف التفاصيل المنحوتة يدوياً لمسة من الأناقة لملاذ غرفة نومك.',
    price: 22000,
    category: { name_en: 'Bedroom', name_ar: 'غرفة النوم' },
    image: { url: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.14 AM.jpeg' },
    sku: 'DW-BED-003',
    slug: 'classic-wooden-bed-frame',
    inStock: true,
    dimensions: { width: 180, height: 120, depth: 200 },
    materials_en: ['Mahogany Wood'],
    materials_ar: ['خشب الماهوجني']
  },
   {
    _id: 'mock4',
    title_en: 'Executive Office Desk',
    title_ar: 'مكتب مدير تنفيذي',
    description_en: 'Command attention with this executive office desk. Ample storage and a spacious work surface make it ideal for productive work days.',
    description_ar: 'اجذب الانتباه مع مكتب المدير التنفيذي هذا. مساحة تخزين واسعة وسطح عمل فسيح يجعله مثالياً لأيام العمل المنتجة.',
    price: 18000,
    category: { name_en: 'Office', name_ar: 'مكاتب' },
    image: { url: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM (1).jpeg' },
    sku: 'DW-DSK-004',
    slug: 'executive-office-desk',
    inStock: true,
    dimensions: { width: 160, height: 75, depth: 80 },
    materials_en: ['Walnut Veneer', 'MDF'],
    materials_ar: ['قشرة جوز', 'خشب MDF']
  },
  {
    _id: 'mock5',
    title_en: 'Minimalist Coffee Table',
    title_ar: 'طاولة قهوة بسيطة',
    description_en: 'Less is more with this minimalist coffee table. Its simple geometry and neutral tones complement any modern living space.',
    description_ar: 'البساطة هي سر الجمال مع طاولة القهوة هذه. هندستها البسيطة وألوانها المحايدة تكمل أي مساحة معيشة حديثة.',
    price: 3200,
    category: { name_en: 'Tables', name_ar: 'طاولات' },
    image: { url: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM.jpeg' },
    sku: 'DW-TBL-005',
    slug: 'minimalist-coffee-table',
    inStock: false,
    dimensions: { width: 100, height: 45, depth: 60 },
    materials_en: ['Oak Wood', 'Glass'],
    materials_ar: ['خشب بلوط', 'زجاج']
  }
];

async function getProduct(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/slug/${slug}`, {
      next: { revalidate: 60 },
      cache: 'no-store'
    });

    if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
    }
  } catch (e) {
    console.log("Fetching failed, checking mock data");
  }

  // Check mock data if API fails or returns nothing
  return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };

  const title = params.locale === 'ar' ? product.title_ar : product.title_en;
  return {
    title: `${title} | Deep Wood`,
    description: params.locale === 'ar'
      ? (product.shortDescription_ar || product.description_ar?.slice(0, 160))
      : (product.shortDescription_en || product.description_en?.slice(0, 160)),
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <>
      <section className="pt-24 pb-8 bg-white"> {/* Adjusted padding for header */}
         <ProductDetailsClient product={product} locale={params.locale} />
      </section>
    </>
  );
}
