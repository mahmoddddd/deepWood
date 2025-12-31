'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useSettings } from '@/context/SettingsContext';

export default function Footer({ locale, translations }) {
  const { settings } = useSettings();
  const t = translations.footer;
  const nav = translations.nav;

  const navLinks = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/services`, label: nav.services },
    { href: `/${locale}/portfolio`, label: nav.portfolio },
    { href: `/${locale}/shop`, label: nav.shop },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  return (
    <footer className="bg-matte-black text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="inline-block mb-4">
              <span className="text-2xl font-bold">{settings?.storeName || 'Deep Wood'}</span>
            </Link>
            <p className="text-gray-400 mb-6">{t.description}</p>
            <div className="flex gap-4">
              {settings?.socialLinks?.facebook && <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><FaFacebook size={20} /></a>}
              {settings?.socialLinks?.instagram && <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><FaInstagram size={20} /></a>}
              {settings?.socialLinks?.twitter && <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><FaTwitter size={20} /></a>}
              {settings?.whatsappNumber && <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><FaWhatsapp size={20} /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">{t.quickLinks}</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">{t.contactInfo}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-gold" />
                <span>{settings?.address || t.address}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaPhone className="text-gold" />
                <span>{settings?.contactPhone || t.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-gold" />
                <span>{settings?.contactEmail || t.email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">{t.followUs}</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates.</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Email" className="flex-1 px-4 py-2 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold" />
              <button type="submit" className="px-4 py-2 bg-gold text-deep-brown rounded-md font-medium hover:bg-white transition-colors">→</button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Deep Wood. {t.rights}.</p>
        </div>
      </div>
    </footer>
  );
}
