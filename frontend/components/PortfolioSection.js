'use client';

import { useState } from 'react';
import Image from 'next/image';

// Portfolio categories
const categories = {
  all: { en: 'All Projects', ar: 'جميع المشاريع' },
  corporate: { en: 'Corporate', ar: 'الشركات' },
  residential: { en: 'Residential', ar: 'المنازل' },
};

// Portfolio items - You can add your own images here
const portfolioItems = [
  // Corporate Projects
  {
    id: 1,
    category: 'corporate',
    image: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM.jpeg',
    titleEn: 'Toyota Showroom',
    titleAr: 'معرض تويوتا',
    descriptionEn: 'Complete showroom furniture and displays',
    descriptionAr: 'تأثيث كامل للمعرض والديسبلاي',
    client: 'Toyota Egypt',
  },
  {
    id: 2,
    category: 'corporate',
    image: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM (1).jpeg',
    titleEn: 'Toshiba Office',
    titleAr: 'مكاتب توشيبا',
    descriptionEn: 'Executive office furniture',
    descriptionAr: 'أثاث مكاتب تنفيذية',
    client: 'Toshiba El Araby',
  },
  {
    id: 3,
    category: 'corporate',
    image: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM (2).jpeg',
    titleEn: 'Tornado Exhibition',
    titleAr: 'معرض تورنيدو',
    descriptionEn: 'Exhibition stands and displays',
    descriptionAr: 'ستاندات المعارض والعروض',
    client: 'Tornado',
  },
  // Residential Projects
  {
    id: 4,
    category: 'residential',
    image: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM (3).jpeg',
    titleEn: 'Modern Living Room',
    titleAr: 'غرفة معيشة عصرية',
    descriptionEn: 'Custom living room furniture',
    descriptionAr: 'أثاث غرفة معيشة مخصص',
    client: 'Private Villa',
  },
  {
    id: 5,
    category: 'residential',
    image: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.14 AM.jpeg',
    titleEn: 'Luxury Bedroom',
    titleAr: 'غرفة نوم فاخرة',
    descriptionEn: 'Master bedroom set',
    descriptionAr: 'طقم غرفة نوم رئيسية',
    client: 'Private Home',
  },
  {
    id: 6,
    category: 'residential',
    image: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.14 AM (1).jpeg',
    titleEn: 'Dining Room',
    titleAr: 'غرفة طعام',
    descriptionEn: 'Elegant dining furniture',
    descriptionAr: 'أثاث سفرة أنيق',
    client: 'Private Home',
  },
];

export default function PortfolioSection({ locale = 'en' }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const isRTL = locale === 'ar';

  const filteredItems = activeCategory === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section className="py-20 bg-cream">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="gold-line mx-auto mb-4"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-3">
            {isRTL ? 'أعمالنا' : 'Our Work'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isRTL
              ? 'نفتخر بتقديم أفضل الحلول للشركات والمنازل'
              : 'We proudly serve both corporate and residential clients'}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 md:gap-4 mb-10 flex-wrap">
          {Object.entries(categories).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === key
                  ? 'bg-deep-brown text-white shadow-lg'
                  : 'bg-white text-deep-brown hover:bg-beige border border-gray-200'
              }`}
            >
              {isRTL ? value.ar : value.en}
              {key !== 'all' && (
                <span className={`ml-2 text-sm ${activeCategory === key ? 'text-gold' : 'text-gray-400'}`}>
                  ({portfolioItems.filter(i => i.category === key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Category Description */}
        {activeCategory !== 'all' && (
          <div className={`text-center mb-8 p-4 rounded-xl ${
            activeCategory === 'corporate' ? 'bg-blue-50' : 'bg-amber-50'
          }`}>
            <span className="text-2xl mr-2">
              {activeCategory === 'corporate' ? '🏢' : '🏠'}
            </span>
            <span className="font-medium text-deep-brown">
              {activeCategory === 'corporate'
                ? (isRTL ? 'مشاريع الشركات والمصانع' : 'Corporate & Factory Projects')
                : (isRTL ? 'مشاريع المنازل والفيلات' : 'Homes & Villas Projects')}
            </span>
          </div>
        )}

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={isRTL ? item.titleAr : item.titleEn}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category Badge */}
                <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} px-3 py-1 rounded-full text-xs font-medium ${
                  item.category === 'corporate'
                    ? 'bg-blue-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  {item.category === 'corporate'
                    ? (isRTL ? 'شركات' : 'Corporate')
                    : (isRTL ? 'منازل' : 'Residential')}
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-deep-brown mb-1">
                  {isRTL ? item.titleAr : item.titleEn}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  {isRTL ? item.descriptionAr : item.descriptionEn}
                </p>
                <div className="flex items-center gap-2 text-gold text-sm">
                  <span>🏷️</span>
                  <span>{item.client}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <a
            href={`/${locale}/gallery`}
            className="btn-gold inline-flex items-center gap-2"
          >
            <span>📸</span>
            {isRTL ? 'عرض كل الأعمال' : 'View All Projects'}
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
            >
              ✕
            </button>
            <div className="relative h-96">
              <Image
                src={selectedItem.image}
                alt={isRTL ? selectedItem.titleAr : selectedItem.titleEn}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                selectedItem.category === 'corporate'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {selectedItem.category === 'corporate'
                  ? (isRTL ? '🏢 مشروع شركات' : '🏢 Corporate Project')
                  : (isRTL ? '🏠 مشروع سكني' : '🏠 Residential Project')}
              </div>
              <h3 className="text-2xl font-bold text-deep-brown mb-2">
                {isRTL ? selectedItem.titleAr : selectedItem.titleEn}
              </h3>
              <p className="text-gray-600 mb-3">
                {isRTL ? selectedItem.descriptionAr : selectedItem.descriptionEn}
              </p>
              <div className="flex items-center gap-2 text-gold">
                <span>🏷️</span>
                <span className="font-medium">{selectedItem.client}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
