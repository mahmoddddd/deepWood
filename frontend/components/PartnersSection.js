'use client';

import Image from 'next/image';

const partners = [
  {
    id: 1,
    name: 'Toyota',
    nameAr: 'تويوتا',
    logo: '/imagesss/logos/toyotaLogo.jpeg',
    description: 'Office & Showroom Furniture',
    descriptionAr: 'أثاث المكاتب والمعارض',
  },
  {
    id: 2,
    name: 'Toshiba',
    nameAr: 'توشيبا العربي',
    logo: '/imagesss/logos/toshiba.png',
    description: 'Factory & Exhibition Stands',
    descriptionAr: 'أثاث المصانع والمعارض',
  },
  {
    id: 3,
    name: 'Raya',
    nameAr: 'راية',
    logo: '/imagesss/logos/raya.jpeg',
    description: 'Corporate Furniture',
    descriptionAr: 'أثاث الشركات',
  },
  {
    id: 4,
    name: 'Tornado',
    nameAr: 'تورنيدو',
    // Fallback to text if no image provided yet, or keep consistent style if image available later
    logo: null,
    description: 'Showroom Displays',
    descriptionAr: 'ديكورات المعارض',
    color: '#0066B3', // Tornado blue for text fallback
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
              <div className="w-32 md:w-40 h-24 flex items-center justify-center mb-3 transition-all duration-300 grayscale hover:grayscale-0 bg-white rounded-lg p-2 shadow-sm hover:shadow-md border border-gray-100">
                {partner.logo ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span
                    className="text-xl font-bold transition-colors"
                    style={{ color: '#9CA3AF' }}
                  >
                    {partner.name}
                  </span>
                )}
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
