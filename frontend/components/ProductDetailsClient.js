'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaShoppingCart, FaWhatsapp, FaRuler, FaCube, FaCheck, FaPhone } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

export default function ProductDetailsClient({ product, locale = 'en' }) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.image?.url);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const isRTL = locale === 'ar';

  // Destructure product data allowing for bilingual support fallback
  const title = isRTL ? (product.title_ar || product.title_en) : (product.title_en || product.title_ar);
  const description = isRTL ? (product.description_ar || product.description_en) : (product.description_en || product.description_ar);
  const categoryName = product.category ? (isRTL ? (product.category.name_ar || product.category.name_en) : (product.category.name_en || product.category.name_ar)) : '';

  const price = product.price;
  const salePrice = product.salePrice;
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const images = [
    product.image,
    ...(product.gallery || [])
  ].filter(img => img && img.url);

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square md:aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={title}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-{discount}%</span>}
              {!product.inStock && <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold">{isRTL ? 'نفذت الكمية' : 'Out of Stock'}</span>}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImage === img.url ? 'border-gold' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image src={img.url} alt={`${title} ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div>
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-500 mb-4 flex gap-2">
            <span className="hover:text-gold cursor-pointer">{isRTL ? 'المتجر' : 'Shop'}</span>
            <span>&gt;</span>
            <span className="hover:text-gold cursor-pointer">{categoryName}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-deep-brown mb-2">{title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <p className="text-gold font-medium text-lg">{categoryName}</p>
            {product.sku && (
              <p className="text-gray-400 text-sm flex items-center gap-1 border-l pl-4 border-gray-200">
                <span className="font-medium">{isRTL ? 'الكود:' : 'SKU:'}</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 select-all font-bold tracking-wider">
                  {product.sku}
                </span>
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-8">
            {salePrice ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  {salePrice.toLocaleString()} <span className="text-lg">EGP</span>
                </span>
                <span className="text-xl text-gray-400 line-through mb-1">
                  {price.toLocaleString()} EGP
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-deep-brown">
                {price.toLocaleString()} <span className="text-lg">EGP</span>
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            {product.inStock ? (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <FaCheck /> {isRTL ? 'متوفر في المخزون' : 'In Stock'}
              </span>
            ) : (
              <span className="text-red-500 font-medium">{isRTL ? 'غير متوفر حالياً' : 'Currently Unavailable'}</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {product.inStock && (
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-100 text-lg transition-colors"
                  >−</button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2 hover:bg-gray-100 text-lg transition-colors"
                  >+</button>
                </div>

                {/* Main Action Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-lg transition-all ${
                    isAdding
                      ? 'bg-green-600 text-white scale-95'
                      : 'bg-deep-brown text-white hover:bg-gold hover:translate-y-[-2px] shadow-lg'
                  }`}
                >
                  <FaShoppingCart />
                  {isAdding
                    ? (isRTL ? 'تم الإضافة!' : 'Added!')
                    : (isRTL ? 'أضف إلى السلة' : 'Add to Cart')}
                </button>
              </div>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201020883895'}?text=I'm interested in: ${title} - Price: ${price} EGP`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-green-500 text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors"
              >
                <FaWhatsapp size={20} />
                {isRTL ? 'طلب عبر واتساب' : 'Order via WhatsApp'}
              </a>
            </div>
          )}

          {/* Description */}
          <div className="prose prose-stone max-w-none text-gray-600 mb-8">
            <h3 className="text-lg font-semibold text-deep-brown mb-2">{isRTL ? 'الوصف' : 'Description'}</h3>
            <p className="whitespace-pre-line leading-relaxed">{description}</p>
          </div>

          {/* Specifications */}
          {product.dimensions && (
             <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg text-gold shadow-sm">
                    <FaRuler size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-deep-brown text-sm">{isRTL ? 'الأبعاد' : 'Dimensions'}</h4>
                    <p className="text-sm text-gray-600">
                      {product.dimensions.width}x{product.dimensions.height}x{product.dimensions.depth} cm
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg text-gold shadow-sm">
                    <FaCube size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-deep-brown text-sm">{isRTL ? 'الخامة' : 'Material'}</h4>
                    <p className="text-sm text-gray-600 font-inter">
                      {isRTL ? product.materials_ar?.join(', ') : product.materials_en?.join(', ') || 'Premium Wood'}
                    </p>
                  </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
