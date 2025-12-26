'use client';

import AnimatedCounter from './AnimatedCounter';

const stats = [
  { value: 25, suffix: '+', icon: '🏆', labelEn: 'Years Experience', labelAr: 'سنة خبرة' },
  { value: 500, suffix: '+', icon: '🏠', labelEn: 'Projects Done', labelAr: 'مشروع منجز' },
  { value: 1200, suffix: '+', icon: '😊', labelEn: 'Happy Clients', labelAr: 'عميل سعيد' },
  { value: 50, suffix: '+', icon: '🤝', labelEn: 'Corporate Partners', labelAr: 'شريك مؤسسي' },
];

export default function StatsSection({ locale = 'en' }) {
  const isRTL = locale === 'ar';

  return (
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
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10">
                <div className="text-5xl mb-4 icon-bounce">{stat.icon}</div>
                <div className="stat-number">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2000 + (index * 200)}
                  />
                </div>
                <div className="text-beige text-lg mt-2">
                  {isRTL ? stat.labelAr : stat.labelEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
