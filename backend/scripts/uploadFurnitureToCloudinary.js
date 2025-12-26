/**
 * Script to upload furniture images to Cloudinary
 * Run: node scripts/uploadFurnitureToCloudinary.js
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Furniture folder path
const FURNITURE_PATH = path.join(__dirname, '../../frontend/public/imagesss/furnature');
const CLOUDINARY_FOLDER = 'deepwood/furniture';

// Store uploaded URLs
const uploadedImages = [];

/**
 * Upload a single image to Cloudinary
 */
async function uploadImage(filePath, index) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: CLOUDINARY_FOLDER,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ],
    });

    return {
      cloudinarySrc: result.secure_url,
      localSrc: `/imagesss/furnature/${path.basename(filePath)}`,
      publicId: result.public_id,
      originalName: path.basename(filePath),
    };
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Generate the updated GallerySection code with Cloudinary URLs
 */
function generateGalleryCode(images) {
  const captions = [
    { en: 'Luxury Living Room Design', ar: 'تصميم غرفة معيشة فاخرة' },
    { en: 'Natural Wood Dining Table', ar: 'طاولة طعام خشب طبيعي' },
    { en: 'Executive Luxury Desk', ar: 'مكتب تنفيذي فاخر' },
    { en: 'Modern Bedroom Set', ar: 'غرفة نوم عصرية' },
    { en: 'Custom Wardrobe', ar: 'خزانة ملابس مخصصة' },
    { en: 'Premium Wooden Kitchen', ar: 'مطبخ خشب فاخر' },
  ];

  let code = `'use client';

import Gallery from '@/components/Gallery';

export default function GallerySection({ images, title, subtitle, columns, locale, showTitle = true }) {
  const isRTL = locale === 'ar';

  // Furniture images with Cloudinary URLs and local fallback
  const furnitureImages = [
`;

  images.forEach((img, index) => {
    const caption = captions[index] || { en: `Furniture ${index + 1}`, ar: `أثاث ${index + 1}` };
    code += `    {
      src: '${img.cloudinarySrc}',
      localSrc: '${img.localSrc}',
      alt: 'Furniture ${index + 1}',
      caption: isRTL ? '${caption.ar}' : '${caption.en}'
    },\n`;
  });

  code += `  ];

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
`;
  return code;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Cloudinary Furniture Upload');
  console.log('=====================================\n');

  // Check Cloudinary config
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.error('❌ Error: Cloudinary credentials not found in .env');
    console.log('Please make sure you have these in your .env file:');
    console.log('  CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.log('  CLOUDINARY_API_KEY=your_api_key');
    console.log('  CLOUDINARY_API_SECRET=your_api_secret');
    process.exit(1);
  }

  console.log(`☁️  Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`📂 Cloudinary Folder: ${CLOUDINARY_FOLDER}`);
  console.log(`📍 Local Path: ${FURNITURE_PATH}\n`);

  // Check if folder exists
  if (!fs.existsSync(FURNITURE_PATH)) {
    console.error(`❌ Furniture folder not found: ${FURNITURE_PATH}`);
    process.exit(1);
  }

  // Get all image files
  const files = fs.readdirSync(FURNITURE_PATH).filter(file =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
  );

  console.log(`📁 Found ${files.length} images to upload...\n`);

  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(FURNITURE_PATH, file);
    process.stdout.write(`  Uploading: ${file.substring(0, 50)}... `);

    const result = await uploadImage(filePath, files.indexOf(file));

    if (result) {
      uploadedImages.push(result);
      uploaded++;
      console.log('✅');
    } else {
      failed++;
      console.log('❌');
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✓ ${uploaded} uploaded, ${failed} failed`);

  // Sort images to maintain consistent order
  uploadedImages.sort((a, b) => a.originalName.localeCompare(b.originalName));

  // Generate summary
  console.log('\n=====================================');
  console.log('📊 UPLOAD SUMMARY');
  console.log('=====================================');
  console.log(`  Total: ${uploadedImages.length} images\n`);

  // Generate and save the component code
  const componentCode = generateGalleryCode(uploadedImages);
  const outputPath = path.join(__dirname, '../../frontend/components/GallerySection.js');
  fs.writeFileSync(outputPath, componentCode);
  console.log(`💾 Updated GallerySection.js with Cloudinary URLs`);

  // Also save URLs as JSON for reference
  const jsonPath = path.join(__dirname, 'furnitureCloudinaryUrls.json');
  fs.writeFileSync(jsonPath, JSON.stringify(uploadedImages, null, 2));
  console.log(`📄 JSON data saved to: ${jsonPath}`);

  console.log('\n✅ Upload complete!');
  console.log('🎉 Your furniture images are now served from Cloudinary CDN!\n');
}

// Run the script
main().catch(console.error);
