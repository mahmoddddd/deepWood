const slugify = require('slugify');

/**
 * Generate SEO-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @param {string} lang - Language code ('ar' or 'en')
 * @returns {string} - SEO-friendly slug
 */
const generateSlug = (text, lang = 'en') => {
  if (!text) return '';

  // For Arabic, we need to handle it differently
  if (lang === 'ar') {
    // Replace Arabic characters with their transliterated equivalents
    // or just use the text as-is with basic cleanup
    return slugify(text, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
      locale: 'ar',
    });
  }

  return slugify(text, {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
  });
};

/**
 * Generate unique slug by appending number if needed
 * @param {string} text - Text to convert to slug
 * @param {Object} Model - Mongoose model to check for uniqueness
 * @param {string} lang - Language code
 * @returns {Promise<string>} - Unique slug
 */
const generateUniqueSlug = async (text, Model, lang = 'en') => {
  let slug = generateSlug(text, lang);
  let uniqueSlug = slug;
  let counter = 1;

  while (await Model.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
};
