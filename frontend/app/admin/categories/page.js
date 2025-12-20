'use client';
import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name_en: '', name_ar: '', type: 'both', status: 'active' });

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } });
    setCategories((await res.json()).data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${editing._id}` : `${process.env.NEXT_PUBLIC_API_URL}/categories`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setShowModal(false); setEditing(null); fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-deep-brown">Categories</h1><button onClick={() => { setEditing(null); setForm({ name_en: '', name_ar: '', type: 'both', status: 'active' }); setShowModal(true); }} className="btn-primary flex items-center gap-2"><FaPlus /> Add</button></div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name (EN)</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name (AR)</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y">{loading ? <tr><td colSpan={4} className="px-6 py-8 text-center">Loading...</td></tr> : categories.map((c) => (<tr key={c._id}><td className="px-6 py-4">{c.name_en}</td><td className="px-6 py-4 font-cairo">{c.name_ar}</td><td className="px-6 py-4 capitalize">{c.type}</td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => { setEditing(c); setForm({ name_en: c.name_en, name_ar: c.name_ar, type: c.type, status: c.status }); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEdit /></button><button onClick={() => handleDelete(c._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button></div></td></tr>))}</tbody>
        </table>
      </div>
      {showModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="p-6 border-b"><h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} Category</h2></div><form onSubmit={handleSubmit} className="p-6 space-y-4"><input required placeholder="Name (EN)" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input required placeholder="Name (AR)" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="w-full px-3 py-2 border rounded-lg" dir="rtl" /><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="both">Both</option><option value="product">Product</option><option value="project">Project</option></select><div className="flex justify-end gap-3"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="btn-primary">Save</button></div></form></div></div>)}
    </div>
  );
}
