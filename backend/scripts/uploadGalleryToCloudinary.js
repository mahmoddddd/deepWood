/**
 * Script to upload all gallery images to Cloudinary
 * Run: node scripts/uploadGalleryToCloudinary.js
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

// Gallery folders configuration
const GALLERY_BASE_PATH = path.join(__dirname, '../../frontend/public/images/gallery');
const CLOUDINARY_BASE_FOLDER = 'deepwood/gallery';

const CATEGORIES = ['living-room', 'bedroom', 'dining', 'office', 'kitchen'];

// Store uploaded URLs
const uploadedImages = {
  'living-room': [],
  'bedroom': [],
  'dining': [],
  'office': [],
  'kitchen': [],
};

/**
 * Upload a single image to Cloudinary
 */
async function uploadImage(filePath, category) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `${CLOUDINARY_BASE_FOLDER}/${category}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ],
    });

    return {
      src: result.secure_url,
      publicId: result.public_id,
      originalName: path.basename(filePath),
    };
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Upload all images in a category folder
 */
async function uploadCategory(category) {
  const categoryPath = path.join(GALLERY_BASE_PATH, category);

  if (!fs.existsSync(categoryPath)) {
    console.log(`Category folder not found: ${categoryPath}`);
    return;
  }

  const files = fs.readdirSync(categoryPath).filter(file =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
  );

  console.log(`\n📁 Uploading ${category}: ${files.length} images...`);

  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(categoryPath, file);
    process.stdout.write(`  Uploading: ${file.substring(0, 40)}... `);

    const result = await uploadImage(filePath, category);

    if (result) {
      uploadedImages[category].push(result);
      uploaded++;
      console.log('✅');
    } else {
      failed++;
      console.log('❌');
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`  ✓ ${category}: ${uploaded} uploaded, ${failed} failed`);
}

/**
 * Generate the FilterableGallery component code with Cloudinary URLs
 */
function generateComponentCode() {
  let code = `// Cloudinary URLs for gallery images\n`;
  code += `// Generated on ${new Date().toISOString()}\n\n`;
  code += `const imagesByCategory = {\n`;

  for (const category of CATEGORIES) {
    code += `  '${category}': [\n`;
    for (const img of uploadedImages[category]) {
      code += `    { src: '${img.src}', alt: '${category} ${uploadedImages[category].indexOf(img) + 1}' },\n`;
    }
    code += `  ],\n`;
  }

  code += `};\n`;
  return code;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Cloudinary Gallery Upload');
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
  console.log(`📂 Base Folder: ${CLOUDINARY_BASE_FOLDER}`);
  console.log(`📍 Local Path: ${GALLERY_BASE_PATH}\n`);

  // Upload each category
  for (const category of CATEGORIES) {
    await uploadCategory(category);
  }

  // Generate summary
  console.log('\n=====================================');
  console.log('📊 UPLOAD SUMMARY');
  console.log('=====================================');

  let totalImages = 0;
  for (const category of CATEGORIES) {
    console.log(`  ${category}: ${uploadedImages[category].length} images`);
    totalImages += uploadedImages[category].length;
  }
  console.log(`  ─────────────────`);
  console.log(`  Total: ${totalImages} images\n`);

  // Save the generated code
  const outputPath = path.join(__dirname, 'cloudinaryGalleryUrls.js');
  fs.writeFileSync(outputPath, generateComponentCode());
  console.log(`💾 Generated code saved to: ${outputPath}`);

  // Also save as JSON for easy access
  const jsonPath = path.join(__dirname, 'cloudinaryGalleryUrls.json');
  fs.writeFileSync(jsonPath, JSON.stringify(uploadedImages, null, 2));
  console.log(`📄 JSON data saved to: ${jsonPath}`);

  console.log('\n✅ Upload complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Copy the code from cloudinaryGalleryUrls.js');
  console.log('2. Replace imagesByCategory in FilterableGallery.js');
  console.log('3. Your images are now served from Cloudinary CDN! 🎉\n');
}

// Run the script
main().catch(console.error);
