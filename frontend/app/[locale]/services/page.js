import enTranslations from '@/locales/en/common.json';
import arTranslations from '@/locales/ar/common.json';

const allTranslations = { en: enTranslations, ar: arTranslations };

async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services?status=active`, { next: { revalidate: 60 } });
    return res.ok ? (await res.json()).data : [];
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  return {
    title: params.locale === 'ar' ? 'خدماتنا | ديب وود' : 'Services | Deep Wood',
    description: params.locale === 'ar' ? 'استكشف خدماتنا المتميزة في الأثاث والأعمال الخشبية.' : 'Explore our premium furniture and woodwork services.',
  };
}

export default async function ServicesPage({ params }) {
  const locale = params.locale || 'en';
  const t = allTranslations[locale] || allTranslations.en;
  const isRTL = locale === 'ar';
  const services = await getServices();

  const defaultServices = [
    { title: t.services.residential, desc: isRTL ? 'أثاث مخصص فاخر لمنزلك، مصمم ليناسب نمط حياتك.' : 'Premium custom furniture for your home, designed to match your lifestyle.', icon: '🏠' },
    { title: t.services.corporate, desc: isRTL ? 'حلول مكتبية ومساحات عمل متكاملة للشركات.' : 'Complete office and workspace solutions for businesses.', icon: '🏢' },
    { title: t.services.custom, desc: isRTL ? 'أعمال خشبية مخصصة حسب مواصفاتك بالضبط.' : 'Bespoke woodwork tailored to your exact specifications.', icon: '🔨' },
    { title: t.services.antique, desc: isRTL ? 'ترميم احترافي للأثاث الأثري والعتيق.' : 'Expert restoration of antique and vintage furniture.', icon: '🏺' },
  ];

  return (
    <>
      <section className="pt-32 pb-20 bg-deep-brown text-white">
        <div className="container-custom text-center">
          <div className="gold-line mx-auto mb-4"></div>
          <h1 className="text-5xl font-bold mb-4">{t.services.title}</h1>
          <p className="text-xl text-beige">{t.services.subtitle}</p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.length > 0 ? services.map((service) => (
              <div key={service._id} className="card p-8 flex gap-6">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-3xl">🪵</span></div>
                <div>
                  <h3 className="text-2xl font-bold text-deep-brown mb-2">{isRTL ? service.title_ar : service.title_en}</h3>
                  <p className="text-warm-gray mb-4">{isRTL ? service.description_ar || service.shortDescription_ar : service.description_en || service.shortDescription_en}</p>
                </div>
              </div>
            )) : defaultServices.map((s, i) => (
              <div key={i} className="card p-8 flex gap-6">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-3xl">{s.icon}</span></div>
                <div>
                  <h3 className="text-2xl font-bold text-deep-brown mb-2">{s.title}</h3>
                  <p className="text-warm-gray">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
