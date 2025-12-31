'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp, FaArrowRight, FaCheckCircle, FaLock } from 'react-icons/fa';

export default function CheckoutPage({ params }) {
  const locale = params.locale || 'en';
  const isRTL = locale === 'ar';
  const router = useRouter();

  const { cartItems, totalPrice, clearCart } = useCart();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    governorate: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  const shippingCost = settings?.shippingCost || 0;
  const discountAmount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const finalTotal = Math.max(0, totalPrice + shippingCost - discountAmount);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsCheckingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderTotal: totalPrice })
      });
      const data = await res.json();

      if (data.success) {
        setAppliedCoupon(data.data);
        setCouponCode('');
      } else {
        setCouponError(data.error);
        setAppliedCoupon(null);
      }
    } catch (error) {
       console.error('Coupon Error:', error);
       setCouponError('Failed to validate coupon');
    } finally {
       setIsCheckingCoupon(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Prepare Order Data
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          governorate: formData.governorate,
          country: 'Egypt'
        },
        items: cartItems.map(item => ({
          product: item.product._id,
          title_en: item.product.title_en,
          title_ar: item.product.title_ar,
          price: item.price,
          quantity: item.quantity,
          image: item.product.image?.url
        })),
        subtotal: totalPrice,
        shippingCost,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        total: finalTotal,
        paymentMethod: 'whatsapp',
        customerNotes: formData.notes,
        language: locale
      };

      // 2. Send to Backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.data.orderNumber);
        setOrderComplete(true);
        clearCart();

        // 3. Prepare WhatsApp Message
        const message = isRTL
          ? `مرحباً ديب وود، لقد قمت بطلب جديد رقم ${data.data.orderNumber}.\nالاسم: ${orderData.customerName}\nالإجمالي: ${finalTotal} ج.م`
          : `Hello Deep Wood, I just placed a new order #${data.data.orderNumber}.\nName: ${orderData.customerName}\nTotal: ${finalTotal} EGP`;

        // Redirect to WhatsApp in a new tab
        window.open(`https://wa.me/${settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201020883895'}?text=${encodeURIComponent(message)}`, '_blank');
      } else {
        alert('Something went wrong. Please try again.');
      }

    } catch (error) {
      console.error('Checkout Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-deep-brown mb-2">{isRTL ? 'تم استلام طلبك بنجاح!' : 'Order Placed Successfully!'}</h1>
          <p className="text-gray-600 mb-6">
            {isRTL
              ? `رقم طلبك هو #${orderId}. سنتواصل معك قريباً لتأكيد التفاصيل.`
              : `Your order number is #${orderId}. We will contact you shortly to confirm details.`}
          </p>
          <div className="space-y-3">
            <Link href={`/${locale}/shop`} className="btn-gold w-full block">
              {isRTL ? 'متابعة التسوق' : 'Continue Shopping'}
            </Link>
            <Link href="/" className="btn-secondary w-full block text-center">
              {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-center px-4">
        <h1 className="text-2xl font-bold mb-4">{isRTL ? 'سلة التسوق فارغة' : 'Your cart is empty'}</h1>
        <Link href={`/${locale}/shop`} className="text-gold hover:underline">
          {isRTL ? 'تصفح المنتجات' : 'Browse Products'}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-deep-brown mb-8 text-center">{isRTL ? 'إتمام الطلب' : 'Checkout'}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-deep-brown text-white rounded-full flex items-center justify-center text-sm">1</span>
                {isRTL ? 'بيانات الشحن' : 'Shipping Information'}
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'الاسم الأول' : 'First Name'}</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold outline-none"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'اسم العائلة' : 'Last Name'}</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold outline-none"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold outline-none"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold outline-none"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'العنوان' : 'Address'}</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder={isRTL ? 'اسم الشارع، رقم المبنى، الشقة' : 'Street Name, Building No, Apartment'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold outline-none"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'المدينة' : 'City'}</label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold outline-none"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'المحافظة' : 'Governorate'}</label>
                    <select
                      name="governorate"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold outline-none"
                      value={formData.governorate}
                      onChange={handleInputChange}
                    >
                      <option value="">{isRTL ? 'اختر المحافظة' : 'Select Governorate'}</option>
                      <option value="Cairo">Cairo</option>
                      <option value="Giza">Giza</option>
                      <option value="Alexandria">Alexandria</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}</label>
                  <textarea
                    name="notes"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold outline-none"
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-deep-brown text-white rounded-full flex items-center justify-center text-sm">2</span>
                {isRTL ? 'طريقة الدفع' : 'Payment Method'}
              </h2>
              <div className="border border-gold/30 bg-gold/5 p-4 rounded-lg flex items-center gap-4">
                 <FaWhatsapp className="text-green-500 text-2xl" />
                 <div>
                   <h3 className="font-bold text-deep-brown">{isRTL ? 'تأكيد الطلب عبر واتساب' : 'Confirm Order via WhatsApp'}</h3>
                   <p className="text-sm text-gray-600">{isRTL ? 'سنقوم بمراجعة التفاصيل وترتيب الدفع والشحن معك مباشرة.' : 'We will review details and arrange payment & shipping with you directly.'}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">{isRTL ? 'ملخص الطلب' : 'Order Summary'}</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={`${item.product._id}-${item.variantKey}`} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {item.product.image?.url && <Image src={item.product.image.url} alt="product" fill className="object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-deep-brown line-clamp-2">{isRTL ? item.product.title_ar : item.product.title_en}</h4>
                      {/* Variant Display */}
                      {item.selectedVariant && (
                          <div className="text-xs text-gray-500 mt-0.5">
                             {item.selectedVariant.color && (
                                <span className="mr-1 after:content-['|'] after:mr-1 after:text-gray-300 last:after:content-none">
                                   {isRTL ? item.selectedVariant.color.name_ar : item.selectedVariant.color.name_en}
                                </span>
                             )}
                             {item.selectedVariant.size && (
                                <span>
                                  {isRTL ? item.selectedVariant.size.dimensions_ar : item.selectedVariant.size.dimensions_en}
                                </span>
                             )}
                          </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{item.quantity} x {item.price.toLocaleString()} EGP</p>
                    </div>
                    <div className="font-bold text-sm">
                      {(item.price * item.quantity).toLocaleString()} EGP
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100 mb-6">

               {/* Coupon Section */}
               <div className="mb-4">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder={isRTL ? 'كود الخصم' : 'Coupon Code'}
                            className="flex-1 px-3 py-2 border rounded-lg text-sm uppercase font-mono"
                        />
                         <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={isCheckingCoupon || !couponCode}
                            className="bg-deep-brown text-white px-4 py-2 rounded-lg text-sm hover:bg-gold disabled:opacity-50"
                         >
                            {isCheckingCoupon ? '...' : (isRTL ? 'تطبيق' : 'Apply')}
                         </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-green-50 p-2 rounded-lg border border-green-200">
                        <span className="text-sm text-green-700 font-medium">
                            {isRTL ? 'تم تطبيق الكوبون:' : 'Coupon Applied:'} <strong>{appliedCoupon.code}</strong>
                        </span>
                        <button
                            type="button"
                            onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                            className="text-red-500 hover:text-red-700 text-xs underline"
                        >
                            {isRTL ? 'إزالة' : 'Remove'}
                        </button>
                    </div>
                  )}
                  {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
               </div>

                <div className="flex justify-between text-gray-600">
                   <span>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                   <span>{totalPrice.toLocaleString()} EGP</span>
                </div>

                {/* Discount Display */}
                {appliedCoupon && (
                   <div className="flex justify-between text-green-600 font-medium">
                       <span>{isRTL ? 'خصم' : 'Discount'} ({appliedCoupon.code})</span>
                       <span>- {discountAmount.toLocaleString()} EGP</span>
                   </div>
                )}

                <div className="flex justify-between text-gray-600">
                   <span>{isRTL ? 'الشحن' : 'Shipping'}</span>
                   <span className="text-green-600 font-medium">{isRTL ? 'مجاني' : 'Free'}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-deep-brown pt-2 border-t mt-2">
                   <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                   <span>{finalTotal.toLocaleString()} EGP</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (isRTL ? 'جاري التنفيذ...' : 'Processing...') : (
                  <>
                    <FaWhatsapp size={20} />
                    {isRTL ? 'تأكيد الطلب' : 'Place Order'}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                <FaLock size={10} />
                {isRTL ? 'بياناتك آمنة ومشفرة' : 'Your data is secure and encrypted'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
