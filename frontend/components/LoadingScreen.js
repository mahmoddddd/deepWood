'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Complete hide after 2 seconds
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-deep-brown via-matte-black to-deep-brown flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A962' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gold/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Rotating Ring */}
            <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 border-4 border-gold/30 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 w-28 h-28 md:w-36 md:h-36 border-4 border-transparent border-t-gold rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>

            {/* Logo Center */}
            <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
              <div className="text-4xl md:text-5xl animate-pulse">🪵</div>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-beige">Deep</span>
          <span className="text-gold">Wood</span>
        </h1>

        {/* Tagline */}
        <p className="text-beige/60 text-sm md:text-base mb-8 tracking-wider">
          Premium Furniture & Woodwork
        </p>

        {/* Loading Bar */}
        <div className="w-48 md:w-64 h-1 bg-beige/20 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold via-amber-400 to-gold rounded-full loading-bar"
          ></div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes loadingBar {
          0% {
            width: 0%;
            transform: translateX(0);
          }
          50% {
            width: 80%;
          }
          100% {
            width: 100%;
          }
        }

        .loading-bar {
          animation: loadingBar 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
