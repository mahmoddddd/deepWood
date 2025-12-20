import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import enTranslations from '@/locales/en/common.json';
import arTranslations from '@/locales/ar/common.json';

const allTranslations = { en: enTranslations, ar: arTranslations };

async function getData() {
  try {
    const [projectsRes, servicesRes, clientsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/featured?limit=6`, { next: { revalidate: 60 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/featured`, { next: { revalidate: 60 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/featured`, { next: { revalidate: 60 } }),
    ]);
    return {
      projects: projectsRes.ok ? (await projectsRes.json()).data : [],
      services: servicesRes.ok ? (await servicesRes.json()).data : [],
      clients: clientsRes.ok ? (await clientsRes.json()).data : [],
    };
  } catch (error) {
    return { projects: [], services: [], clients: [] };
  }
}

export default async function HomePage({ params }) {
  const locale = params.locale || 'en';
  const t = allTranslations[locale] || allTranslations.en;
  const isRTL = locale === 'ar';
  const { projects, services, clients } = await getData();

  const ArrowIcon = isRTL ? FaArrowLeft : FaArrowRight;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <Image
          src="/images/furniture/WhatsApp Image 2025-12-20 at 12.43.13 AM.jpeg"
          alt="Deep Wood Furniture"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-matte-black/90 to-deep-brown/70"></div>
        <div className="relative z-10 container-custom text-center text-white">
          <div className="gold-line mx-auto mb-6"></div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-in">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl mb-8 text-beige max-w-2xl mx-auto">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/portfolio`} className="btn-gold inline-flex items-center gap-2">
              {t.hero.cta} <ArrowIcon />
            </Link>
            <Link href={`/${locale}/contact`} className="btn-secondary border-white text-white hover:bg-white hover:text-deep-brown">
              {t.hero.contact}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Furniture Gallery */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-4"></div>
            <h2 className="section-title">{isRTL ? 'حرفيتنا' : 'Our Craftsmanship'}</h2>
            <p className="section-subtitle">{isRTL ? 'تميز مصنوع يدوياً في كل قطعة' : 'Handcrafted Excellence in Every Piece'}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden group">
              <Image src="/images/furniture/WhatsApp Image 2025-12-20 at 12.43.13 AM (1).jpeg" alt="Furniture 1" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden group">
              <Image src="/images/furniture/WhatsApp Image 2025-12-20 at 12.43.13 AM (2).jpeg" alt="Furniture 2" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden group">
              <Image src="/images/furniture/WhatsApp Image 2025-12-20 at 12.43.13 AM (3).jpeg" alt="Furniture 3" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden group">
              <Image src="/images/furniture/WhatsApp Image 2025-12-20 at 12.43.14 AM.jpeg" alt="Furniture 4" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden group md:col-span-2">
              <Image src="/images/furniture/WhatsApp Image 2025-12-20 at 12.43.14 AM (1).jpeg" alt="Furniture 5" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-4"></div>
            <h2 className="section-title">{t.services.title}</h2>
            <p className="section-subtitle">{t.services.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.length > 0 ? services.map((service) => (
              <div key={service._id} className="card p-6 text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-beige rounded-full flex items-center justify-center group-hover:bg-gold transition-colors">
                  <span className="text-2xl">🪵</span>
                </div>
                <h3 className="text-xl font-semibold text-deep-brown mb-2">{isRTL ? service.title_ar : service.title_en}</h3>
                <p className="text-warm-gray">{isRTL ? service.shortDescription_ar : service.shortDescription_en}</p>
              </div>
            )) : (
              <>
                <div className="card p-6 text-center"><div className="w-16 h-16 mx-auto mb-4 bg-beige rounded-full flex items-center justify-center"><span className="text-2xl">🏠</span></div><h3 className="text-xl font-semibold text-deep-brown mb-2">{t.services.residential}</h3></div>
                <div className="card p-6 text-center"><div className="w-16 h-16 mx-auto mb-4 bg-beige rounded-full flex items-center justify-center"><span className="text-2xl">🏢</span></div><h3 className="text-xl font-semibold text-deep-brown mb-2">{t.services.corporate}</h3></div>
                <div className="card p-6 text-center"><div className="w-16 h-16 mx-auto mb-4 bg-beige rounded-full flex items-center justify-center"><span className="text-2xl">🔨</span></div><h3 className="text-xl font-semibold text-deep-brown mb-2">{t.services.custom}</h3></div>
                <div className="card p-6 text-center"><div className="w-16 h-16 mx-auto mb-4 bg-beige rounded-full flex items-center justify-center"><span className="text-2xl">🏺</span></div><h3 className="text-xl font-semibold text-deep-brown mb-2">{t.services.antique}</h3></div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-beige">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-4"></div>
            <h2 className="section-title">{t.portfolio.title}</h2>
            <p className="section-subtitle">{t.portfolio.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? projects.slice(0, 6).map((project) => (
              <Link key={project._id} href={`/${locale}/portfolio/${project.slug}`} className="card group">
                <div className="relative h-64 bg-white overflow-hidden">
                  {project.image?.url && <Image src={project.image.url} alt={isRTL ? project.title_ar : project.title_en} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />}
                  {project.isCorporate && <span className="absolute top-4 left-4 bg-gold text-deep-brown px-3 py-1 text-sm font-medium rounded">{isRTL ? 'مؤسسي' : 'Corporate'}</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-deep-brown mb-2">{isRTL ? project.title_ar : project.title_en}</h3>
                  <p className="text-warm-gray line-clamp-2">{isRTL ? project.shortDescription_ar || project.description_ar?.slice(0, 100) : project.shortDescription_en || project.description_en?.slice(0, 100)}</p>
                </div>
              </Link>
            )) : (
              <div className="col-span-3 text-center py-12 text-warm-gray">{isRTL ? 'المشاريع قادمة قريباً...' : 'Projects coming soon...'}</div>
            )}
          </div>
          <div className="text-center mt-10">
            <Link href={`/${locale}/portfolio`} className="btn-primary">{t.portfolio.viewAll}</Link>
          </div>
        </div>
      </section>

      {/* Corporate Clients */}
      <section className="py-20 bg-deep-brown text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-4"></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.clients.title}</h2>
            <p className="text-beige text-lg">{t.clients.subtitle}</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {clients.length > 0 ? clients.map((client) => (
              <div key={client._id} className="bg-white/10 p-6 rounded-lg">
                {client.logo?.url ? <Image src={client.logo.url} alt={isRTL ? client.name_ar : client.name_en} width={120} height={60} className="opacity-80 hover:opacity-100 transition-opacity" /> : <span className="text-2xl font-bold text-gold">{isRTL ? client.name_ar : client.name_en}</span>}
              </div>
            )) : (
              <>
                <div className="bg-white/10 p-6 rounded-lg"><span className="text-2xl font-bold text-gold">{isRTL ? 'تويوتا' : 'Toyota'}</span></div>
                <div className="bg-white/10 p-6 rounded-lg"><span className="text-2xl font-bold text-gold">{isRTL ? 'توشيبا العربي' : 'Toshiba El Araby'}</span></div>
                <div className="bg-white/10 p-6 rounded-lg"><span className="text-2xl font-bold text-gold">{isRTL ? 'راية' : 'Raya'}</span></div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gold">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-deep-brown mb-6">{isRTL ? 'مستعد لتحويل مساحتك؟' : 'Ready to Transform Your Space?'}</h2>
          <p className="text-xl text-deep-brown/80 mb-8 max-w-2xl mx-auto">{isRTL ? 'دعنا نصنع الأثاث المثالي لمنزلك أو مكتبك. تواصل معنا اليوم للحصول على استشارة مجانية.' : 'Let us craft the perfect furniture for your home or office. Contact us today for a free consultation.'}</p>
          <Link href={`/${locale}/contact`} className="btn-primary bg-deep-brown text-white hover:bg-matte-black">{t.hero.contact}</Link>
        </div>
      </section>
    </>
  );
}
