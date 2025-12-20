'use client';
import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ title_en: '', title_ar: '', description_en: '', description_ar: '', price: '', category: '', status: 'draft', featured: false });

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?search=${search}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setProducts(data.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `${process.env.NEXT_PUBLIC_API_URL}/products/${editingProduct._id}` : `${process.env.NEXT_PUBLIC_API_URL}/products`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setShowModal(false);
    setEditingProduct(null);
    setForm({ title_en: '', title_ar: '', description_en: '', description_ar: '', price: '', category: '', status: 'draft', featured: false });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchProducts();
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({ title_en: product.title_en, title_ar: product.title_ar, description_en: product.description_en || '', description_ar: product.description_ar || '', price: product.price, category: product.category?._id || '', status: product.status, featured: product.featured });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-deep-brown">Products</h1>
        <button onClick={() => { setEditingProduct(null); setForm({ title_en: '', title_ar: '', description_en: '', description_ar: '', price: '', category: '', status: 'draft', featured: false }); setShowModal(true); }} className="btn-primary flex items-center gap-2"><FaPlus /> Add Product</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-gold" /></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title (EN)</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title (AR)</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr> : products.length === 0 ? <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No products found</td></tr> : products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">{product.title_en}</td>
                <td className="px-6 py-4 font-cairo">{product.title_ar}</td>
                <td className="px-6 py-4">{product.price?.toLocaleString()} EGP</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{product.status}</span></td>
                <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => openEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEdit /></button><button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b"><h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Title (English) *</label><input type="text" required value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold" /></div>
                <div><label className="block text-sm font-medium mb-1">Title (Arabic) *</label><input type="text" required value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold" dir="rtl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Description (EN)</label><textarea rows={3} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold"></textarea></div>
                <div><label className="block text-sm font-medium mb-1">Description (AR)</label><textarea rows={3} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold" dir="rtl"></textarea></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Price (EGP) *</label><input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold" /></div>
                <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gold"><option value="draft">Draft</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
              </div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /><span className="text-sm">Featured Product</span></label></div>
              <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="btn-primary">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
