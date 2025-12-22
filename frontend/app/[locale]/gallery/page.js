import FilterableGallery from '@/components/FilterableGallery';
import Link from 'next/link';
import { FaArrowRight, FaArrowLeft, FaHome } from 'react-icons/fa';
import enTranslations from '@/locales/en/common.json';
import arTranslations from '@/locales/ar/common.json';

const allTranslations = { en: enTranslations, ar: arTranslations };

export const metadata = {
  title: 'Gallery | Deep Wood',
  description: 'Browse our complete collection of premium handcrafted furniture organized by category. Over 200 high-quality images.',
};

export default function GalleryPage({ params }) {
  const locale = params.locale || 'en';
  const t = allTranslations[locale] || allTranslations.en;
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? FaArrowLeft : FaArrowRight;

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-deep-brown via-matte-black to-deep-brown text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-beige/70 mb-8">
            <Link href={`/${locale}`} className="hover:text-gold transition-colors flex items-center gap-1">
              <FaHome />
              <span>{isRTL ? 'الرئيسية' : 'Home'}</span>
            </Link>
            <span>/</span>
            <span className="text-gold">{isRTL ? 'معرض الصور' : 'Gallery'}</span>
          </div>

          <div className="text-center">
            <div className="gold-line mx-auto mb-6"></div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">{isRTL ? 'معرض أعمالنا' : 'Our Gallery'}</span>
            </h1>
            <p className="text-xl md:text-2xl text-beige max-w-3xl mx-auto">
              {isRTL
                ? 'استعرض مجموعتنا المنظمة من الأثاث الخشبي الفاخر. اختر الفئة المناسبة واضغط على أي صورة لعرضها بحجم أكبر.'
                : 'Browse our organized collection of premium wooden furniture. Select a category and click any image to view it larger.'}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-gold">200+</div>
                <div className="text-beige text-sm">{isRTL ? 'صورة' : 'Images'}</div>
              </div>
              <div className="w-px bg-gold/30"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold">5</div>
                <div className="text-beige text-sm">{isRTL ? 'فئات' : 'Categories'}</div>
              </div>
              <div className="w-px bg-gold/30"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold">HD</div>
                <div className="text-beige text-sm">{isRTL ? 'جودة عالية' : 'Quality'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery with Filters */}
      <section className="py-16 gallery-section min-h-screen">
        <div className="container-custom relative z-10">
          <FilterableGallery locale={locale} />
        </div>
      </section>

      {/* How to Add Images Guide */}
      <section className="py-16 bg-beige">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="gold-line mx-auto mb-6"></div>
            <h2 className="section-title">{isRTL ? 'تصفح حسب الفئة' : 'Browse by Category'}</h2>
            <p className="section-subtitle mb-8">
              {isRTL
                ? 'انقر على أي فئة لعرض صور تلك الفئة فقط'
                : 'Click on any category to view only those images'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">🛋️</div>
                <div className="font-bold text-deep-brown">{isRTL ? 'غرفة المعيشة' : 'Living Room'}</div>
                <div className="text-warm-gray text-sm">40 {isRTL ? 'صورة' : 'images'}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">🛏️</div>
                <div className="font-bold text-deep-brown">{isRTL ? 'غرفة النوم' : 'Bedroom'}</div>
                <div className="text-warm-gray text-sm">40 {isRTL ? 'صورة' : 'images'}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">🍽️</div>
                <div className="font-bold text-deep-brown">{isRTL ? 'غرفة الطعام' : 'Dining'}</div>
                <div className="text-warm-gray text-sm">40 {isRTL ? 'صورة' : 'images'}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">💼</div>
                <div className="font-bold text-deep-brown">{isRTL ? 'المكتب' : 'Office'}</div>
                <div className="text-warm-gray text-sm">40 {isRTL ? 'صورة' : 'images'}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow col-span-2 md:col-span-1">
                <div className="text-4xl mb-2">🍳</div>
                <div className="font-bold text-deep-brown">{isRTL ? 'المطبخ' : 'Kitchen'}</div>
                <div className="text-warm-gray text-sm">39 {isRTL ? 'صورة' : 'images'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gold">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-deep-brown mb-6">
            {isRTL ? 'أعجبك ما رأيته؟' : 'Like What You See?'}
          </h2>
          <p className="text-xl text-deep-brown/80 mb-8 max-w-2xl mx-auto">
            {isRTL
              ? 'تواصل معنا اليوم للحصول على استشارة مجانية وتحويل مساحتك إلى عمل فني.'
              : 'Contact us today for a free consultation and transform your space into a work of art.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="btn-primary bg-deep-brown text-white hover:bg-matte-black inline-flex items-center gap-2 justify-center"
            >
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
              <ArrowIcon />
            </Link>
            <Link
              href={`/${locale}/portfolio`}
              className="btn-secondary border-deep-brown text-deep-brown hover:bg-deep-brown hover:text-white"
            >
              {isRTL ? 'عرض المشاريع' : 'View Projects'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
