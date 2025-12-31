'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBoxOpen, FaImage, FaTimes, FaShoppingBag, FaEye, FaCheck, FaTags, FaChartBar, FaGlobe, FaUsers, FaCog } from 'react-icons/fa';

// Admin Translations
const translations = {
  en: {
    login: 'Admin Login',
    password: 'Enter Admin Password',
    loginBtn: 'Login',
    dashboard: 'Dashboard',
    products: 'Products',
    categories: 'Categories',
    orders: 'Orders',
    totalProducts: 'Total Products',
    totalCategories: 'Categories',
    totalOrders: 'Total Orders',
    totalRevenue: 'Total Revenue',
    recentOrders: 'Recent Orders',
    lowStock: 'Low Stock Products',
    allInStock: 'All products are in stock!',
    noOrders: 'No orders yet',
    orderNumber: 'Order #',
    customer: 'Customer',
    total: 'Total',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    productManagement: 'Product Management',
    addProduct: 'Add New Product',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    mainImage: 'Main Image',
    galleryImages: 'Gallery Images (Multiple)',
    sku: 'SKU (Unique Code)',
    price: 'Price (EGP)',
    salePrice: 'Sale Price (Optional)',
    category: 'Category',
    selectCategory: '-- Select Category --',
    titleEn: 'Title (English)',
    titleAr: 'Title (Arabic)',
    descEn: 'Description (English)',
    descAr: 'Description (Arabic)',
    dimensions: 'Dimensions (cm)',
    width: 'Width',
    height: 'Height',
    depth: 'Depth',
    materialsEn: 'Materials (English)',
    materialsAr: 'Materials (Arabic)',
    stockStatus: 'Stock Status',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    quantity: 'Quantity',
    newArrival: 'New Arrival',
    featured: 'Featured',
    saveProduct: 'Save Product',
    saving: 'Saving...',
    createProduct: 'Create New Product',
    editProduct: 'Edit Product',
    categoryManagement: 'Categories',
    addCategory: 'Add Category',
    nameEn: 'Name (English)',
    nameAr: 'Name (Arabic)',
    type: 'Type',
    saveCategory: 'Save Category',
    createCategory: 'Create New Category',
    editCategory: 'Edit Category',
    orderManagement: 'Order Management',
    refreshOrders: 'Refresh Orders',
    customerInfo: 'Customer Information',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    shippingAddress: 'Shipping Address',
    orderItems: 'Order Items',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    updateStatus: 'Update Status',
    notes: 'Notes',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    active: 'Active',
    draft: 'Draft',
    inactive: 'Inactive',
    noProducts: 'No products found. Add your first one!',
    noCategories: 'No categories found. Add your first one!',
    items: 'items',
    left: 'left',
    customers: 'Customers',
    customerManagement: 'Customer List',
    totalCustomers: 'Total Customers',
    phone: 'Phone',
    email: 'Email',
    totalSpent: 'Total Spent',
    lastOrder: 'Last Order',
    settings: 'Settings',
    generalSettings: 'General Settings',
    storeName: 'Store Name',
    contactInfo: 'Contact Info',
    socialMedia: 'Social Media',
    saveSettings: 'Save Settings',
    shipping: 'Shipping Cost',
    coupons: 'Coupons',
    couponManagement: 'Coupon Management',
    addCoupon: 'Add Coupon',
    code: 'Code',
    discount: 'Discount',
    validUntil: 'Valid Until',
    usage: 'Usage',
    saveCoupon: 'Save Coupon',
    createCoupon: 'Create New Coupon',
    editCoupon: 'Edit Coupon',
    discountValue: 'Discount Value',
    discountType: 'Discount Type',
    percentage: 'Percentage',
    fixedAmount: 'Fixed Amount',
    minOrder: 'Min Order Amount',
    maxDiscount: 'Max Discount',
    usageLimit: 'Usage Limit',
    totalCoupons: 'Total Coupons',
    noCoupons: 'No coupons found. Add your first one!',
  },
  ar: {
    login: 'تسجيل دخول المدير',
    password: 'أدخل كلمة مرور المدير',
    loginBtn: 'دخول',
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    categories: 'الأقسام',
    orders: 'الطلبات',
    customers: 'العملاء',
    customerManagement: 'قائمة العملاء',
    totalCustomers: 'إجمالي العملاء',
    phone: 'الهاتف',
    email: 'البريد',
    totalSpent: 'إجمالي الإنفاق',
    lastOrder: 'آخر طلب',
    settings: 'الإعدادات',
    generalSettings: 'الإعدادات العامة',
    storeName: 'اسم المتجر',
    contactInfo: 'معلومات التواصل',
    socialMedia: 'التواصل الاجتماعي',
    saveSettings: 'حفظ الإعدادات',
    shipping: 'تكلفة الشحن',
    coupons: 'الكوبونات',
    totalProducts: 'إجمالي المنتجات',
    totalCategories: 'الأقسام',
    totalOrders: 'إجمالي الطلبات',
    totalCoupons: 'الكوبونات',
    totalRevenue: 'إجمالي الإيرادات',
    recentOrders: 'آخر الطلبات',
    lowStock: 'منتجات قليلة المخزون',
    allInStock: 'جميع المنتجات متوفرة! ✅',
    noOrders: 'لا توجد طلبات بعد',
    noCoupons: 'لا توجد كوبونات. أضف أول كوبون!',
    orderNumber: 'طلب #',
    customer: 'العميل',
    total: 'الإجمالي',
    status: 'الحالة',
    date: 'التاريخ',
    actions: 'الإجراءات',
    productManagement: 'إدارة المنتجات',
    couponManagement: 'إدارة الكوبونات',
    addProduct: 'إضافة منتج جديد',
    addCoupon: 'إضافة كوبون',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    mainImage: 'الصورة الرئيسية',
    galleryImages: 'صور المعرض (متعددة)',
    sku: 'رمز المنتج',
    price: 'السعر (جنيه)',
    salePrice: 'سعر التخفيض (اختياري)',
    category: 'القسم',
    selectCategory: '-- اختر القسم --',
    titleEn: 'الاسم (إنجليزي)',
    titleAr: 'الاسم (عربي)',
    descEn: 'الوصف (إنجليزي)',
    descAr: 'الوصف (عربي)',
    dimensions: 'الأبعاد (سم)',
    width: 'العرض',
    height: 'الارتفاع',
    depth: 'العمق',
    materialsEn: 'المواد (إنجليزي)',
    materialsAr: 'المواد (عربي)',
    stockStatus: 'حالة المخزون',
    inStock: 'متوفر',
    outOfStock: 'نفذ',
    quantity: 'الكمية',
    newArrival: 'وصل حديثاً',
    featured: 'مميز',
    saveProduct: 'حفظ المنتج',
    saveCoupon: 'حفظ الكوبون',
    saving: 'جاري الحفظ...',
    createProduct: 'إنشاء منتج جديد',
    createCoupon: 'إنشاء كوبون جديد',
    editProduct: 'تعديل المنتج',
    editCoupon: 'تعديل الكوبون',
    categoryManagement: 'الأقسام',
    addCategory: 'إضافة قسم',
    nameEn: 'الاسم (إنجليزي)',
    nameAr: 'الاسم (عربي)',
    type: 'النوع',
    saveCategory: 'حفظ القسم',
    createCategory: 'إنشاء قسم جديد',
    editCategory: 'تعديل القسم',
    orderManagement: 'إدارة الطلبات',
    refreshOrders: 'تحديث الطلبات',
    customerInfo: 'معلومات العميل',
    name: 'الاسم',
    code: 'الكود',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    shippingAddress: 'عنوان الشحن',
    orderItems: 'المنتجات المطلوبة',
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    discountValue: 'قيمة الخصم',
    discountType: 'نوع الخصم',
    percentage: 'نسبة مئوية',
    fixedAmount: 'مبلغ ثابت',
    minOrder: 'أقل مبلغ للطلب',
    maxDiscount: 'أقصى خصم',
    usageLimit: 'حد الاستخدام',
    validUntil: 'صالح حتى',
    usage: 'الاستخدام',
    shipping: 'الشحن',
    updateStatus: 'تحديث الحالة',
    notes: 'ملاحظات',
    pending: 'قيد الانتظار',
    processing: 'جاري التجهيز',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
    active: 'نشط',
    draft: 'مسودة',
    inactive: 'غير نشط',
    noProducts: 'لا توجد منتجات. أضف أول منتج!',
    noCategories: 'لا توجد أقسام. أضف أول قسم!',
    items: 'منتجات',
    left: 'متبقي',
  },
};

