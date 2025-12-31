'use client';

import { CartProvider } from '@/context/CartContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { AuthProvider } from '@/context/AuthContext';
import CartSidebar from './CartSidebar';

export default function Providers({ children, locale = 'en' }) {
  return (
    <SettingsProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <CartSidebar locale={locale} />
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
