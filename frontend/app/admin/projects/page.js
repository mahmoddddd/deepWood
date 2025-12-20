'use client';
import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ title_en: '', title_ar: '', description_en: '', description_ar: '', projectType: 'residential', status: 'draft', featured: false, isCorporate: false });

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?search=${search}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setProjects(data.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingProject ? 'PUT' : 'POST';
    const url = editingProject ? `${process.env.NEXT_PUBLIC_API_URL}/projects/${editingProject._id}` : `${process.env.NEXT_PUBLIC_API_URL}/projects`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setShowModal(false);
    setEditingProject(null);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-deep-brown">Projects</h1>
        <button onClick={() => { setEditingProject(null); setShowModal(true); }} className="btn-primary flex items-center gap-2"><FaPlus /> Add Project</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={4} className="px-6 py-8 text-center">Loading...</td></tr> : projects.map((p) => (
              <tr key={p._id}>
                <td className="px-6 py-4"><div>{p.title_en}</div><div className="text-sm text-gray-500 font-cairo">{p.title_ar}</div></td>
                <td className="px-6 py-4 capitalize">{p.projectType}{p.isCorporate && <span className="ml-2 px-2 py-1 text-xs bg-gold text-deep-brown rounded">Corp</span>}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span></td>
                <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => { setEditingProject(p); setForm({ title_en: p.title_en, title_ar: p.title_ar, description_en: p.description_en || '', description_ar: p.description_ar || '', projectType: p.projectType, status: p.status, featured: p.featured, isCorporate: p.isCorporate }); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEdit /></button><button onClick={() => handleDelete(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b"><h2 className="text-xl font-bold">{editingProject ? 'Edit' : 'Add'} Project</h2></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Title (EN) *</label><input required value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Title (AR) *</label><input required value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="w-full px-3 py-2 border rounded-lg" dir="rtl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Type</label><select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="residential">Residential</option><option value="corporate">Corporate</option><option value="custom">Custom</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="draft">Draft</option><option value="active">Active</option></select></div>
              </div>
              <div className="flex gap-6"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /><span>Featured</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={form.isCorporate} onChange={(e) => setForm({ ...form, isCorporate: e.target.checked })} /><span>Corporate Project</span></label></div>
              <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="btn-primary">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
