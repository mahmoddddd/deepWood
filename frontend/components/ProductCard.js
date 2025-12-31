'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product, locale = 'en' }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const isRTL = locale === 'ar';

  const {
    title_en,
    title_ar,
    price,
    salePrice,
    image,
    category,
    slug,
    inStock
  } = product;

  // Fallback values if data is missing
  const title = isRTL ? (title_ar || title_en) : (title_en || title_ar);
  const categoryName = category ? (isRTL ? (category.name_ar || category.name_en) : (category.name_en || category.name_ar)) : '';
  const imageUrl = image?.url || '/images/placeholder.jpg';

  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  const currentPrice = salePrice || price;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation if clicking the button
    setIsAdding(true);

    // Add item to cart
    addToCart(product, 1);

    // Reset loading state after a brief animation delay
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Product Image */}
      <Link href={`/${locale}/shop/${slug}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-sm">
              {isRTL ? 'نفذت الكمية' : 'Out of Stock'}
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
              {isRTL ? 'جديد' : 'New'}
            </span>
          )}
        </div>

        {/* Quick Action Overlay (Desktop) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
              isAdding
                ? 'bg-green-500 text-white'
                : 'bg-white text-deep-brown hover:bg-gold hover:text-white'
            }`}
            title={isRTL ? "أضف للسلة" : "Add to Cart"}
          >
            <FaShoppingCart size={16} />
          </button>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-deep-brown hover:bg-gold hover:text-white transition-all transform hover:scale-110">
            <FaEye size={16} />
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-1 hover:text-gold transition-colors">
          {categoryName}
        </p>

        {/* Title */}
        <Link href={`/${locale}/shop/${slug}`}>
          <h3 className="font-semibold text-deep-brown mb-2 line-clamp-1 hover:text-gold transition-colors">
            {title}
          </h3>
        </Link>

        {/* Price & Add Button (Mobile Friendly Layout) */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            {salePrice ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {price.toLocaleString()} EGP
                </span>
                <span className="font-bold text-red-600 text-lg">
                  {salePrice.toLocaleString()} <span className="text-xs font-normal">EGP</span>
                </span>
              </>
            ) : (
              <span className="font-bold text-deep-brown text-lg">
                {price.toLocaleString()} <span className="text-xs font-normal">EGP</span>
              </span>
            )}
          </div>

          {/* Mobile Add to Cart Button (Always visible on mobile) */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className={`md:hidden flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              inStock
                ? (isAdding ? 'bg-green-500 text-white' : 'bg-gold/10 text-gold')
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FaShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