export default function AdminPage({ params }) {
  const routeParams = useParams();
  const locale = routeParams?.locale || params?.locale || 'en';
  const isRTL = locale === 'ar';
  const t = translations[locale] || translations.en;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'orders', 'categories'

  // Products State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [editingProduct, setEditingProduct] = useState(null);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Categories State
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryView, setCategoryView] = useState('list');

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponView, setCouponView] = useState('list');

  // Customers State
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const fetchCustomers = async () => {
    setCustomersLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/customers`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
        setCustomersLoading(false);
    }
  };

  // Settings State
  const [settings, setSettings] = useState({
    storeName: '',
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    address: '',
    shippingCost: 0,
    socialLinks: { facebook: '', instagram: '', twitter: '' }
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`);
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
        console.error('Save error:', error);
    } finally {
        setSettingsLoading(false);
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setSettings(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [child]: value }
        }));
    } else {
        setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/coupons`);
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setCouponsLoading(false);
    }
  };

   const handleDeleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/coupons/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCoupons(coupons.filter(c => c._id !== id));
        alert('Coupon deleted successfully');
      } else {
        alert('Failed to delete coupon');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // --- Auth & Data Fetching ---

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password for now
      setIsAuthenticated(true);
      fetchProducts();
      fetchOrders();
      fetchCategories();
      fetchCoupons();
      fetchCustomers();
      fetchSettings();
    } else {
      alert('Incorrect Password');
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch from API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        alert('Order status updated!');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order status');
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCategories(categories.filter(c => c._id !== id));
        alert('Category deleted successfully');
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // --- CRUD Operations ---

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            setProducts(products.filter(p => p._id !== id));
            alert('Product deleted successfully');
        } else {
            alert('Failed to delete product');
        }
    } catch (error) {
        console.error('Delete error:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setView('editor');
  };

  const handleAddNew = () => {
    setEditingProduct(null); // Null means new product
    setView('editor');
  };

  // --- Render Components ---

  const exportToExcel = () => {
    // 1. Prepare Header
    const header = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Email', 'City', 'Total (EGP)', 'Status', 'Items'];

    // 2. Prepare Rows
    const rows = orders.map(order => [
      order.orderNumber || order._id,
      new Date(order.createdAt).toLocaleDateString(),
      order.customerName,
      order.customerPhone,
      order.customerEmail,
      order.shippingAddress?.city || '',
      order.total,
      order.status,
      order.items?.map(i => `${i.title_en} (x${i.quantity})`).join(', ')
    ]);

    // 3. Convert to CSV
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.map(item => `"${String(item || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // 4. Download File
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.orderNumber || order._id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 32px; font-weight: bold; color: #4A3426; margin-bottom: 10px; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .box { background: #f9f9f9; padding: 20px; border-radius: 8px; width: 45%; }
            h3 { margin-top: 0; color: #4A3426; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            table { w-full; border-collapse: collapse; margin-top: 20px; width: 100%; }
            th { background-color: #4A3426; color: white; padding: 12px; text-align: left; }
            td { border-bottom: 1px solid #ddd; padding: 12px; }
            .total-section { float: right; width: 300px; margin-top: 20px; }
            .row { display: flex; justify-content: space-between; padding: 5px 0; }
            .grand-total { font-weight: bold; font-size: 20px; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; color: #4A3426; }
            .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Deep Wood</div>
            <p>Invoice #${order.orderNumber || order._id}</p>
            <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div class="invoice-details">
            <div class="box">
              <h3>Bill To</h3>
              <p><strong>${order.customerName}</strong></p>
              <p>${order.customerPhone}</p>
              <p>${order.customerEmail || ''}</p>
              <p>${order.shippingAddress?.street}, ${order.shippingAddress?.city}</p>
              <p>${order.shippingAddress?.governorate}</p>
            </div>
            <div class="box">
              <h3>Order Info</h3>
              <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.title_en || 'Product'}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price.toLocaleString()} EGP</td>
                  <td>${(item.price * item.quantity).toLocaleString()} EGP</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="row">
              <span>Subtotal:</span>
              <span>${order.subtotal?.toLocaleString()} EGP</span>
            </div>
            <div class="row">
              <span>Shipping:</span>
              <span>${order.shippingCost?.toLocaleString() || 0} EGP</span>
            </div>
            ${order.discount ? `
            <div class="row" style="color: green;">
              <span>Discount (${order.couponCode || 'Coupon'}):</span>
              <span>-${order.discount.toLocaleString()} EGP</span>
            </div>` : ''}
            <div class="row grand-total">
              <span>Total:</span>
              <span>${order.total?.toLocaleString()} EGP</span>
            </div>
          </div>

          <div style="clear: both;"></div>

          <div class="footer">
            <p>Thank you for choosing Deep Wood!</p>
            <p>For support: support@deepwood.com | +20 102 088 3895</p>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
          <h1 className="text-2xl font-bold text-center mb-6 text-deep-brown">{t.login}</h1>
          <input
            type="password"
            autoComplete="new-password"
            placeholder={t.password}
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-deep-brown text-white py-3 rounded font-bold hover:bg-gold transition">
            {t.loginBtn}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">

        {/* Tabs Navigation */}
        <div className="flex gap-2 md:gap-4 mb-6 border-b border-gray-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 px-3 md:px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'text-deep-brown border-b-2 border-deep-brown'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FaChartBar className={`inline ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t.dashboard}
          </button>
          <button
            onClick={() => { setActiveTab('products'); setView('list'); }}
            className={`pb-3 px-3 md:px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'products'
                ? 'text-deep-brown border-b-2 border-deep-brown'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FaBoxOpen className={`inline ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t.products} ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setCategoryView('list'); }}
            className={`pb-3 px-3 md:px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'categories'
                ? 'text-deep-brown border-b-2 border-deep-brown'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FaTags className={`inline ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t.categories} ({categories.length})
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
            className={`pb-3 px-3 md:px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-deep-brown border-b-2 border-deep-brown'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FaShoppingBag className={`inline ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t.orders} ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3 px-3 md:px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'customers'
                ? 'text-deep-brown border-b-2 border-deep-brown'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FaUsers className={`inline ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t.customers} ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-3 md:px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-deep-brown border-b-2 border-deep-brown'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FaCog className={`inline ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t.settings}
          </button>
          <button
            onClick={() => { setActiveTab('coupons'); setCouponView('list'); }}
            className={`pb-3 px-3 md:px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'text-deep-brown border-b-2 border-deep-brown'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FaTags className={`inline ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t.coupons} ({coupons.length})
          </button>
        </div>

        {/* Header */}
        {activeTab === 'products' && (
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-deep-brown">{t.productManagement}</h1>
            {view === 'list' && (
              <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                  <FaPlus /> {t.addProduct}
              </button>
            )}
            {view === 'editor' && (
               <button
                  onClick={() => setView('list')}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
               >
                  {t.cancel}
               </button>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-deep-brown">Order Management</h1>
            <div className="flex gap-2">
                <button
                onClick={exportToExcel}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                Export Excel
                </button>
                <button
                onClick={fetchOrders}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                Refresh
                </button>
            </div>
          </div>
        )}

        {/* Products Content */}
        {activeTab === 'products' && view === 'list' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                    <FaBoxOpen size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No products found. Add your first one!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">SKU</th>
                                <th className="p-4">Name (EN)</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(product => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="w-12 h-12 relative bg-gray-200 rounded overflow-hidden">
                                            {product.image?.url && <Image src={product.image.url} alt="" fill className="object-cover" />}
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-xs">{product.sku || '-'}</td>
                                    <td className="p-4 font-medium">{product.title_en}</td>
                                    <td className="p-4 text-gray-500">{product.category?.name_en || '-'}</td>
                                    <td className="p-4 font-bold">{product.price.toLocaleString()} EGP</td>
                                    <td className="p-4">
                                        {product.inStock ? (
                                            <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">In Stock</span>
                                        ) : (
                                            <span className="text-red-600 text-xs font-bold bg-red-100 px-2 py-1 rounded">Out of Stock</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleEdit(product)} className="text-blue-500 p-2 hover:bg-blue-50 rounded mr-2" title="Edit">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-500 p-2 hover:bg-red-50 rounded" title="Delete">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        )}

        {/* Product Editor Form component will be inserted here */}
        {activeTab === 'products' && view === 'editor' && (
            <ProductEditor
                initialData={editingProduct}
                onCancel={() => setView('list')}
                onSuccess={() => {
                    setView('list');
                    fetchProducts();
                }}
            />
        )}

        {/* Orders Content */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {ordersLoading ? (
              <div className="p-8 text-center text-gray-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <FaShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                <p>No orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="p-4 font-mono text-sm font-bold">{order.orderNumber || order._id.slice(-6)}</td>
                        <td className="p-4">
                          <div className="font-medium">{order.customerName || '-'}</div>
                          <div className="text-xs text-gray-400">{order.customerPhone || '-'}</div>
                        </td>
                        <td className="p-4">{order.items?.length || 0} items</td>
                        <td className="p-4 font-bold">{order.total?.toLocaleString()} EGP</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {order.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-500 p-2 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-6)}</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handlePrintInvoice(selectedOrder)}
                        className="flex items-center gap-2 bg-deep-brown text-white px-3 py-1.5 rounded text-sm hover:bg-gold transition"
                    >
                        <FaShoppingBag className="text-xs" /> Print Invoice
                    </button>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                      <FaTimes size={20} />
                    </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p><strong>Name:</strong> {selectedOrder.customerName || '-'}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail || '-'}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customerPhone || '-'}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p>{selectedOrder.shippingAddress?.street || '-'}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.governorate}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 border-b last:border-0">
                        <div>
                          <span className="font-medium">{item.product?.title_en || item.title || 'Product'}</span>
                          <span className="text-gray-400 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-bold">{(item.price * item.quantity).toLocaleString()} EGP</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal:</span>
                    <span>{selectedOrder.subtotal?.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Shipping:</span>
                    <span>{selectedOrder.shippingCost?.toLocaleString() || 0} EGP</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{selectedOrder.total?.toLocaleString()} EGP</span>
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Update Status</h3>
                  <div className="flex gap-2 flex-wrap">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          selectedOrder.status === status
                            ? 'bg-deep-brown text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
                    <div className="bg-yellow-50 p-4 rounded-lg text-sm">
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-deep-brown">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-deep-brown">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">Categories</p>
                <p className="text-3xl font-bold text-deep-brown">{categories.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-deep-brown">{orders.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-deep-brown">
                  {orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()} EGP
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              {orders.length === 0 ? (
                <p className="text-gray-400">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-gray-500 text-xs uppercase border-b">
                      <tr>
                        <th className="p-3">Order #</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id} className="border-b last:border-0">
                          <td className="p-3 font-mono text-sm">{order.orderNumber || order._id.slice(-6)}</td>
                          <td className="p-3">{order.customerName || '-'}</td>
                          <td className="p-3 font-bold">{order.total?.toLocaleString()} EGP</td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                              order.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>{order.status?.toUpperCase() || 'PENDING'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">⚠️ Low Stock Products</h2>
              {products.filter(p => !p.inStock || (p.stockQuantity && p.stockQuantity < 5)).length === 0 ? (
                <p className="text-green-600">All products are in stock! ✅</p>
              ) : (
                <div className="space-y-2">
                  {products.filter(p => !p.inStock || (p.stockQuantity && p.stockQuantity < 5)).map(p => (
                    <div key={p._id} className="flex justify-between items-center bg-red-50 p-3 rounded-lg">
                      <span>{p.title_en}</span>
                      <span className="text-red-600 font-bold">{p.inStock ? `${p.stockQuantity} left` : 'Out of Stock'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Content */}
        {activeTab === 'categories' && categoryView === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-deep-brown">Categories</h1>
              <button
                onClick={() => { setEditingCategory(null); setCategoryView('editor'); }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <FaPlus /> Add Category
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {categoriesLoading ? (
                <div className="p-8 text-center text-gray-500">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <FaTags size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No categories found. Add your first one!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
                      <tr>
                        <th className="p-4">Name (EN)</th>
                        <th className="p-4">Name (AR)</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Products</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {categories.map(cat => (
                        <tr key={cat._id} className="hover:bg-gray-50">
                          <td className="p-4 font-medium">{cat.name_en}</td>
                          <td className="p-4" dir="rtl">{cat.name_ar}</td>
                          <td className="p-4 text-sm text-gray-500">{cat.type}</td>
                          <td className="p-4">{cat.productCount || 0}</td>
                          <td className="p-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${cat.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                              {cat.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => { setEditingCategory(cat); setCategoryView('editor'); }} className="text-blue-500 p-2 hover:bg-blue-50 rounded" title="Edit">
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-500 p-2 hover:bg-red-50 rounded" title="Delete">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Editor */}
        {activeTab === 'categories' && categoryView === 'editor' && (
          <CategoryEditor
            initialData={editingCategory}
            onCancel={() => setCategoryView('list')}
            onSuccess={() => {
              setCategoryView('list');
              fetchCategories();
            }}
          />
        )}

        {/* Customers Content */}
        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-deep-brown">{t.customerManagement}</h1>
              <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2">
                 <FaSearch className="text-gray-400" />
                 <input
                    placeholder="Search..."
                    className="bg-transparent outline-none w-64"
                 />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
               {customersLoading ? (
                  <div className="p-8 text-center text-gray-500">Loading customers...</div>
               ) : customers.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <FaUsers size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No customers found yet.</p>
                  </div>
               ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
                        <tr>
                          <th className="p-4">{t.customer}</th>
                          <th className="p-4">{t.phone} / {t.email}</th>
                          <th className="p-4 text-center">{t.totalOrders}</th>
                          <th className="p-4">{t.totalSpent}</th>
                          <th className="p-4">{t.lastOrder}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {customers.map((customer, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-deep-brown">{customer.name}</td>
                            <td className="p-4 text-sm text-gray-600">
                              <div className="font-medium">{customer.phone}</div>
                              <div className="text-xs text-gray-400">{customer.email}</div>
                            </td>
                            <td className="p-4 text-center">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                                {customer.totalOrders}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-green-600">{customer.totalSpent.toLocaleString()} EGP</td>
                            <td className="p-4 text-sm text-gray-500">
                                {new Date(customer.lastOrderDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               )}
            </div>
          </div>
        )}

        {/* Settings Content */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto">
             <div className="flex justify-between items-center mb-8">
               <h1 className="text-3xl font-bold text-deep-brown">{t.generalSettings}</h1>
             </div>

             <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-xl shadow-sm space-y-8">

                {/* Store Info */}
                <div>
                  <h3 className="text-lg font-bold mb-4 border-b pb-2">{t.storeName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                      <input
                        name="storeName"
                        value={settings.storeName}
                        onChange={handleSettingsChange}
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.shipping} (EGP)</label>
                      <input
                        type="number"
                        name="shippingCost"
                        value={settings.shippingCost}
                        onChange={handleSettingsChange}
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                   <h3 className="text-lg font-bold mb-4 border-b pb-2">{t.contactInfo}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                        <input
                          name="contactEmail"
                          value={settings.contactEmail}
                          onChange={handleSettingsChange}
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                        <input
                          name="contactPhone"
                          value={settings.contactPhone}
                          onChange={handleSettingsChange}
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                        <input
                          name="whatsappNumber"
                          value={settings.whatsappNumber}
                          onChange={handleSettingsChange}
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          name="address"
                          value={settings.address}
                          onChange={handleSettingsChange}
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                   </div>
                </div>

                {/* Social Media */}
                <div>
                   <h3 className="text-lg font-bold mb-4 border-b pb-2">{t.socialMedia}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                        <input
                          name="socialLinks.facebook"
                          value={settings.socialLinks?.facebook || ''}
                          onChange={handleSettingsChange}
                          placeholder="Link..."
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                        <input
                          name="socialLinks.instagram"
                          value={settings.socialLinks?.instagram || ''}
                          onChange={handleSettingsChange}
                          placeholder="Link..."
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                        <input
                          name="socialLinks.twitter"
                          value={settings.socialLinks?.twitter || ''}
                          onChange={handleSettingsChange}
                          placeholder="Link..."
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t flex justify-end">
                   <button
                     type="submit"
                     disabled={settingsLoading}
                     className="px-8 py-3 bg-deep-brown text-white rounded-lg hover:bg-gold transition disabled:opacity-50 font-bold"
                   >
                     {settingsLoading ? 'Saving...' : t.saveSettings}
                   </button>
                </div>
             </form>
          </div>
        )}

        {/* Coupons Content */}
        {activeTab === 'coupons' && couponView === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-deep-brown">{t.couponManagement}</h1>
              <button
                onClick={() => { setEditingCoupon(null); setCouponView('editor'); }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <FaPlus /> {t.addCoupon}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {couponsLoading ? (
                <div className="p-8 text-center text-gray-500">Loading coupons...</div>
              ) : coupons.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <FaTags size={48} className="mx-auto mb-4 opacity-50" />
                  <p>{t.noCoupons}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
                      <tr>
                        <th className="p-4">{t.code}</th>
                        <th className="p-4">{t.discount}</th>
                        <th className="p-4">{t.validUntil}</th>
                        <th className="p-4">{t.usage}</th>
                        <th className="p-4">{t.status}</th>
                        <th className="p-4 text-right">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {coupons.map(coupon => (
                        <tr key={coupon._id} className="hover:bg-gray-50">
                          <td className="p-4 font-mono font-bold text-deep-brown">{coupon.code}</td>
                          <td className="p-4 font-bold">
                            {coupon.discountValue} {coupon.discountType === 'percentage' ? '%' : 'EGP'}
                          </td>
                          <td className="p-4 text-sm text-gray-500">
                            {new Date(coupon.validUntil).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm">
                            {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                          </td>
                          <td className="p-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              coupon.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {coupon.isActive ? t.active : t.inactive}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => { setEditingCoupon(coupon); setCouponView('editor'); }} className="text-blue-500 p-2 hover:bg-blue-50 rounded mr-2" title={t.edit}>
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDeleteCoupon(coupon._id)} className="text-red-500 p-2 hover:bg-red-50 rounded" title={t.delete}>
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coupon Editor */}
        {activeTab === 'coupons' && couponView === 'editor' && (
             <CouponEditor
                initialData={editingCoupon}
                onCancel={() => setCouponView('list')}
                onSuccess={() => {
                    fetchCoupons();
                    setCouponView('list');
                }}
             />
        )}

      </div>
    </div>
  );
}

// --- Product Editor Sub-Component ---

// --- ProductEditor Component ---
// Separated for cleaner code structure

function ProductEditor({ initialData, onCancel, onSuccess }) {
  const isEditMode = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  // Image states
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // Categories for dropdown
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    // Fetch categories for dropdown
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setAvailableCategories(data.data);
      })
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    price: '',
    salePrice: '',
    sku: '',
    category: '',
    inStock: true,
    isNew: false,
    featured: false,
    // Dimensions
    width: '', height: '', depth: '',
    // Materials
    materials_en: '',
    materials_ar: '',
    status: 'active', // Default to active for new products
    colors: [],
    sizes: [],
    ...initialData
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
        setFormData(prev => ({
            ...prev,
            width: initialData.dimensions?.width || '',
            height: initialData.dimensions?.height || '',
            depth: initialData.dimensions?.depth || '',
            materials_en: initialData.materials_en?.join(', ') || '',
            materials_ar: initialData.materials_ar?.join(', ') || '',
            category: initialData.category?._id || '6584281483321c2123456789',
            colors: initialData.colors || [],
            sizes: initialData.sizes || [],
        }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
        if (name === 'image') {
            setImageFile(files ? files[0] : null);
        } else if (name === 'gallery') {
            setGalleryFiles(files ? Array.from(files) : []);
        }
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }
  };


  // --- Variants Handlers ---
  const handleAddColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...(prev.colors || []), { name_en: '', name_ar: '', hex: '#000000' }]
    }));
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...(formData.colors || [])];
    newColors[index] = { ...newColors[index], [field]: value };
    setFormData(prev => ({ ...prev, colors: newColors }));
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleAddSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...(prev.sizes || []), { dimensions_en: '', dimensions_ar: '', price: 0, stock: 0 }]
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...(formData.sizes || [])];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleRemoveSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMsg('Preparing data...');

    try {
        const data = new FormData();

        // Append all text fields
        Object.keys(formData).forEach(key => {
            // Skip complex fields we handle manually
            if (['materials_en', 'materials_ar', 'width', 'height', 'depth', 'image', 'category', 'colors', 'sizes'].includes(key)) {
                return;
            }
            if (typeof formData[key] !== 'object') {
                data.append(key, formData[key]);
            }
        });

        // Handle arrays
        if (typeof formData.materials_en === 'string') {
             const mats = formData.materials_en.split(',').map(s => s.trim()).filter(Boolean);
             data.append('materials_en', JSON.stringify(mats));
        }
        if (typeof formData.materials_ar === 'string') {
             const mats = formData.materials_ar.split(',').map(s => s.trim()).filter(Boolean);
             data.append('materials_ar', JSON.stringify(mats));
        }

        // Handle Variants: Colors
        if (formData.colors && formData.colors.length > 0) {
            data.append('colors', JSON.stringify(formData.colors));
        }

        // Handle Variants: Sizes
        if (formData.sizes && formData.sizes.length > 0) {
            data.append('sizes', JSON.stringify(formData.sizes));
        }

        // Handle dimensions
        const dimensions = {
            width: Number(formData.width),
            height: Number(formData.height),
            depth: Number(formData.depth),
        };
        data.append('dimensions', JSON.stringify(dimensions));

        // Handle Category from dropdown
        if (formData.category) {
            data.append('category', formData.category);
        }

        // Handle Main Image
        if (imageFile) {
            data.append('image', imageFile);
            setLoadingMsg('Uploading main image...');
        }

        // Handle Gallery Images
        if (galleryFiles.length > 0) {
            galleryFiles.forEach(file => {
                data.append('images', file);
            });
            setLoadingMsg('Uploading gallery images...');
        }

        const url = isEditMode
            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${initialData._id}`
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`;

        const method = isEditMode ? 'PUT' : 'POST';

        const res = await fetch(url, { method, body: data });
        const resData = await res.json();

        if (resData.success) {
            alert(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
            onSuccess();
        } else {
            console.error(resData);
            alert('Error: ' + (resData.message || 'Saving failed. Check console.'));
        }

    } catch (error) {
        console.error('Save error:', error);
        alert('Network error occurred.');
    } finally {
        setIsLoading(false);
        setLoadingMsg('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold mb-6 text-deep-brown">
            {isEditMode ? 'Edit Product' : 'Create New Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Main Image Upload */}
            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brown-50 file:text-deep-brown hover:file:bg-brown-100"
                />
                {isEditMode && initialData.image && (
                    <div className="mt-2 text-xs text-gray-400">Current image will be kept if no new file is chosen.</div>
                )}
            </div>

            {/* Gallery Images Upload */}
            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Multiple)</label>
                <input
                    type="file"
                    name="gallery"
                    onChange={handleChange}
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />
                {galleryFiles.length > 0 && (
                    <div className="mt-2 text-xs text-green-600">{galleryFiles.length} new images selected</div>
                )}
                {isEditMode && initialData.gallery?.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-2">Existing gallery ({initialData.gallery.length} images):</p>
                        <div className="flex gap-2 flex-wrap">
                            {initialData.gallery.map((img, idx) => (
                                <div key={idx} className="w-16 h-16 rounded overflow-hidden bg-gray-200">
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Unique Code)</label>
                    <input name="sku" value={formData.sku} onChange={handleChange} required className="input-field" placeholder="E.g. DW-TBL-001" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (EGP)</label>
                    <input name="price" type="number" value={formData.price} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
                        <option value="">-- Select Category --</option>
                        {availableCategories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name_en}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                    <input name="title_en" value={formData.title_en} onChange={handleChange} required className="input-field" />
                </div>
                <div dir="rtl">
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج (عربي)</label>
                    <input name="title_ar" value={formData.title_ar} onChange={handleChange} required className="input-field" />
                </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                    <textarea name="description_en" value={formData.description_en} onChange={handleChange} rows="4" className="input-field" />
                </div>
                <div dir="rtl">
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (عربي)</label>
                    <textarea name="description_ar" value={formData.description_ar} onChange={handleChange} rows="4" className="input-field" />
                </div>
            </div>

            {/* Price & Sale Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (Optional)</label>
                    <input name="salePrice" type="number" value={formData.salePrice} onChange={handleChange} className="input-field" placeholder="Leave empty if no discount" />
                </div>
            </div>

            {/* Dimensions */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📐 Dimensions (cm)</label>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Width</label>
                        <input name="width" type="number" value={formData.width} onChange={handleChange} className="input-field" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Height</label>
                        <input name="height" type="number" value={formData.height} onChange={handleChange} className="input-field" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Depth</label>
                        <input name="depth" type="number" value={formData.depth} onChange={handleChange} className="input-field" placeholder="0" />
                    </div>
                </div>
            </div>

            {/* Materials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">🪵 Materials (English)</label>
                    <input name="materials_en" value={formData.materials_en} onChange={handleChange} className="input-field" placeholder="e.g. Oak, Walnut, Metal" />
                    <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
                </div>
                <div dir="rtl">
                    <label className="block text-sm font-medium text-gray-700 mb-1">🪵 المواد (عربي)</label>
                    <input name="materials_ar" value={formData.materials_ar} onChange={handleChange} className="input-field" placeholder="مثال: خشب بلوط، جوز، معدن" />
                    <p className="text-xs text-gray-400 mt-1">افصل بفاصلة</p>
                </div>
            </div>

            {/* Variants: Colors */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">🎨 Colors (Optional)</label>
                    <button type="button" onClick={handleAddColor} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Color</button>
                </div>
                {formData.colors?.map((color, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center bg-white p-2 rounded shadow-sm border border-gray-100">
                        <input type="color" value={color.hex} onChange={(e) => handleColorChange(index, 'hex', e.target.value)} className="h-10 w-10 p-0 border-0 rounded cursor-pointer shrink-0" title="Choose hex color" />
                        <input placeholder="Name (EN)" value={color.name_en} onChange={(e) => handleColorChange(index, 'name_en', e.target.value)} className="input-field flex-1 text-sm py-2" />
                        <div dir="rtl" className="flex-1">
                             <input placeholder="الاسم (عربي)" value={color.name_ar} onChange={(e) => handleColorChange(index, 'name_ar', e.target.value)} className="input-field text-sm py-2" />
                        </div>
                        <button type="button" onClick={() => handleRemoveColor(index)} className="text-red-500 hover:bg-red-50 p-2 rounded"><FaTrash size={14} /></button>
                    </div>
                ))}
            </div>

            {/* Variants: Sizes */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">📏 Sizes / Variants (Optional)</label>
                    <button type="button" onClick={handleAddSize} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Size</button>
                </div>
                {formData.sizes?.map((size, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 items-end bg-white p-3 rounded shadow-sm border border-gray-100">
                        <div>
                             <label className="text-xs text-gray-500 mb-1 block">Dims (EN)</label>
                             <input placeholder="180x200" value={size.dimensions_en} onChange={(e) => handleSizeChange(index, 'dimensions_en', e.target.value)} className="input-field text-sm py-2" />
                        </div>
                         <div dir="rtl">
                             <label className="text-xs text-gray-500 mb-1 block">الأبعاد (عربي)</label>
                             <input placeholder="180x200" value={size.dimensions_ar} onChange={(e) => handleSizeChange(index, 'dimensions_ar', e.target.value)} className="input-field text-sm py-2" />
                        </div>
                        <div>
                             <label className="text-xs text-gray-500 mb-1 block">Price (Override)</label>
                             <input type="number" placeholder="Price" value={size.price} onChange={(e) => handleSizeChange(index, 'price', e.target.value)} className="input-field text-sm py-2" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">Stock</label>
                                <input type="number" placeholder="Qty" value={size.stock} onChange={(e) => handleSizeChange(index, 'stock', e.target.value)} className="input-field text-sm py-2" />
                            </div>
                            <button type="button" onClick={() => handleRemoveSize(index)} className="text-red-500 hover:bg-red-50 p-2 rounded mt-4"><FaTrash size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stock & Flags */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stock Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                    <select
                        name="inStock"
                        value={formData.inStock ? 'true' : 'false'}
                        onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.value === 'true' }))}
                        className="input-field"
                    >
                        <option value="true">🟢 In Stock (موجود)</option>
                        <option value="false">🔴 Out of Stock (نفذ)</option>
                    </select>
                </div>

                {/* Stock Quantity */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                        name="stockQuantity"
                        type="number"
                        min="0"
                        value={formData.stockQuantity || ''}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="0"
                    />
                </div>

                {/* New Arrival */}
                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 w-full">
                        <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-5 h-5 accent-green-500" />
                        <span>🆕 New Arrival</span>
                    </label>
                </div>

                {/* Featured */}
                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 w-full">
                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-yellow-500" />
                        <span>⭐ Featured</span>
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t flex justify-end gap-3">
                <button type="button" onClick={onCancel} className="px-6 py-2 border rounded hover:bg-gray-50">Cancel</button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-deep-brown text-white rounded hover:bg-gold transition disabled:opacity-50"
                >
                    {loadingMsg || (isLoading ? 'Saving...' : 'Save Product')}
                </button>
            </div>
        </form>

        <style jsx>{`
            .input-field {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                outline: none;
            }
            .input-field:focus {
                border-color: #D4AF37; /* gold */
                box-shadow: 0 0 0 1px #D4AF37;
            }
        `}</style>
    </div>
  );
}

// --- CategoryEditor Component ---

function CategoryEditor({ initialData, onCancel, onSuccess }) {
  const isEditMode = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    type: 'product',
    status: 'active',
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories/${initialData._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`;

      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        alert(isEditMode ? 'Category updated successfully!' : 'Category created successfully!');
        onSuccess();
      } else {
        alert('Error: ' + (data.error || 'Saving failed'));
      }

    } catch (error) {
      console.error('Save error:', error);
      alert('Network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      <h2 className="text-xl font-bold mb-6 text-deep-brown">
        {isEditMode ? 'Edit Category' : 'Create New Category'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
            <input
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-gold focus:border-gold outline-none"
              placeholder="e.g. Tables"
            />
          </div>
          <div dir="rtl">
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم (عربي) *</label>
            <input
              name="name_ar"
              value={formData.name_ar}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-gold focus:border-gold outline-none"
              placeholder="مثال: طاولات"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border rounded-lg focus:ring-gold focus:border-gold outline-none"
            />
          </div>
          <div dir="rtl">
            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (عربي)</label>
            <textarea
              name="description_ar"
              value={formData.description_ar}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border rounded-lg focus:ring-gold focus:border-gold outline-none"
            />
          </div>
        </div>

        {/* Type and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option value="product">Product</option>
              <option value="project">Project</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option value="active">🟢 Active</option>
              <option value="inactive">🔴 Inactive</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-2 border rounded hover:bg-gray-50">Cancel</button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-deep-brown text-white rounded hover:bg-gold transition disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- CouponEditor Component ---
function CouponEditor({ initialData, onCancel, onSuccess }) {
  const isEditMode = !!initialData;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    discountType: initialData?.discountType || 'percentage',
    discountValue: initialData?.discountValue || '',
    minOrderAmount: initialData?.minOrderAmount || '',
    maxDiscount: initialData?.maxDiscount || '',
    usageLimit: initialData?.usageLimit || '',
    validUntil: initialData?.validUntil ? new Date(initialData.validUntil).toISOString().split('T')[0] : '',
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/coupons/${initialData._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/coupons`;

      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        alert(isEditMode ? 'Coupon updated successfully!' : 'Coupon created successfully!');
        onSuccess(data.data);
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{isEditMode ? 'Edit Coupon' : 'Create New Coupon'}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <FaTimes size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg font-mono uppercase"
              placeholder="e.g. SUMMER20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
            <input
              type="date"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (EGP)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
              min="0"
              className="w-full p-3 border rounded-lg"
              placeholder={formData.discountType === 'percentage' ? '20' : '100'}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
            <input
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border rounded-lg"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (Optional)</label>
            <input
              type="number"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border rounded-lg text-gray-400"
              readOnly={formData.discountType === 'fixed'}
              placeholder={formData.discountType === 'fixed' ? 'N/A' : 'No Limit'}
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (Optional)</label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              min="1"
              className="w-full p-3 border rounded-lg"
              placeholder="Unlimited"
            />
          </div>
        </div>

        <div>
           <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 accent-green-600"
              />
              <span className="font-medium">Active</span>
           </label>
        </div>

        <div className="pt-6 border-t flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-2 border rounded hover:bg-gray-50">Cancel</button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-deep-brown text-white rounded hover:bg-gold transition disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Coupon'}
          </button>
        </div>
      </form>
    </div>
  );
}
