'use client';
import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name_en: '', name_ar: '', industry_en: '', industry_ar: '', featured: false, isCorporate: true, status: 'active' });

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { headers: { Authorization: `Bearer ${token}` } });
    setClients((await res.json()).data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${process.env.NEXT_PUBLIC_API_URL}/clients/${editing._id}` : `${process.env.NEXT_PUBLIC_API_URL}/clients`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setShowModal(false); setEditing(null); fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-deep-brown">Clients</h1><button onClick={() => { setEditing(null); setForm({ name_en: '', name_ar: '', industry_en: '', industry_ar: '', featured: false, isCorporate: true, status: 'active' }); setShowModal(true); }} className="btn-primary flex items-center gap-2"><FaPlus /> Add</button></div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y">{loading ? <tr><td colSpan={4} className="px-6 py-8 text-center">Loading...</td></tr> : clients.map((c) => (<tr key={c._id}><td className="px-6 py-4"><div>{c.name_en}</div><div className="text-sm text-gray-500 font-cairo">{c.name_ar}</div></td><td className="px-6 py-4">{c.industry_en}</td><td className="px-6 py-4">{c.isCorporate && <span className="px-2 py-1 text-xs bg-gold text-deep-brown rounded">Corporate</span>}</td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => { setEditing(c); setForm({ name_en: c.name_en, name_ar: c.name_ar, industry_en: c.industry_en || '', industry_ar: c.industry_ar || '', featured: c.featured, isCorporate: c.isCorporate, status: c.status }); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEdit /></button><button onClick={() => handleDelete(c._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button></div></td></tr>))}</tbody>
        </table>
      </div>
      {showModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="p-6 border-b"><h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} Client</h2></div><form onSubmit={handleSubmit} className="p-6 space-y-4"><input required placeholder="Name (EN)" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input required placeholder="Name (AR)" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="w-full px-3 py-2 border rounded-lg" dir="rtl" /><input placeholder="Industry (EN)" value={form.industry_en} onChange={(e) => setForm({ ...form, industry_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.isCorporate} onChange={(e) => setForm({ ...form, isCorporate: e.target.checked })} />Corporate</label></div><div className="flex justify-end gap-3"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="btn-primary">Save</button></div></form></div></div>)}
    </div>
  );
}
