'use client';

import { useState } from 'react';
import { FaTimes, FaWhatsapp, FaPercent } from 'react-icons/fa';

export default function AnnouncementBar({ locale = 'en' }) {
  const [isVisible, setIsVisible] = useState(true);
  const isRTL = locale === 'ar';

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-gold via-amber-400 to-gold text-deep-brown relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer" />

      <div className="container-custom py-2 relative">
        <div className="flex items-center justify-center gap-4 text-sm font-medium">
          {/* Icon */}
          <span className="animate-bounce">🎉</span>

          {/* Message */}
          <p className="text-center">
            {isRTL
              ? '🔥 خصم 15% على جميع غرف النوم لفترة محدودة!'
              : '🔥 15% OFF on all bedrooms for a limited time!'}
          </p>

          {/* CTA Button */}
          <a
            href="https://wa.me/201020883895?text=أريد%20الاستفسار%20عن%20عرض%20الخصم"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 bg-deep-brown text-white px-3 py-1 rounded-full text-xs hover:bg-matte-black transition-colors"
          >
            <FaWhatsapp className="w-3 h-3" />
            {isRTL ? 'تواصل الآن' : 'Contact Now'}
          </a>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
          aria-label="Close announcement"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}
