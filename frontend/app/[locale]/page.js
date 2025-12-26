import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import enTranslations from '@/locales/en/common.json';
import arTranslations from '@/locales/ar/common.json';
import GallerySection from '@/components/GallerySection';
import HeroImage from '@/components/HeroImage';

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
        <HeroImage />
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

      {/* Interactive Photo Gallery */}
      <section className="py-24 gallery-section">
        <div className="container-custom relative z-10">
          <GallerySection
            locale={locale}
            title={isRTL ? 'معرض أعمالنا' : 'Our Gallery'}
            subtitle={isRTL ? 'اضغط على أي صورة لعرضها بحجم أكبر والتنقل بينها' : 'Click any image to view larger and navigate through'}
            columns={3}
          />

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/gallery`}
              className="btn-primary inline-flex items-center gap-2"
            >
              {isRTL ? 'عرض كل الصور' : 'View All Photos'}
              <ArrowIcon />
            </Link>
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

      {/* Corporate Partners - Premium Section */}
      <section className="py-24 bg-gradient-to-br from-deep-brown via-matte-black to-deep-brown text-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 fade-in-up">
              <span className="gradient-text">{t.clients.title}</span>
            </h2>
            <p className="text-beige text-xl max-w-2xl mx-auto fade-in-up delay-200">{t.clients.subtitle}</p>
          </div>

          {/* Partners Grid with Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Toyota */}
            <div className="partner-card fade-in-up delay-100 pulse-glow">
              <div className="w-32 h-20 relative flex items-center justify-center">
                <svg className="w-28 h-20 partner-logo" viewBox="0 0 200 80" fill="currentColor">
                  {/* Toyota Logo - Stylized Ellipses */}
                  <ellipse cx="100" cy="40" rx="90" ry="35" fill="none" stroke="currentColor" strokeWidth="4"/>
                  <ellipse cx="100" cy="40" rx="55" ry="20" fill="none" stroke="currentColor" strokeWidth="3"/>
                  <ellipse cx="100" cy="40" rx="25" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <line x1="100" y1="5" x2="100" y2="75" stroke="currentColor" strokeWidth="3"/>
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gold mb-2">{isRTL ? 'تويوتا' : 'Toyota'}</h3>
                <p className="text-beige/70 text-sm">{isRTL ? 'شريك استراتيجي' : 'Strategic Partner'}</p>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent mt-4 shimmer overflow-hidden rounded"></div>
            </div>

            {/* Raya */}
            <div className="partner-card fade-in-up delay-300 pulse-glow">
              <div className="w-32 h-20 relative flex items-center justify-center">
                <svg className="w-28 h-16 partner-logo" viewBox="0 0 200 60" fill="currentColor">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="36" fontWeight="bold" fill="currentColor">RAYA</text>
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gold mb-2">{isRTL ? 'راية' : 'Raya'}</h3>
                <p className="text-beige/70 text-sm">{isRTL ? 'شريك تقني' : 'Technology Partner'}</p>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent mt-4 shimmer overflow-hidden rounded"></div>
            </div>

            {/* Toshiba */}
            <div className="partner-card fade-in-up delay-500 pulse-glow">
              <div className="w-32 h-20 relative flex items-center justify-center">
                <svg className="w-28 h-16 partner-logo" viewBox="0 0 200 60" fill="currentColor">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="bold" fill="currentColor">TOSHIBA</text>
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gold mb-2">{isRTL ? 'توشيبا العربي' : 'Toshiba El Araby'}</h3>
                <p className="text-beige/70 text-sm">{isRTL ? 'شريك صناعي' : 'Industrial Partner'}</p>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent mt-4 shimmer overflow-hidden rounded"></div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="text-center fade-in-up delay-600">
            <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-full border border-gold/20">
              <span className="text-gold text-3xl">🏆</span>
              <span className="text-beige text-lg font-medium">
                {isRTL ? 'موثوق به من قبل أكبر الشركات في مصر' : 'Trusted by Egypt\'s Leading Companies'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-br from-matte-black via-deep-brown to-matte-black text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">{isRTL ? 'إنجازاتنا بالأرقام' : 'Our Achievements'}</span>
            </h2>
            <p className="text-beige text-xl max-w-2xl mx-auto">
              {isRTL ? 'أرقام تتحدث عن جودة أعمالنا وثقة عملائنا' : 'Numbers that speak to our quality and client trust'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Years of Experience */}
            <div className="stat-card fade-in-up stagger-1">
              <div className="relative z-10">
                <div className="text-5xl mb-4 icon-bounce">🏆</div>
                <div className="stat-number">25+</div>
                <div className="text-beige text-lg mt-2">{isRTL ? 'سنة خبرة' : 'Years Experience'}</div>
              </div>
            </div>

            {/* Completed Projects */}
            <div className="stat-card fade-in-up stagger-2">
              <div className="relative z-10">
                <div className="text-5xl mb-4 icon-bounce">🏠</div>
                <div className="stat-number">500+</div>
                <div className="text-beige text-lg mt-2">{isRTL ? 'مشروع منجز' : 'Projects Done'}</div>
              </div>
            </div>

            {/* Happy Clients */}
            <div className="stat-card fade-in-up stagger-3">
              <div className="relative z-10">
                <div className="text-5xl mb-4 icon-bounce">😊</div>
                <div className="stat-number">1200+</div>
                <div className="text-beige text-lg mt-2">{isRTL ? 'عميل سعيد' : 'Happy Clients'}</div>
              </div>
            </div>

            {/* Corporate Partners */}
            <div className="stat-card fade-in-up stagger-4">
              <div className="relative z-10">
                <div className="text-5xl mb-4 icon-bounce">🤝</div>
                <div className="stat-number">50+</div>
                <div className="text-beige text-lg mt-2">{isRTL ? 'شريك مؤسسي' : 'Corporate Partners'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-cream relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-0 w-40 h-40 bg-gold/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-0 w-60 h-60 bg-deep-brown/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-6"></div>
            <h2 className="section-title">{isRTL ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say'}</h2>
            <p className="section-subtitle">{isRTL ? 'آراء حقيقية من عملائنا الكرام' : 'Real testimonials from our valued clients'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="testimonial-card fade-in-up stagger-1">
              <div className="relative z-10 pt-8">
                <div className="star-rating mb-4">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
                <p className="text-warm-gray mb-6 leading-relaxed">
                  {isRTL
                    ? '"تجربة ممتازة من البداية للنهاية. الجودة فاقت توقعاتي والتسليم كان في الموعد. أنصح بهم بشدة!"'
                    : '"Excellent experience from start to finish. Quality exceeded my expectations and delivery was on time. Highly recommend!"'}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gold to-deep-brown rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {isRTL ? 'أ' : 'A'}
                  </div>
                  <div>
                    <div className="font-bold text-deep-brown">{isRTL ? 'أحمد محمد' : 'Ahmed Mohamed'}</div>
                    <div className="text-warm-gray text-sm">{isRTL ? 'مالك فيلا' : 'Villa Owner'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card fade-in-up stagger-2">
              <div className="relative z-10 pt-8">
                <div className="star-rating mb-4">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
                <p className="text-warm-gray mb-6 leading-relaxed">
                  {isRTL
                    ? '"فريق محترف جداً يفهم متطلبات الشركات. نفذوا تجهيز مكتبنا بالكامل بأعلى معايير الجودة."'
                    : '"Very professional team that understands corporate needs. They executed our entire office furnishing with the highest quality standards."'}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gold to-deep-brown rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {isRTL ? 'س' : 'S'}
                  </div>
                  <div>
                    <div className="font-bold text-deep-brown">{isRTL ? 'سارة عبدالله' : 'Sara Abdullah'}</div>
                    <div className="text-warm-gray text-sm">{isRTL ? 'مديرة شركة' : 'Company Director'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card fade-in-up stagger-3">
              <div className="relative z-10 pt-8">
                <div className="star-rating mb-4">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
                <p className="text-warm-gray mb-6 leading-relaxed">
                  {isRTL
                    ? '"الأثاث المخصص اللي صمموه لينا كان مميز جداً. اهتمامهم بالتفاصيل والخامات عالية الجودة واضح."'
                    : '"The custom furniture they designed for us was exceptional. Their attention to detail and high-quality materials is evident."'}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gold to-deep-brown rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {isRTL ? 'م' : 'M'}
                  </div>
                  <div>
                    <div className="font-bold text-deep-brown">{isRTL ? 'محمد فؤاد' : 'Mohamed Fouad'}</div>
                    <div className="text-warm-gray text-sm">{isRTL ? 'مهندس ديكور' : 'Interior Designer'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="py-24 bg-beige">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-6"></div>
            <h2 className="section-title">{isRTL ? 'قبل وبعد' : 'Before & After'}</h2>
            <p className="section-subtitle">{isRTL ? 'شاهد التحول المذهل في أعمالنا' : 'See the stunning transformation in our work'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Transformation 1 */}
            <div className="fade-in-up stagger-1">
              <div className="comparison-slider relative h-80 md:h-96 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🏚️</div>
                      <div className="text-xl font-bold">{isRTL ? 'قبل' : 'Before'}</div>
                      <div className="text-sm opacity-80">{isRTL ? 'مساحة فارغة' : 'Empty Space'}</div>
                    </div>
                  </div>
                  <div className="w-1/2 bg-gradient-to-br from-deep-brown to-gold flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🏠</div>
                      <div className="text-xl font-bold">{isRTL ? 'بعد' : 'After'}</div>
                      <div className="text-sm opacity-80">{isRTL ? 'غرفة معيشة فاخرة' : 'Luxury Living Room'}</div>
                    </div>
                  </div>
                </div>
                {/* Divider Line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gold z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-deep-brown font-bold">↔</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="font-bold text-deep-brown text-xl">{isRTL ? 'تجديد غرفة المعيشة' : 'Living Room Renovation'}</h3>
              </div>
            </div>

            {/* Transformation 2 */}
            <div className="fade-in-up stagger-2">
              <div className="comparison-slider relative h-80 md:h-96 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">📦</div>
                      <div className="text-xl font-bold">{isRTL ? 'قبل' : 'Before'}</div>
                      <div className="text-sm opacity-80">{isRTL ? 'مكتب قديم' : 'Old Office'}</div>
                    </div>
                  </div>
                  <div className="w-1/2 bg-gradient-to-br from-matte-black to-deep-brown flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🏢</div>
                      <div className="text-xl font-bold">{isRTL ? 'بعد' : 'After'}</div>
                      <div className="text-sm opacity-80">{isRTL ? 'مكتب عصري' : 'Modern Office'}</div>
                    </div>
                  </div>
                </div>
                {/* Divider Line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gold z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-deep-brown font-bold">↔</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="font-bold text-deep-brown text-xl">{isRTL ? 'تجهيز مكتب شركة' : 'Corporate Office Setup'}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-24 bg-gradient-to-br from-deep-brown to-matte-black relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="gradient-text">{isRTL ? 'شاهد أعمالنا' : 'Watch Our Work'}</span>
            </h2>
            <p className="text-beige text-xl">{isRTL ? 'جولة داخل ورشتنا ومشاريعنا' : 'A tour inside our workshop and projects'}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="video-container aspect-video bg-gradient-to-br from-deep-brown/50 to-matte-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="play-button mb-8">
                  <svg className="w-10 h-10 text-deep-brown ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-beige text-lg">{isRTL ? 'اضغط لمشاهدة الفيديو' : 'Click to Watch Video'}</p>
              </div>
            </div>

            {/* Video Features */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="text-3xl mb-2">🎬</div>
                <div className="text-beige text-sm">{isRTL ? 'جولة الورشة' : 'Workshop Tour'}</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="text-3xl mb-2">🪚</div>
                <div className="text-beige text-sm">{isRTL ? 'عملية التصنيع' : 'Manufacturing'}</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="text-3xl mb-2">✨</div>
                <div className="text-beige text-sm">{isRTL ? 'المنتج النهائي' : 'Final Product'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-cream">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-6"></div>
            <h2 className="section-title">{isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h2>
            <p className="section-subtitle">{isRTL ? 'إجابات على أكثر الأسئلة شيوعاً' : 'Answers to the most common questions'}</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* FAQ 1 */}
            <div className="faq-item fade-in-up stagger-1">
              <div className="faq-question">
                <span>{isRTL ? 'ما هي مدة تنفيذ المشروع؟' : 'What is the project execution time?'}</span>
                <div className="faq-icon">
                  <span className="text-deep-brown font-bold">+</span>
                </div>
              </div>
              <div className="faq-answer">
                <p className="text-warm-gray">
                  {isRTL
                    ? 'تختلف مدة التنفيذ حسب حجم المشروع. المشاريع الصغيرة تستغرق من 2-4 أسابيع، بينما المشاريع الكبيرة قد تستغرق 2-3 أشهر.'
                    : 'Execution time varies by project size. Small projects take 2-4 weeks, while larger projects may take 2-3 months.'}
                </p>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="faq-item fade-in-up stagger-2">
              <div className="faq-question">
                <span>{isRTL ? 'هل تقدمون ضمان على الأثاث؟' : 'Do you offer warranty on furniture?'}</span>
                <div className="faq-icon">
                  <span className="text-deep-brown font-bold">+</span>
                </div>
              </div>
              <div className="faq-answer">
                <p className="text-warm-gray">
                  {isRTL
                    ? 'نعم، نقدم ضمان 5 سنوات على جميع منتجاتنا ضد عيوب التصنيع، مع خدمة صيانة مجانية في السنة الأولى.'
                    : 'Yes, we offer a 5-year warranty on all our products against manufacturing defects, with free maintenance service in the first year.'}
                </p>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="faq-item fade-in-up stagger-3">
              <div className="faq-question">
                <span>{isRTL ? 'هل يمكنكم تصميم أثاث مخصص؟' : 'Can you design custom furniture?'}</span>
                <div className="faq-icon">
                  <span className="text-deep-brown font-bold">+</span>
                </div>
              </div>
              <div className="faq-answer">
                <p className="text-warm-gray">
                  {isRTL
                    ? 'بالتأكيد! نحن متخصصون في الأثاث المخصص. فريق التصميم لدينا يعمل معك لتحويل أفكارك إلى واقع.'
                    : 'Absolutely! We specialize in custom furniture. Our design team works with you to turn your ideas into reality.'}
                </p>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="faq-item fade-in-up stagger-4">
              <div className="faq-question">
                <span>{isRTL ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are available?'}</span>
                <div className="faq-icon">
                  <span className="text-deep-brown font-bold">+</span>
                </div>
              </div>
              <div className="faq-answer">
                <p className="text-warm-gray">
                  {isRTL
                    ? 'نقبل الدفع نقداً، التحويل البنكي، والدفع بالتقسيط حتى 12 شهر بدون فوائد للمشاريع الكبيرة.'
                    : 'We accept cash, bank transfer, and installment payments up to 12 months interest-free for large projects.'}
                </p>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="faq-item fade-in-up stagger-5">
              <div className="faq-question">
                <span>{isRTL ? 'هل تخدمون مناطق خارج القاهرة؟' : 'Do you serve areas outside Cairo?'}</span>
                <div className="faq-icon">
                  <span className="text-deep-brown font-bold">+</span>
                </div>
              </div>
              <div className="faq-answer">
                <p className="text-warm-gray">
                  {isRTL
                    ? 'نعم، نخدم جميع محافظات مصر. لدينا فريق توصيل وتركيب يصل لأي مكان.'
                    : 'Yes, we serve all Egyptian governorates. We have a delivery and installation team that reaches anywhere.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-6"></div>
            <h2 className="section-title">{isRTL ? 'موقعنا' : 'Our Location'}</h2>
            <p className="section-subtitle">{isRTL ? 'قم بزيارتنا في معرضنا' : 'Visit us at our showroom'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="map-container h-96 fade-in-up">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.8399469654187!2d31.235711!3d30.044420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjkiTiAzMcKwMTQnMDguNiJF!5e0!3m2!1sen!2seg!4v1703180000000!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Contact Info */}
            <div className="fade-in-up stagger-2">
              <div className="contact-info-card h-full">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gold mb-8">{isRTL ? 'معلومات التواصل' : 'Contact Information'}</h3>

                  <div className="space-y-6">
                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📍</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gold mb-1">{isRTL ? 'العنوان' : 'Address'}</div>
                        <div className="text-beige/80">
                          {isRTL ? 'المنطقة الصناعية، المعادي، القاهرة، مصر' : 'Industrial Zone, Maadi, Cairo, Egypt'}
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📞</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gold mb-1">{isRTL ? 'الهاتف' : 'Phone'}</div>
                        <div className="text-beige/80" dir="ltr">+20 123 456 7890</div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">✉️</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gold mb-1">{isRTL ? 'البريد الإلكتروني' : 'Email'}</div>
                        <div className="text-beige/80">info@deepwood.com</div>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🕐</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gold mb-1">{isRTL ? 'ساعات العمل' : 'Working Hours'}</div>
                        <div className="text-beige/80">
                          {isRTL ? 'السبت - الخميس: 9 صباحاً - 6 مساءً' : 'Sat - Thu: 9 AM - 6 PM'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-10 pt-8 border-t border-white/10">
                    <div className="text-gold font-semibold mb-4">{isRTL ? 'تابعنا' : 'Follow Us'}</div>
                    <div className="flex gap-4">
                      <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                        <span className="text-xl">📘</span>
                      </a>
                      <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                        <span className="text-xl">📸</span>
                      </a>
                      <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                        <span className="text-xl">🐦</span>
                      </a>
                      <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                        <span className="text-xl">💼</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
