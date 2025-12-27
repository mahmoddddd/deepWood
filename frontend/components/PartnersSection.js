'use client';

// Toyota Logo SVG Component
const ToyotaLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 200 130" fill="currentColor">
    <ellipse cx="100" cy="65" rx="95" ry="60" fill="none" stroke="currentColor" strokeWidth="6"/>
    <ellipse cx="100" cy="65" rx="60" ry="35" fill="none" stroke="currentColor" strokeWidth="5"/>
    <ellipse cx="100" cy="65" rx="28" ry="14" fill="none" stroke="currentColor" strokeWidth="4"/>
    <path d="M100 5 L100 125" stroke="currentColor" strokeWidth="5"/>
  </svg>
);

// Toshiba Logo SVG Component
const ToshibaLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 280 60" fill="currentColor">
    <text x="140" y="45" textAnchor="middle" fontSize="42" fontWeight="bold" fontFamily="Arial, sans-serif" fill="currentColor">
      TOSHIBA
    </text>
  </svg>
);

// Tornado Logo SVG Component
const TornadoLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 260 60" fill="currentColor">
    <text x="130" y="45" textAnchor="middle" fontSize="38" fontWeight="bold" fontFamily="Arial, sans-serif" fill="currentColor">
      TORNADO
    </text>
  </svg>
);

const partners = [
  {
    id: 1,
    name: 'Toyota',
    nameAr: 'تويوتا',
    Logo: ToyotaLogo,
    description: 'Office & Showroom Furniture',
    descriptionAr: 'أثاث المكاتب والمعارض',
  },
  {
    id: 2,
    name: 'Toshiba',
    nameAr: 'توشيبا العربي',
    Logo: ToshibaLogo,
    description: 'Factory & Exhibition Stands',
    descriptionAr: 'أثاث المصانع والمعارض',
  },
  {
    id: 3,
    name: 'Tornado',
    nameAr: 'تورنيدو',
    Logo: TornadoLogo,
    description: 'Showroom Displays',
    descriptionAr: 'ديكورات المعارض',
  },
];

export default function PartnersSection({ locale = 'en' }) {
  const isRTL = locale === 'ar';

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="gold-line mx-auto mb-4"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-deep-brown mb-2">
            {isRTL ? 'شركاؤنا في النجاح' : 'Our Success Partners'}
          </h2>
          <p className="text-gray-500">
            {isRTL ? 'نفتخر بثقة أكبر المصانع والشركات' : 'Trusted by leading factories & companies'}
          </p>
        </div>

        {/* Logos Row */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group flex flex-col items-center"
            >
              {/* Logo */}
              <div className="w-32 md:w-40 h-20 flex items-center justify-center mb-3 transition-all duration-300 text-gray-300 group-hover:text-deep-brown">
                <partner.Logo className="w-full h-full" />
              </div>

              {/* Name below logo */}
              <p className="text-sm text-gray-400 group-hover:text-gold transition-colors">
                {isRTL ? partner.descriptionAr : partner.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm">
            {isRTL
              ? '+ العديد من الشركات الأخرى تثق بجودة أعمالنا'
              : '+ Many more companies trust our quality work'}
          </p>
        </div>
      </div>
    </section>
  );
}
