'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { imagesByCategory } from '@/lib/galleryImages';

export default function FilterableGallery({ locale }) {
  const isRTL = locale === 'ar';
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', label: isRTL ? 'الكل' : 'All', icon: '🏠' },
    { id: 'living-room', label: isRTL ? 'غرفة المعيشة' : 'Living Room', icon: '🛋️' },
    { id: 'bedroom', label: isRTL ? 'غرفة النوم' : 'Bedroom', icon: '🛏️' },
    { id: 'dining', label: isRTL ? 'غرفة الطعام' : 'Dining Room', icon: '🍽️' },
    { id: 'office', label: isRTL ? 'المكتب' : 'Office', icon: '💼' },
    { id: 'kitchen', label: isRTL ? 'المطبخ' : 'Kitchen', icon: '🍳' },
  ];

  // Images are now loaded from Cloudinary via @/lib/galleryImages

  // Get category label
  const getCategoryLabel = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.label : categoryId;
  };

  // Get all images or filtered images
  const getFilteredImages = () => {
    if (activeCategory === 'all') {
      const allImages = [];
      Object.keys(imagesByCategory).forEach(category => {
        imagesByCategory[category].forEach(img => {
          allImages.push({ ...img, category, caption: getCategoryLabel(category) });
        });
      });
      return allImages;
    }
    return imagesByCategory[activeCategory]?.map(img => ({
      ...img,
      category: activeCategory,
      caption: getCategoryLabel(activeCategory)
    })) || [];
  };

  const filteredImages = getFilteredImages();

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (selectedIndex === null) return;

    switch (e.key) {
      case 'ArrowRight':
        setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
        setIsLoading(true);
        break;
      case 'ArrowLeft':
        setSelectedIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
        setIsLoading(true);
        break;
      case 'Escape':
        setSelectedIndex(null);
        break;
    }
  }, [selectedIndex, filteredImages.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  const openLightbox = (index) => {
    setSelectedIndex(index);
    setIsLoading(true);
  };

  const closeLightbox = () => setSelectedIndex(null);

  const goNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
    setIsLoading(true);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    setIsLoading(true);
  };

  return (
    <>
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setSelectedIndex(null);
            }}
            className={`px-6 py-3 rounded-full border-2 font-medium transition-all duration-300 flex items-center gap-2 ${
              activeCategory === category.id
                ? 'bg-deep-brown text-white border-deep-brown shadow-lg scale-105'
                : 'text-deep-brown border-deep-brown/30 hover:border-deep-brown hover:bg-deep-brown/5'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
            {activeCategory === category.id && (
              <span className="bg-gold text-deep-brown text-xs px-2 py-0.5 rounded-full">
                {category.id === 'all'
                  ? Object.values(imagesByCategory).flat().length
                  : imagesByCategory[category.id]?.length || 0
                }
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-center mb-8">
        <p className="text-warm-gray">
          {isRTL ? `عرض ${filteredImages.length} صورة` : `Showing ${filteredImages.length} images`}
          {activeCategory !== 'all' && (
            <span className="text-gold font-medium"> {isRTL ? 'في' : 'in'} {getCategoryLabel(activeCategory)}</span>
          )}
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredImages.map((image, index) => (
          <div
            key={`${image.category}-${index}`}
            className="gallery-item group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.src}
              alt={image.alt || `Gallery image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-matte-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-medium">{image.caption}</p>
                <div className="flex items-center gap-2 mt-2 text-gold text-sm">
                  <span>🔍</span>
                  <span>{isRTL ? 'اضغط للتكبير' : 'Click to enlarge'}</span>
                </div>
              </div>
            </div>
            <div className="absolute top-3 left-3 bg-gold text-deep-brown text-xs px-2 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {getCategoryLabel(image.category)}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && filteredImages[selectedIndex] && (
        <div className="fixed inset-0 z-50 bg-matte-black/95 backdrop-blur-md flex items-center justify-center" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center text-white hover:text-deep-brown transition-all z-10" onClick={closeLightbox}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              <span className="text-gold font-bold">{selectedIndex + 1}</span> / <span>{filteredImages.length}</span>
            </div>
            <div className="bg-gold text-deep-brown px-4 py-2 rounded-full text-sm font-medium">
              {getCategoryLabel(filteredImages[selectedIndex].category)}
            </div>
          </div>

          <button className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center text-white hover:text-deep-brown transition-all z-10" onClick={goPrev}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center text-white hover:text-deep-brown transition-all z-10" onClick={goNext}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4 md:mx-16" onClick={(e) => e.stopPropagation()}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <Image
              src={filteredImages[selectedIndex].src}
              alt={filteredImages[selectedIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              onLoadingComplete={() => setIsLoading(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
