'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const comparisons = [
  {
    id: 1,
    beforeImage: '/imagesss/animation/before1.jpeg',
    afterImage: '/imagesss/animation/after-1.jpeg',
    titleEn: 'Living Room Transformation',
    titleAr: 'تحويل غرفة المعيشة',
    descriptionEn: 'From empty space to luxury living',
    descriptionAr: 'من مساحة فارغة إلى غرفة معيشة فاخرة',
  },
  {
    id: 2,
    beforeImage: '/imagesss/animation/before2.jpg',
    afterImage: '/imagesss/animation/after-2.jpeg',
    titleEn: 'Antique to Artistic Masterpiece',
    titleAr: 'من أنتريه عادي لقطعة فنية',
    descriptionEn: 'Transforming furniture into a unique work of art',
    descriptionAr: 'تحويل الأثاث لتحفة فنية فريدة من نوعها',
  },
];

function ComparisonSlider({ beforeImage, afterImage, titleEn, titleAr, descriptionEn, descriptionAr, isRTL }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div className="group">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize shadow-2xl"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <Image
            src={afterImage}
            alt="After"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* After Label */}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            {isRTL ? 'بعد' : 'After'} ✨
          </div>
        </div>

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt="Before"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Before Label */}
          <div className="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            {isRTL ? 'قبل' : 'Before'} 📷
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-20"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Handle Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-ew-resize border-4 border-gold transition-transform hover:scale-110">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-deep-brown" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
              </svg>
              <svg className="w-3 h-3 text-deep-brown" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </div>
          </div>

          {/* Dashed Line Effect */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px border-l-2 border-dashed border-white/50"></div>
        </div>

        {/* Instructions Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {isRTL ? '👆 اسحب للمقارنة' : '👆 Drag to compare'}
        </div>
      </div>

      {/* Title & Description */}
      <div className="text-center mt-6">
        <h3 className="text-xl font-bold text-deep-brown mb-2">
          {isRTL ? titleAr : titleEn}
        </h3>
        <p className="text-warm-gray">
          {isRTL ? descriptionAr : descriptionEn}
        </p>
      </div>
    </div>
  );
}

export default function BeforeAfterSection({ locale = 'en' }) {
  const isRTL = locale === 'ar';

  return (
    <section className="py-24 bg-gradient-to-br from-beige to-cream">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-deep-brown mb-4">
            {isRTL ? '✨ قبل وبعد' : '✨ Before & After'}
          </h2>
          <p className="text-warm-gray text-xl max-w-2xl mx-auto">
            {isRTL
              ? 'اسحب المؤشر لمشاهدة التحول المذهل في أعمالنا'
              : 'Drag the slider to see the amazing transformation in our work'}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {comparisons.map((item) => (
            <ComparisonSlider
              key={item.id}
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
              titleEn={item.titleEn}
              titleAr={item.titleAr}
              descriptionEn={item.descriptionEn}
              descriptionAr={item.descriptionAr}
              isRTL={isRTL}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://wa.me/201020883895?text=أريد%20رؤية%20المزيد%20من%20أعمالكم"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2 text-lg"
          >
            <span>📸</span>
            {isRTL ? 'شاهد المزيد من أعمالنا' : 'See More of Our Work'}
          </a>
        </div>
      </div>
    </section>
  );
}
