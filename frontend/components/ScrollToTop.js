'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / height) * 100;

      setScrollProgress(progress);
      setIsVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-50 group"
      aria-label="Scroll to top"
    >
      {/* Progress Ring */}
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
        {/* Background Circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-gray-300/30"
          strokeWidth="2"
        />
        {/* Progress Circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-gold"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${scrollProgress}, 100`}
        />
      </svg>

      {/* Button Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 bg-deep-brown hover:bg-gold rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
          <FaArrowUp className="w-4 h-4 text-white group-hover:text-deep-brown transition-colors" />
        </div>
      </div>
    </button>
  );
}
