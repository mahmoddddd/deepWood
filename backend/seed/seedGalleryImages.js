const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const GalleryImage = require('../models/GalleryImage');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Load existing gallery images from JSON
const galleryDataPath = path.join(__dirname, '..', 'scripts', 'cloudinaryGalleryUrls.json');

const seedGalleryImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Check if gallery images already exist
    const existingCount = await GalleryImage.countDocuments();
    if (existingCount > 0) {
      console.log(`\n⚠️  Gallery images already exist (${existingCount} images).`);
      console.log('Do you want to clear and re-seed? Run with --force flag to override.');

      if (!process.argv.includes('--force')) {
        console.log('Exiting without changes.');
        process.exit(0);
      }

      console.log('\n🗑️  Clearing existing gallery images...');
      await GalleryImage.deleteMany({});
    }

    // Read gallery data from JSON
    if (!fs.existsSync(galleryDataPath)) {
      console.error('❌ Gallery data file not found:', galleryDataPath);
      process.exit(1);
    }

    const galleryData = JSON.parse(fs.readFileSync(galleryDataPath, 'utf8'));
    console.log('\n📸 Processing gallery images...');

    const imagesToInsert = [];
    const categories = Object.keys(galleryData);

    for (const category of categories) {
      const images = galleryData[category];
      console.log(`  📁 ${category}: ${images.length} images`);

      images.forEach((img, index) => {
        imagesToInsert.push({
          src: img.src,
          publicId: img.publicId || '',
          alt: img.originalName || `${category} ${index + 1}`,
          caption_en: '',
          caption_ar: '',
          category: category,
          order: index,
          status: 'active',
        });
      });
    }

    // Insert all images
    console.log(`\n💾 Inserting ${imagesToInsert.length} images into database...`);
    await GalleryImage.insertMany(imagesToInsert);

    // Summary
    console.log('\n✅ Gallery images seeded successfully!');
    console.log('\nSummary:');
    for (const category of categories) {
      const count = await GalleryImage.countDocuments({ category });
      console.log(`  ${category}: ${count} images`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding gallery images:', error);
    process.exit(1);
  }
};

seedGalleryImages();
