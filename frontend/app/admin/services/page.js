'use client';
import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title_en: '', title_ar: '', shortDescription_en: '', shortDescription_ar: '', featured: false, status: 'active' });

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, { headers: { Authorization: `Bearer ${token}` } });
    setServices((await res.json()).data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${process.env.NEXT_PUBLIC_API_URL}/services/${editing._id}` : `${process.env.NEXT_PUBLIC_API_URL}/services`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setShowModal(false); setEditing(null); fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-deep-brown">Services</h1><button onClick={() => { setEditing(null); setForm({ title_en: '', title_ar: '', shortDescription_en: '', shortDescription_ar: '', featured: false, status: 'active' }); setShowModal(true); }} className="btn-primary flex items-center gap-2"><FaPlus /> Add</button></div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y">{loading ? <tr><td colSpan={3} className="px-6 py-8 text-center">Loading...</td></tr> : services.map((s) => (<tr key={s._id}><td className="px-6 py-4"><div>{s.title_en}</div><div className="text-sm text-gray-500 font-cairo">{s.title_ar}</div></td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{s.status}</span></td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => { setEditing(s); setForm({ title_en: s.title_en, title_ar: s.title_ar, shortDescription_en: s.shortDescription_en || '', shortDescription_ar: s.shortDescription_ar || '', featured: s.featured, status: s.status }); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEdit /></button><button onClick={() => handleDelete(s._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button></div></td></tr>))}</tbody>
        </table>
      </div>
      {showModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg shadow-xl w-full max-w-lg"><div className="p-6 border-b"><h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} Service</h2></div><form onSubmit={handleSubmit} className="p-6 space-y-4"><div className="grid grid-cols-2 gap-4"><input required placeholder="Title (EN)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input required placeholder="Title (AR)" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="w-full px-3 py-2 border rounded-lg" dir="rtl" /></div><textarea placeholder="Description (EN)" value={form.shortDescription_en} onChange={(e) => setForm({ ...form, shortDescription_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2}></textarea><textarea placeholder="Description (AR)" value={form.shortDescription_ar} onChange={(e) => setForm({ ...form, shortDescription_ar: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} dir="rtl"></textarea><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />Featured</label><div className="flex justify-end gap-3"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="btn-primary">Save</button></div></form></div></div>)}
    </div>
  );
}
