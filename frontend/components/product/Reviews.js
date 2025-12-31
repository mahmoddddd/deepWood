'use client';
import { useState, useEffect } from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

// Star Rating Component
const StarRating = ({ rating, setRating, hoverRating, setHoverRating, size = 24 }) => {
    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                    <label key={i} className="cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            className="hidden"
                            value={ratingValue}
                            onClick={() => setRating && setRating(ratingValue)}
                        />
                        <FaStar
                            size={size}
                            className="transition-colors"
                            color={ratingValue <= (hoverRating || rating) ? "#D4AF37" : "#e4e5e9"}
                            onMouseEnter={() => setHoverRating && setHoverRating(ratingValue)}
                            onMouseLeave={() => setHoverRating && setHoverRating(0)}
                        />
                    </label>
                );
            })}
        </div>
    );
}

export default function Reviews({ productId, locale = 'en' }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const isRTL = locale === 'ar';

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${productId}/reviews`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return alert(isRTL ? 'الرجاء اختيار تقييم' : 'Please select a rating');
    setSubmitting(true);

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rating, review: comment })
        });

        const data = await res.json();

        if (res.ok) {
            setReviews([data.data, ...reviews]);
            setRating(0);
            setComment('');
            alert(isRTL ? 'تم إضافة تقييمك بنجاح!' : 'Review submitted successfully!');
        } else {
            alert(data.error || (isRTL ? 'فشل إضافة التقييم' : 'Failed to submit review'));
        }
    } catch (err) {
        alert(isRTL ? 'حدث خطأ ما' : 'Error submitting review');
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100 mt-12">
       <h2 className="text-2xl font-bold text-deep-brown mb-6">{isRTL ? 'التقييمات والمراجعات' : 'Customer Reviews'}</h2>

       {/* Add Review Section */}
       <div className="mb-10 bg-gray-50 p-6 rounded-lg">
           {user ? (
               <form onSubmit={handleSubmit}>
                   <h3 className="text-lg font-semibold mb-3">{isRTL ? 'أضف تقييمك' : 'Write a Review'}</h3>
                   <div className="mb-4">
                       <label className="block text-sm text-gray-600 mb-2">{isRTL ? 'تقييمك' : 'Your Rating'}</label>
                       <StarRating rating={rating} setRating={setRating} hoverRating={hoverRating} setHoverRating={setHoverRating} />
                   </div>
                   <div className="mb-4">
                       <label className="block text-sm text-gray-600 mb-2">{isRTL ? 'تعليقك' : 'Your Review'}</label>
                       <textarea
                           className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gold"
                           rows="3"
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                           required
                       ></textarea>
                   </div>
                   <button
                        type="submit"
                        disabled={submitting}
                        className="bg-deep-brown text-white px-6 py-2 rounded-lg hover:bg-gold transition disabled:opacity-50"
                   >
                       {submitting ? (isRTL ? 'جاري الإرسال...' : 'Submitting...') : (isRTL ? 'نشر التقييم' : 'Submit Review')}
                   </button>
               </form>
           ) : (
               <div className="text-center py-4">
                   <p className="text-gray-600 mb-4">{isRTL ? 'يرجى تسجيل الدخول لإضافة تقييم' : 'Please login to write a review'}</p>
                   {/* Create a simple fake login for demo if needed, or just link to home */}
                   <button
                        className="btn-secondary px-6 py-2"
                        onClick={() => window.location.href = `/${locale}/admin`} // Temporary fallback to admin login for demo
                   >
                        {isRTL ? 'تسجيل الدخول' : 'Login'}
                   </button>
               </div>
           )}
       </div>

       {/* Reviews List */}
       <div className="space-y-6">
           {loading ? (
               <p className="text-center text-gray-500">Loading reviews...</p>
           ) : reviews.length === 0 ? (
               <p className="text-center text-gray-500 py-8 italic bg-gray-50 rounded">{isRTL ? 'لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!' : 'No reviews yet. Be the first to review this product!'}</p>
           ) : (
               reviews.map((rev) => (
                   <div key={rev._id || rev.id} className="border-b last:border-0 pb-6 last:pb-0">
                       <div className="flex items-center gap-3 mb-2">
                           <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
                               {rev.user?.avatar ? (
                                   <Image src={rev.user.avatar} width={40} height={40} className="object-cover" alt="user" />
                               ) : (
                                   <FaUserCircle size={24} />
                               )}
                           </div>
                           <div>
                               <h4 className="font-bold text-deep-brown text-sm">{rev.user?.firstName || 'User'} {rev.user?.lastName || ''}</h4>
                               <div className="flex text-xs text-gold">
                                   {[...Array(5)].map((_, i) => (
                                       <FaStar key={i} color={i < rev.rating ? "#D4AF37" : "#e4e5e9"} size={12} />
                                   ))}
                               </div>
                           </div>
                           <span className="text-xs text-gray-400 ml-auto self-start">
                               {new Date(rev.createdAt).toLocaleDateString()}
                           </span>
                       </div>
                       <p className="text-gray-600 text-sm leading-relaxed">{rev.review}</p>
                   </div>
               ))
           )}
       </div>
    </div>
  );
}
