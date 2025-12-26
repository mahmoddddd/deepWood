'use client';

import { useState } from 'react';
import Image from 'next/image';

// Hero image with Cloudinary URL and local fallback
const CLOUDINARY_URL = 'https://res.cloudinary.com/dlxqm1tkd/image/upload/v1766788312/deepwood/furniture/lbm91hl0sleqatdonxsz.jpg';
const LOCAL_URL = '/imagesss/furnature/WhatsApp Image 2025-12-20 at 12.43.13 AM.jpeg';

export default function HeroImage() {
  const [imageSrc, setImageSrc] = useState(CLOUDINARY_URL);

  const handleError = () => {
    if (imageSrc === CLOUDINARY_URL) {
      setImageSrc(LOCAL_URL);
    }
  };

  return (
    <Image
      src={imageSrc}
      alt="Deep Wood Furniture"
      fill
      className="object-cover"
      priority
      onError={handleError}
    />
  );
}
