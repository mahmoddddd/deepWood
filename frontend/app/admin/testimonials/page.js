'use client';
import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name_en: '', name_ar: '', title_en: '', title_ar: '', content_en: '', content_ar: '', rating: 5, featured: false, status: 'active' });

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, { headers: { Authorization: `Bearer ${token}` } });
    setTestimonials((await res.json()).data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${editing._id}` : `${process.env.NEXT_PUBLIC_API_URL}/testimonials`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setShowModal(false); setEditing(null); fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-deep-brown">Testimonials</h1><button onClick={() => { setEditing(null); setForm({ name_en: '', name_ar: '', title_en: '', title_ar: '', content_en: '', content_ar: '', rating: 5, featured: false, status: 'active' }); setShowModal(true); }} className="btn-primary flex items-center gap-2"><FaPlus /> Add</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p>Loading...</p> : testimonials.map((t) => (
          <div key={t._id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-3"><div><h3 className="font-semibold">{t.name_en}</h3><p className="text-sm text-gray-500">{t.title_en}</p></div><div className="flex gap-1">{[...Array(t.rating)].map((_, i) => <FaStar key={i} className="text-gold" size={12} />)}</div></div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{t.content_en}</p>
            <div className="flex justify-between items-center"><span className={`px-2 py-1 text-xs rounded ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{t.status}</span><div className="flex gap-2"><button onClick={() => { setEditing(t); setForm({ name_en: t.name_en, name_ar: t.name_ar, title_en: t.title_en || '', title_ar: t.title_ar || '', content_en: t.content_en, content_ar: t.content_ar, rating: t.rating, featured: t.featured, status: t.status }); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEdit size={12} /></button><button onClick={() => handleDelete(t._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash size={12} /></button></div></div>
          </div>
        ))}
      </div>
      {showModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"><div className="p-6 border-b"><h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} Testimonial</h2></div><form onSubmit={handleSubmit} className="p-6 space-y-4"><div className="grid grid-cols-2 gap-4"><input required placeholder="Name (EN)" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input required placeholder="Name (AR)" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="w-full px-3 py-2 border rounded-lg" dir="rtl" /></div><div className="grid grid-cols-2 gap-4"><input placeholder="Title (EN)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input placeholder="Title (AR)" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="w-full px-3 py-2 border rounded-lg" dir="rtl" /></div><textarea required placeholder="Content (EN)" value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3}></textarea><textarea required placeholder="Content (AR)" value={form.content_ar} onChange={(e) => setForm({ ...form, content_ar: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} dir="rtl"></textarea><div className="flex items-center gap-4"><label className="text-sm">Rating:</label><select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="px-3 py-2 border rounded-lg">{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}</select></div><div className="flex justify-end gap-3"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="btn-primary">Save</button></div></form></div></div>)}
    </div>
  );
}
