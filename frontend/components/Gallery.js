'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function Gallery({ images = [], title, subtitle, columns = 3, showTitle = true }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (selectedIndex === null) return;

    switch (e.key) {
      case 'ArrowRight':
        setSelectedIndex((prev) => (prev + 1) % images.length);
        break;
      case 'ArrowLeft':
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
        break;
      case 'Escape':
        setSelectedIndex(null);
        break;
    }
  }, [selectedIndex, images.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  const openLightbox = (index) => {
    setSelectedIndex(index);
    setIsLoading(true);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
    setIsLoading(true);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsLoading(true);
  };

  // Default placeholder images if none provided
  const displayImages = images.length > 0 ? images : [
    { src: '/images/placeholder-1.jpg', alt: 'Gallery Image 1', caption: 'صورة معرض 1' },
    { src: '/images/placeholder-2.jpg', alt: 'Gallery Image 2', caption: 'صورة معرض 2' },
    { src: '/images/placeholder-3.jpg', alt: 'Gallery Image 3', caption: 'صورة معرض 3' },
    { src: '/images/placeholder-4.jpg', alt: 'Gallery Image 4', caption: 'صورة معرض 4' },
    { src: '/images/placeholder-5.jpg', alt: 'Gallery Image 5', caption: 'صورة معرض 5' },
    { src: '/images/placeholder-6.jpg', alt: 'Gallery Image 6', caption: 'صورة معرض 6' },
  ];

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <>
      {/* Gallery Grid */}
      {showTitle && (
        <div className="text-center mb-12">
          <div className="gold-line mx-auto mb-6"></div>
          <h2 className="section-title">{title || 'معرض الصور'}</h2>
          <p className="section-subtitle">{subtitle || 'اكتشف أعمالنا المميزة'}</p>
        </div>
      )}

      <div className={`grid ${gridCols[columns] || gridCols[3]} gap-4 md:gap-6`}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            className="gallery-item group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            {/* Image */}
            <div className="absolute inset-0 bg-gradient-to-br from-deep-brown/20 to-gold/10">
              {image.src ? (
                <Image
                  src={image.src}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-beige to-cream flex items-center justify-center">
                  <span className="text-6xl">🖼️</span>
                </div>
              )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-matte-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {image.caption && (
                  <p className="text-sm md:text-base font-medium">{image.caption}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-gold text-sm">
                  <span>🔍</span>
                  <span>اضغط للتكبير</span>
                </div>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-matte-black/95 backdrop-blur-md flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center text-white hover:text-deep-brown transition-all z-10"
            onClick={closeLightbox}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
            <span className="text-gold font-bold">{selectedIndex + 1}</span>
            <span className="mx-2">/</span>
            <span>{displayImages.length}</span>
          </div>

          {/* Previous Button */}
          <button
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center text-white hover:text-deep-brown transition-all z-10"
            onClick={goPrev}
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center text-white hover:text-deep-brown transition-all z-10"
            onClick={goNext}
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Main Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4 md:mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {displayImages[selectedIndex]?.src ? (
              <Image
                src={displayImages[selectedIndex].src}
                alt={displayImages[selectedIndex].alt || 'Gallery image'}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                onLoadingComplete={() => setIsLoading(false)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="text-9xl block mb-4">🖼️</span>
                  <p className="text-beige">الصورة غير متوفرة</p>
                </div>
              </div>
            )}
          </div>

          {/* Caption */}
          {displayImages[selectedIndex]?.caption && (
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white text-center max-w-lg">
              <p className="font-medium">{displayImages[selectedIndex].caption}</p>
            </div>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2 hide-scrollbar">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(index);
                  setIsLoading(true);
                }}
                className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-gold scale-110'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                {image.src ? (
                  <Image
                    src={image.src}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-beige flex items-center justify-center text-xl">
                    🖼️
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
