'use client';

import { useCart } from '@/context/CartContext';
import { FaTimes, FaTrash, FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSidebar({ locale = 'en' }) {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const isRTL = locale === 'ar';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : (isRTL ? '-translate-x-full' : 'translate-x-full')
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-cream">
          <h2 className="text-xl font-bold flex items-center gap-2 text-deep-brown">
            <FaShoppingCart />
            {isRTL ? 'عربة التسوق' : 'Shopping Cart'}
            <span className="text-sm font-normal text-gray-500">({cartItems.length})</span>
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 h-[calc(100vh-180px)]">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <FaShoppingCart size={48} className="mb-4 opacity-20" />
              <p className="text-lg mb-2">{isRTL ? 'عربة التسوق فارغة' : 'Your cart is empty'}</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gold hover:underline"
              >
                {isRTL ? 'تصفح المنتجات' : 'Start Shopping'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 relative group">
                  {/* Image */}
                  <div className="relative w-20 h-20 bg-white rounded overflow-hidden flex-shrink-0">
                    {item.product.image?.url ?(
                      <Image src={item.product.image.url} alt="product" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-deep-brown text-sm line-clamp-1">
                      {isRTL ? item.product.title_ar : item.product.title_en}
                    </h3>
                    <p className="text-gold font-bold text-sm mb-2">
                      {item.price.toLocaleString()} EGP
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                       <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                       >-</button>
                       <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                       <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100"
                       >+</button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">{isRTL ? 'المجموع' : 'Subtotal'}</span>
              <span className="text-xl font-bold text-deep-brown">{totalPrice.toLocaleString()} EGP</span>
            </div>

            <Link
              href={`/${locale}/checkout`}
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-deep-brown text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gold transition-colors"
            >
              {isRTL ? 'إتمام الشراء' : 'Checkout'}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
