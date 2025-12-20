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
              width={120}
              height={50}
              className="h-12 w-auto"
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="container-custom py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-medium py-2 ${pathname === link.href ? 'text-gold' : 'text-deep-brown'}`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2" />
            <Link href={`/${switchLocale}${currentPath}`} className="flex items-center gap-2 text-deep-brown font-medium py-2">
              <FaGlobe />
              <span>{locale === 'en' ? 'عربي' : 'English'}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
