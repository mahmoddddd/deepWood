const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Client = require('../models/Client');
const Testimonial = require('../models/Testimonial');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Project.deleteMany();
    await Service.deleteMany();
    await Client.deleteMany();
    await Testimonial.deleteMany();

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@deepwood.com',
      password: 'admin123456',
      role: 'superadmin',
      status: 'active',
    });
    console.log('Admin user created: admin@deepwood.com / admin123456');

    // Create categories
    const categories = await Category.create([
      { name_en: 'Living Room', name_ar: 'غرفة المعيشة', slug: 'living-room', type: 'both', status: 'active', order: 1 },
      { name_en: 'Bedroom', name_ar: 'غرفة النوم', slug: 'bedroom', type: 'both', status: 'active', order: 2 },
      { name_en: 'Office', name_ar: 'المكتب', slug: 'office', type: 'both', status: 'active', order: 3 },
      { name_en: 'Dining Room', name_ar: 'غرفة الطعام', slug: 'dining-room', type: 'both', status: 'active', order: 4 },
      { name_en: 'Antiques', name_ar: 'التحف', slug: 'antiques', type: 'product', status: 'active', order: 5 },
    ]);
    console.log('Categories created');

    // Create clients (Corporate)
    const clients = await Client.create([
      { name_en: 'Toyota Egypt', name_ar: 'تويوتا مصر', slug: 'toyota', industry_en: 'Automotive', industry_ar: 'السيارات', featured: true, isCorporate: true, status: 'active', order: 1 },
      { name_en: 'Toshiba El Araby', name_ar: 'توشيبا العربي', slug: 'toshiba-el-araby', industry_en: 'Electronics', industry_ar: 'الإلكترونيات', featured: true, isCorporate: true, status: 'active', order: 2 },
      { name_en: 'Raya', name_ar: 'راية', slug: 'raya', industry_en: 'Technology', industry_ar: 'التكنولوجيا', featured: true, isCorporate: true, status: 'active', order: 3 },
    ]);
    console.log('Corporate clients created');

    // Create services
    const services = await Service.create([
      { title_en: 'Residential Furniture', title_ar: 'الأثاث السكني', slug: 'residential-furniture', shortDescription_en: 'Premium custom furniture for your home', shortDescription_ar: 'أثاث مخصص فاخر لمنزلك', featured: true, status: 'active', order: 1 },
      { title_en: 'Corporate Solutions', title_ar: 'الحلول المؤسسية', slug: 'corporate-solutions', shortDescription_en: 'Complete office and workspace furniture', shortDescription_ar: 'أثاث مكتبي ومساحات عمل متكامل', featured: true, status: 'active', order: 2 },
      { title_en: 'Custom Woodwork', title_ar: 'الأعمال الخشبية المخصصة', slug: 'custom-woodwork', shortDescription_en: 'Bespoke woodwork and craftsmanship', shortDescription_ar: 'أعمال خشبية وحرفية مخصصة', featured: true, status: 'active', order: 3 },
      { title_en: 'Antique Restoration', title_ar: 'ترميم التحف', slug: 'antique-restoration', shortDescription_en: 'Expert restoration of antique furniture', shortDescription_ar: 'ترميم احترافي للأثاث الأثري', featured: true, status: 'active', order: 4 },
    ]);
    console.log('Services created');

    // Create products
    const products = await Product.create([
      { title_en: 'Executive Desk', title_ar: 'مكتب تنفيذي', slug: 'executive-desk', description_en: 'Handcrafted executive desk made from premium walnut wood', description_ar: 'مكتب تنفيذي مصنوع يدوياً من خشب الجوز الفاخر', price: 25000, currency: 'EGP', category: categories[2]._id, featured: true, status: 'active', inStock: true },
      { title_en: 'Classic Sofa Set', title_ar: 'طقم كنب كلاسيكي', slug: 'classic-sofa-set', description_en: 'Luxurious 7-seater sofa set with premium fabric', description_ar: 'طقم كنب فاخر 7 مقاعد بقماش ممتاز', price: 45000, currency: 'EGP', category: categories[0]._id, featured: true, status: 'active', inStock: true },
      { title_en: 'Royal Bedroom Set', title_ar: 'غرفة نوم ملكية', slug: 'royal-bedroom-set', description_en: 'Complete bedroom set with handcrafted details', description_ar: 'طقم غرفة نوم كامل بتفاصيل مصنوعة يدوياً', price: 85000, currency: 'EGP', category: categories[1]._id, featured: true, status: 'active', inStock: true },
      { title_en: 'Dining Table 8 Seater', title_ar: 'طاولة طعام 8 مقاعد', slug: 'dining-table-8-seater', description_en: 'Elegant dining table for 8 persons', description_ar: 'طاولة طعام أنيقة لـ 8 أشخاص', price: 35000, currency: 'EGP', category: categories[3]._id, featured: true, status: 'active', inStock: true },
    ]);
    console.log('Products created');

    // Create projects
    const projects = await Project.create([
      { title_en: 'Toyota Headquarters', title_ar: 'مقر تويوتا الرئيسي', slug: 'toyota-headquarters', description_en: 'Complete office furniture for Toyota Egypt headquarters', description_ar: 'أثاث مكتبي متكامل لمقر تويوتا مصر الرئيسي', client: clients[0]._id, category: categories[2]._id, projectType: 'corporate', isCorporate: true, featured: true, status: 'active' },
      { title_en: 'Toshiba El Araby Showroom', title_ar: 'معرض توشيبا العربي', slug: 'toshiba-showroom', description_en: 'Custom display furniture for electronics showroom', description_ar: 'أثاث عرض مخصص لمعرض الإلكترونيات', client: clients[1]._id, category: categories[2]._id, projectType: 'corporate', isCorporate: true, featured: true, status: 'active' },
      { title_en: 'Raya Technology Center', title_ar: 'مركز راية للتكنولوجيا', slug: 'raya-tech-center', description_en: 'Modern workspace furniture for tech company', description_ar: 'أثاث مساحات عمل حديث لشركة تكنولوجيا', client: clients[2]._id, category: categories[2]._id, projectType: 'corporate', isCorporate: true, featured: true, status: 'active' },
      { title_en: 'Luxury Villa - New Cairo', title_ar: 'فيلا فاخرة - القاهرة الجديدة', slug: 'luxury-villa-new-cairo', description_en: 'Complete residential furniture for luxury villa', description_ar: 'أثاث سكني متكامل لفيلا فاخرة', category: categories[0]._id, projectType: 'residential', featured: true, status: 'active' },
    ]);
    console.log('Projects created');

    // Create testimonials
    await Testimonial.create([
      { name_en: 'Ahmed Hassan', name_ar: 'أحمد حسن', title_en: 'CEO', title_ar: 'الرئيس التنفيذي', company_en: 'Tech Solutions', company_ar: 'حلول التقنية', content_en: 'Exceptional quality and craftsmanship. Deep Wood delivered beyond our expectations.', content_ar: 'جودة وحرفية استثنائية. قدم ديب وود أكثر من توقعاتنا.', rating: 5, featured: true, status: 'active' },
      { name_en: 'Sara Mohamed', name_ar: 'سارة محمد', title_en: 'Interior Designer', title_ar: 'مصممة داخلية', company_en: 'Design Studio', company_ar: 'ستوديو التصميم', content_en: 'Working with Deep Wood was a pleasure. Their attention to detail is remarkable.', content_ar: 'العمل مع ديب وود كان ممتعاً. اهتمامهم بالتفاصيل رائع.', rating: 5, featured: true, status: 'active' },
    ]);
    console.log('Testimonials created');

    console.log('\n✅ Seed data completed successfully!');
    console.log('Admin credentials: admin@deepwood.com / admin123456');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
