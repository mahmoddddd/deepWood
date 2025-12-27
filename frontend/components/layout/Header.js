'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaGlobe } from 'react-icons/fa';

export default function Header({ locale, translations }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isRTL = locale === 'ar';
  const t = translations.nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t.home },
    { href: `/${locale}/about`, label: t.about },
    { href: `/${locale}/services`, label: t.services },
    { href: `/${locale}/portfolio`, label: t.portfolio },
    { href: `/${locale}/shop`, label: t.shop },
    { href: `/${locale}/contact`, label: t.contact },
  ];

  const switchLocale = locale === 'en' ? 'ar' : 'en';
  const currentPath = pathname.replace(`/${locale}`, '') || '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Deep Wood"
              width={180}
              height={70}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-gold'
                    : isScrolled
                    ? 'text-deep-brown hover:text-gold'
                    : 'text-white hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={`/${switchLocale}${currentPath}`}
              className={`flex items-center gap-2 font-medium ${isScrolled ? 'text-deep-brown' : 'text-white'}`}
            >
              <FaGlobe />
              <span>{locale === 'en' ? 'عربي' : 'EN'}</span>
            </Link>
            <Link href={`/${locale}/contact`} className="btn-gold">
              {translations.hero.contact}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 ${isScrolled ? 'text-deep-brown' : 'text-white'}`}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-4/5 max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 ${
            isOpen
              ? 'translate-x-0'
              : isRTL ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b bg-cream">
            <Image
              src="/images/logo.png"
              alt="Deep Wood"
              width={120}
              height={50}
              className="h-10 w-auto"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-beige text-deep-brown"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="p-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 py-4 px-3 rounded-xl mb-2 font-medium text-lg transition-all ${
                  pathname === link.href
                    ? 'bg-gold/10 text-gold border-l-4 border-gold'
                    : 'text-deep-brown hover:bg-beige'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-cream">
            <Link
              href={`/${switchLocale}${currentPath}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-deep-brown text-white rounded-xl font-medium"
            >
              <FaGlobe />
              <span>{locale === 'en' ? 'العربية' : 'English'}</span>
            </Link>
            <a
              href="https://wa.me/201020883895"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 mt-3 bg-green-500 text-white rounded-xl font-medium"
            >
              <span>💬</span>
              <span>{isRTL ? 'تواصل واتساب' : 'WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
