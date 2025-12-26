'use client';

import Gallery from '@/components/Gallery';

export default function GallerySection({ images, title, subtitle, columns, locale, showTitle = true }) {
  const isRTL = locale === 'ar';

  // Furniture images with Cloudinary URLs and local fallback
  const furnitureImages = [
    {
      src: 'https://res.cloudinary.com/dlxqm1tkd/image/upload/v1766788302/deepwood/furniture/as3z5jqhbqwoermiy5yb.jpg',
      localSrc: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM (1).jpeg',
      alt: 'Furniture 1',
      caption: isRTL ? 'تصميم غرفة معيشة فاخرة' : 'Luxury Living Room Design'
    },
    {
      src: 'https://res.cloudinary.com/dlxqm1tkd/image/upload/v1766788306/deepwood/furniture/mbp1ctrcrlow0cxsqr1r.jpg',
      localSrc: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM (2).jpeg',
      alt: 'Furniture 2',
      caption: isRTL ? 'طاولة طعام خشب طبيعي' : 'Natural Wood Dining Table'
    },
    {
      src: 'https://res.cloudinary.com/dlxqm1tkd/image/upload/v1766788308/deepwood/furniture/toq3vzaz9prlqgplcky9.jpg',
      localSrc: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM (3).jpeg',
      alt: 'Furniture 3',
      caption: isRTL ? 'مكتب تنفيذي فاخر' : 'Executive Luxury Desk'
    },
    {
      src: 'https://res.cloudinary.com/dlxqm1tkd/image/upload/v1766788312/deepwood/furniture/lbm91hl0sleqatdonxsz.jpg',
      localSrc: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM.jpeg',
      alt: 'Furniture 4',
      caption: isRTL ? 'غرفة نوم عصرية' : 'Modern Bedroom Set'
    },
    {
      src: 'https://res.cloudinary.com/dlxqm1tkd/image/upload/v1766788315/deepwood/furniture/wyzrbjesgo6i4sltekak.jpg',
      localSrc: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.14 AM (1).jpeg',
      alt: 'Furniture 5',
      caption: isRTL ? 'خزانة ملابس مخصصة' : 'Custom Wardrobe'
    },
    {
      src: 'https://res.cloudinary.com/dlxqm1tkd/image/upload/v1766788317/deepwood/furniture/xp4irsuudw5xs6jukhgz.jpg',
      localSrc: '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.14 AM.jpeg',
      alt: 'Furniture 6',
      caption: isRTL ? 'مطبخ خشب فاخر' : 'Premium Wooden Kitchen'
    },
  ];

  // Use passed images or default furniture images
  const displayImages = images && images.length > 0 ? images : furnitureImages;

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
