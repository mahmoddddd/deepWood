'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBoxOpen, FaImage, FaTimes, FaShoppingBag, FaEye, FaCheck } from 'react-icons/fa';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'

  // Products State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [editingProduct, setEditingProduct] = useState(null);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // --- Auth & Data Fetching ---

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password for now
      setIsAuthenticated(true);
      fetchProducts();
      fetchOrders();
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
          <h1 className="text-2xl font-bold text-center mb-6 text-deep-brown">Admin Login</h1>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Enter Password"
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-deep-brown text-white py-3 rounded font-bold hover:bg-gold transition">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('products'); setView('list'); }}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'products'
                ? 'text-deep-brown border-b-2 border-deep-brown'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FaBoxOpen className="inline mr-2" /> Products
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'orders'
                ? 'text-deep-brown border-b-2 border-deep-brown'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FaShoppingBag className="inline mr-2" /> Orders ({orders.length})
          </button>
        </div>

        {/* Header */}
        {activeTab === 'products' && (
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-deep-brown">Product Management</h1>
            {view === 'list' && (
              <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                  <FaPlus /> Add New Product
              </button>
            )}
            {view === 'editor' && (
               <button
                  onClick={() => setView('list')}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
               >
                  Cancel
               </button>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-deep-brown">Order Management</h1>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Refresh Orders
            </button>
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
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes size={20} />
                </button>
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
            category: initialData.category?._id || '6584281483321c2123456789'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMsg('Preparing data...');

    try {
        const data = new FormData();

        // Append all text fields
        Object.keys(formData).forEach(key => {
            // Skip complex fields we handle manually
            if (['materials_en', 'materials_ar', 'width', 'height', 'depth', 'image', 'category'].includes(key)) {
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

        // Handle dimensions
        const dimensions = {
            width: Number(formData.width),
            height: Number(formData.height),
            depth: Number(formData.depth),
        };
        data.append('dimensions', JSON.stringify(dimensions));

        // Default category - Ensure it's a single string ID
        let catId = formData.category;
        if (Array.isArray(catId)) {
            // If somehow got an array (e.g. ['','ID']), find the ID part
            catId = catId.find(c => c && c.length > 10) || '6584281483321c2123456789';
        }
        if (!catId) catId = '6584281483321c2123456789';

        data.append('category', String(catId));

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Unique Code)</label>
                    <input name="sku" value={formData.sku} onChange={handleChange} required className="input-field" placeholder="E.g. DW-TBL-001" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (EGP)</label>
                    <input name="price" type="number" value={formData.price} onChange={handleChange} required className="input-field" />
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
