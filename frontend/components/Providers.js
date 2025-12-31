'use client';

import { CartProvider } from '@/context/CartContext';
import CartSidebar from './CartSidebar';

export default function Providers({ children, locale = 'en' }) {
  return (
    <CartProvider>
      {children}
      <CartSidebar locale={locale} />
    </CartProvider>
  );
}
