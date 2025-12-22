'use client';

import Gallery from '@/components/Gallery';

export default function GallerySection({ images, title, subtitle, columns, locale, showTitle = true }) {
  const isRTL = locale === 'ar';

  // All gallery images from testImages folder
  const allGalleryImages = [
    // Original furniture images
    { src: '/images/furniture/WhatsApp Image 2025-12-20 at 12.43.13 AM.jpeg', alt: 'Furniture 1', caption: isRTL ? 'تصميم غرفة معيشة فاخرة' : 'Luxury Living Room Design' },
    { src: '/images/furniture/WhatsApp Image 2025-12-20 at 12.43.13 AM (1).jpeg', alt: 'Furniture 2', caption: isRTL ? 'طاولة طعام خشب طبيعي' : 'Natural Wood Dining Table' },
    { src: '/images/furniture/WhatsApp Image 2025-12-20 at 12.43.13 AM (2).jpeg', alt: 'Furniture 3', caption: isRTL ? 'مكتب تنفيذي فاخر' : 'Executive Luxury Desk' },
    { src: '/images/furniture/WhatsApp Image 2025-12-20 at 12.43.13 AM (3).jpeg', alt: 'Furniture 4', caption: isRTL ? 'غرفة نوم عصرية' : 'Modern Bedroom Set' },
    { src: '/images/furniture/WhatsApp Image 2025-12-20 at 12.43.14 AM.jpeg', alt: 'Furniture 5', caption: isRTL ? 'خزانة ملابس مخصصة' : 'Custom Wardrobe' },
    { src: '/images/furniture/WhatsApp Image 2025-12-20 at 12.43.14 AM (1).jpeg', alt: 'Furniture 6', caption: isRTL ? 'مطبخ خشب فاخر' : 'Premium Wooden Kitchen' },

    // New gallery images from testImages
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.29.55 AM.jpeg', alt: 'Gallery 1', caption: isRTL ? 'أثاث مميز' : 'Premium Furniture' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.31.43 AM.jpeg', alt: 'Gallery 2', caption: isRTL ? 'تصميم فريد' : 'Unique Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.34.04 AM.jpeg', alt: 'Gallery 3', caption: isRTL ? 'حرفية عالية' : 'High Craftsmanship' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.43 AM.jpeg', alt: 'Gallery 4', caption: isRTL ? 'أناقة الخشب' : 'Wood Elegance' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.44 AM.jpeg', alt: 'Gallery 5', caption: isRTL ? 'تصميم عصري' : 'Modern Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.45 AM.jpeg', alt: 'Gallery 6', caption: isRTL ? 'جودة فائقة' : 'Superior Quality' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.47 AM.jpeg', alt: 'Gallery 7', caption: isRTL ? 'خشب طبيعي' : 'Natural Wood' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.48 AM.jpeg', alt: 'Gallery 8', caption: isRTL ? 'أثاث فاخر' : 'Luxury Furniture' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.48 AM (1).jpeg', alt: 'Gallery 9', caption: isRTL ? 'تصميم راقي' : 'Elegant Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.49 AM.jpeg', alt: 'Gallery 10', caption: isRTL ? 'إبداع في الخشب' : 'Wood Creativity' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.49 AM (1).jpeg', alt: 'Gallery 11', caption: isRTL ? 'منتج مميز' : 'Outstanding Product' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.49 AM (2).jpeg', alt: 'Gallery 12', caption: isRTL ? 'فن الأثاث' : 'Furniture Art' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.51 AM.jpeg', alt: 'Gallery 13', caption: isRTL ? 'تفاصيل دقيقة' : 'Precise Details' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.51 AM (1).jpeg', alt: 'Gallery 14', caption: isRTL ? 'صناعة متقنة' : 'Masterful Craft' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.52 AM.jpeg', alt: 'Gallery 15', caption: isRTL ? 'أناقة طبيعية' : 'Natural Elegance' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.53 AM.jpeg', alt: 'Gallery 16', caption: isRTL ? 'تصميم مبتكر' : 'Innovative Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.53 AM (1).jpeg', alt: 'Gallery 17', caption: isRTL ? 'جمال الطبيعة' : 'Nature Beauty' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.54 AM.jpeg', alt: 'Gallery 18', caption: isRTL ? 'أثاث عملي' : 'Functional Furniture' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.54 AM (1).jpeg', alt: 'Gallery 19', caption: isRTL ? 'تصميم كلاسيكي' : 'Classic Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.55 AM.jpeg', alt: 'Gallery 20', caption: isRTL ? 'روعة الخشب' : 'Wood Magnificence' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.55 AM (1).jpeg', alt: 'Gallery 21', caption: isRTL ? 'إبداع حرفي' : 'Artisan Creativity' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.56 AM.jpeg', alt: 'Gallery 22', caption: isRTL ? 'أثاث منزلي' : 'Home Furniture' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.56 AM (1).jpeg', alt: 'Gallery 23', caption: isRTL ? 'تميز في التصميم' : 'Design Excellence' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.58 AM.jpeg', alt: 'Gallery 24', caption: isRTL ? 'خشب فاخر' : 'Premium Wood' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.58 AM (1).jpeg', alt: 'Gallery 25', caption: isRTL ? 'تصميم أنيق' : 'Stylish Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.59 AM.jpeg', alt: 'Gallery 26', caption: isRTL ? 'حرفية يدوية' : 'Handcrafted' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.36.59 AM (1).jpeg', alt: 'Gallery 27', caption: isRTL ? 'أثاث مميز' : 'Distinguished Furniture' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.37.00 AM.jpeg', alt: 'Gallery 28', caption: isRTL ? 'تفاصيل راقية' : 'Refined Details' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.37.01 AM.jpeg', alt: 'Gallery 29', caption: isRTL ? 'صناعة محلية' : 'Local Craft' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.37.02 AM.jpeg', alt: 'Gallery 30', caption: isRTL ? 'أناقة عصرية' : 'Contemporary Elegance' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.38.08 AM.jpeg', alt: 'Gallery 31', caption: isRTL ? 'تصميم فني' : 'Artistic Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.38.08 AM (1).jpeg', alt: 'Gallery 32', caption: isRTL ? 'أثاث فاخر' : 'Luxury Furniture' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.38.09 AM.jpeg', alt: 'Gallery 33', caption: isRTL ? 'خشب طبيعي' : 'Natural Wood' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.38.09 AM (1).jpeg', alt: 'Gallery 34', caption: isRTL ? 'تصميم مميز' : 'Unique Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.41 AM.jpeg', alt: 'Gallery 35', caption: isRTL ? 'جودة عالية' : 'High Quality' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.41 AM (1).jpeg', alt: 'Gallery 36', caption: isRTL ? 'حرفية متقنة' : 'Expert Craftsmanship' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.43 AM.jpeg', alt: 'Gallery 37', caption: isRTL ? 'أثاث حديث' : 'Modern Furniture' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.44 AM.jpeg', alt: 'Gallery 38', caption: isRTL ? 'تصميم راقي' : 'Sophisticated Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.45 AM.jpeg', alt: 'Gallery 39', caption: isRTL ? 'فن الخشب' : 'Wood Art' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.45 AM (1).jpeg', alt: 'Gallery 40', caption: isRTL ? 'إبداع مميز' : 'Outstanding Creativity' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.46 AM.jpeg', alt: 'Gallery 41', caption: isRTL ? 'أثاث عصري' : 'Contemporary Furniture' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.47 AM.jpeg', alt: 'Gallery 42', caption: isRTL ? 'تصميم أنيق' : 'Elegant Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.48 AM.jpeg', alt: 'Gallery 43', caption: isRTL ? 'خشب فاخر' : 'Premium Wood' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.49 AM.jpeg', alt: 'Gallery 44', caption: isRTL ? 'جمال طبيعي' : 'Natural Beauty' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.50 AM.jpeg', alt: 'Gallery 45', caption: isRTL ? 'تميز حرفي' : 'Artisan Excellence' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.50 AM (1).jpeg', alt: 'Gallery 46', caption: isRTL ? 'أثاث منزلي' : 'Home Furniture' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.51 AM.jpeg', alt: 'Gallery 47', caption: isRTL ? 'تصميم مبتكر' : 'Innovative Design' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.52 AM.jpeg', alt: 'Gallery 48', caption: isRTL ? 'حرفية عالية' : 'High Craftsmanship' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.53 AM.jpeg', alt: 'Gallery 49', caption: isRTL ? 'أناقة مطلقة' : 'Absolute Elegance' },
    { src: '/images/gallery/WhatsApp Image 2025-12-20 at 12.40.54 AM.jpeg', alt: 'Gallery 50', caption: isRTL ? 'إبداع في التصميم' : 'Design Creativity' },
  ];

  const displayImages = images && images.length > 0 ? images : allGalleryImages;

  return (
    <Gallery
      images={displayImages}
      title={title || (isRTL ? 'معرض أعمالنا' : 'Our Gallery')}
      subtitle={subtitle || (isRTL ? 'اضغط على أي صورة لعرضها بحجم أكبر' : 'Click any image to view it larger')}
      columns={columns || 3}
      showTitle={showTitle}
    />
  );
}
