import ProductCard from '@/components/ProductCard';
import enTranslations from '@/locales/en/common.json';
import arTranslations from '@/locales/ar/common.json';

const allTranslations = { en: enTranslations, ar: arTranslations };

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products?status=active`, {
      cache: 'no-store' // Ensure we always get fresh data
    });

    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

export async function generateMetadata({ params }) {
  return {
    title: params.locale === 'ar' ? 'المتجر | ديب وود' : 'Shop | Deep Wood',
    description: params.locale === 'ar' ? 'تسوق أثاث فاخر مصنوع يدوياً من ديب وود.' : 'Shop premium handcrafted furniture from Deep Wood.',
  };
}

export default async function ShopPage({ params }) {
  const locale = params.locale || 'en';
  const t = allTranslations[locale] || allTranslations.en;
  const isRTL = locale === 'ar';

  const products = await getProducts();

  return (
    <>
      <section className="pt-32 pb-16 bg-deep-brown text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10 pattern-dots"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

        <div className="container-custom text-center relative z-10">
          <p className="text-gold font-medium mb-3 tracking-widest uppercase text-sm">
            {isRTL ? 'تسوق مجموعتنا' : 'Shop Our Collection'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.shop.title}</h1>
          <p className="text-lg text-beige max-w-2xl mx-auto">{t.shop.subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 min-h-[600px]">
        <div className="container-custom">
          {/* Filters Bar (Placeholder for now) */}
          <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <p className="text-gray-500">
              {isRTL
                ? `عرض ${products.length} منتج`
                : `Showing ${products.length} products`}
            </p>

            <div className="flex gap-4">
              <select className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none">
                <option>{isRTL ? 'ترتيب حسب: الأحدث' : 'Sort by: Newest'}</option>
                <option>{isRTL ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option>{isRTL ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                locale={locale}
              />
            ))}
          </div>

          {/* Products Empty State */}
          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {isRTL ? 'لا توجد منتجات حالياً.' : 'No products found.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
