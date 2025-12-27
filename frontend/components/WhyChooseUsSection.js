'use client';

import { FaAward, FaHandshake, FaClock, FaTools, FaTruck, FaShieldAlt } from 'react-icons/fa';

const features = [
  {
    icon: FaAward,
    titleEn: '25+ Years Experience',
    titleAr: 'خبرة +25 سنة',
    descriptionEn: 'Decades of expertise in premium furniture craftsmanship',
    descriptionAr: 'عقود من الخبرة في صناعة الأثاث الفاخر',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: FaTools,
    titleEn: 'Premium Materials',
    titleAr: 'خامات فاخرة',
    descriptionEn: 'Only the finest wood and materials for lasting quality',
    descriptionAr: 'أجود أنواع الخشب والخامات لجودة تدوم',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: FaHandshake,
    titleEn: 'Custom Designs',
    titleAr: 'تصميمات مخصصة',
    descriptionEn: 'Your vision, our craftsmanship - unique pieces for you',
    descriptionAr: 'رؤيتك وحرفيتنا - قطع فريدة مصممة لك',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    icon: FaClock,
    titleEn: 'On-Time Delivery',
    titleAr: 'تسليم في الموعد',
    descriptionEn: 'We respect your time with punctual project completion',
    descriptionAr: 'نحترم وقتك بإنجاز المشاريع في موعدها',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: FaShieldAlt,
    titleEn: '5 Year Warranty',
    titleAr: 'ضمان 5 سنوات',
    descriptionEn: 'Complete peace of mind with our quality guarantee',
    descriptionAr: 'راحة بال كاملة مع ضمان الجودة',
    color: 'from-rose-400 to-red-500',
  },
  {
    icon: FaTruck,
    titleEn: 'Free Installation',
    titleAr: 'تركيب مجاني',
    descriptionEn: 'Professional delivery and installation across Egypt',
    descriptionAr: 'توصيل وتركيب احترافي لكل مصر',
    color: 'from-cyan-400 to-blue-500',
  },
];

export default function WhyChooseUsSection({ locale = 'en' }) {
  const isRTL = locale === 'ar';

  return (
    <section className="py-24 bg-gradient-to-br from-deep-brown via-matte-black to-deep-brown relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-6"></div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="gradient-text">
              {isRTL ? 'لماذا تختار DeepWood؟' : 'Why Choose DeepWood?'}
            </span>
          </h2>
          <p className="text-beige text-xl max-w-2xl mx-auto">
            {isRTL
              ? 'نقدم لك تجربة استثنائية في عالم الأثاث الفاخر'
              : 'We offer an exceptional experience in premium furniture'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-gold/50 transition-all duration-500 hover:transform hover:-translate-y-2"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:to-transparent rounded-2xl transition-all duration-500"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors">
                  {isRTL ? feature.titleAr : feature.titleEn}
                </h3>

                {/* Description */}
                <p className="text-beige/80 leading-relaxed">
                  {isRTL ? feature.descriptionAr : feature.descriptionEn}
                </p>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/50 transition-all duration-300 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/0 group-hover:border-gold/50 transition-all duration-300 rounded-bl-lg"></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://wa.me/201020883895?text=مرحباً، أريد معرفة المزيد عن خدماتكم"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-3 text-lg px-8 py-4"
          >
            <span>💬</span>
            {isRTL ? 'تواصل معنا الآن' : 'Contact Us Now'}
          </a>
        </div>
      </div>
    </section>
  );
}
