import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaArrowLeft, FaCouch, FaBuilding, FaHammer, FaAward, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import enTranslations from '@/locales/en/common.json';
import arTranslations from '@/locales/ar/common.json';
import GallerySection from '@/components/GallerySection';
import HeroImage from '@/components/HeroImage';
import StatsSection from '@/components/StatsSection';
import FAQSection from '@/components/FAQSection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import PartnersSection from '@/components/PartnersSection';
import PortfolioSection from '@/components/PortfolioSection';

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
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
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
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-gold/30 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                  <FaCouch className="text-2xl text-gold group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-deep-brown mb-2">{isRTL ? service.title_ar : service.title_en}</h3>
                <p className="text-warm-gray">{isRTL ? service.shortDescription_ar : service.shortDescription_en}</p>
              </div>
            )) : (
              <>
                <div className="card p-6 text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-gold/30 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                        <FaCouch className="text-2xl text-gold group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-deep-brown mb-2">{t.services.residential}</h3>
                </div>
                <div className="card p-6 text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-gold/30 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                        <FaBuilding className="text-2xl text-gold group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-deep-brown mb-2">{t.services.corporate}</h3>
                </div>
                <div className="card p-6 text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-gold/30 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                        <FaHammer className="text-2xl text-gold group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-deep-brown mb-2">{t.services.custom}</h3>
                </div>
                <div className="card p-6 text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-gold/30 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                        <FaAward className="text-2xl text-gold group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-deep-brown mb-2">{t.services.antique}</h3>
                </div>
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

      {/* Corporate Partners - Clean & Professional */}
      <PartnersSection locale={locale} />

      {/* Portfolio - Corporate & Residential */}
      <PortfolioSection locale={locale} />

      {/* Statistics Section with Animated Counters */}
      <StatsSection locale={locale} />

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

      {/* Before/After Interactive Comparison */}
      <BeforeAfterSection locale={locale} />


      {/* FAQ Section with Interactive Accordion */}
      <FAQSection locale={locale} />

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
                      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 text-gold">
                        <FaMapMarkerAlt size={20} />
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
                      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 text-gold">
                        <FaPhoneAlt size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gold mb-1">{isRTL ? 'الهاتف' : 'Phone'}</div>
                        <a href="tel:+201020883895" className="text-beige/80 hover:text-gold transition-colors" dir="ltr">+20 10 20883895</a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 text-gold">
                        <FaEnvelope size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gold mb-1">{isRTL ? 'البريد الإلكتروني' : 'Email'}</div>
                        <div className="text-beige/80">info@deepwood.com</div>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 text-gold">
                        <FaClock size={20} />
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
                      <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-deep-brown transition-all text-white">
                        <FaFacebook size={20} />
                      </a>
                      <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-deep-brown transition-all text-white">
                        <FaInstagram size={20} />
                      </a>
                      <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-deep-brown transition-all text-white">
                        <FaTwitter size={20} />
                      </a>
                      <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-deep-brown transition-all text-white">
                        <FaLinkedin size={20} />
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
