'use client';
import { useEffect, useState } from 'react';
import { FaEye, FaReply, FaTrash } from 'react-icons/fa';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { setContacts(data.data || []); setLoading(false); });
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    setContacts(contacts.map(c => c._id === id ? { ...c, status } : c));
  };

  const deleteContact = async (id) => {
    if (!confirm('Delete this request?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setContacts(contacts.filter(c => c._id !== id));
  };

  const statusColors = { new: 'bg-blue-100 text-blue-700', read: 'bg-gray-100 text-gray-700', replied: 'bg-green-100 text-green-700', closed: 'bg-gray-200 text-gray-500' };

  return (
    <div>
      <h1 className="text-2xl font-bold text-deep-brown mb-6">Contact Requests</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y">
              {loading ? <tr><td colSpan={4} className="px-4 py-8 text-center">Loading...</td></tr> : contacts.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No requests</td></tr> : contacts.map((c) => (
                <tr key={c._id} className={`cursor-pointer ${selected?._id === c._id ? 'bg-beige' : 'hover:bg-gray-50'}`} onClick={() => setSelected(c)}>
                  <td className="px-4 py-3"><div className="font-medium">{c.name}</div><div className="text-sm text-gray-500">{c.email}</div></td>
                  <td className="px-4 py-3 capitalize text-sm">{c.type}</td>
                  <td className="px-4 py-3"><span className={`${statusColors[c.status]} px-2 py-1 text-xs rounded`}>{c.status}</span></td>
                  <td className="px-4 py-3"><button onClick={(e) => { e.stopPropagation(); deleteContact(c._id); }} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {selected ? (
            <>
              <div className="flex justify-between items-start mb-4"><h2 className="text-lg font-bold">{selected.name}</h2><select value={selected.status} onChange={(e) => { updateStatus(selected._id, e.target.value); setSelected({ ...selected, status: e.target.value }); }} className="text-sm border rounded px-2 py-1"><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="closed">Closed</option></select></div>
              <div className="space-y-3 text-sm"><div><span className="text-gray-500">Email:</span> {selected.email}</div>{selected.phone && <div><span className="text-gray-500">Phone:</span> {selected.phone}</div>}<div><span className="text-gray-500">Type:</span> {selected.type}</div><hr /><div><span className="text-gray-500 block mb-1">Message:</span><p className="whitespace-pre-wrap">{selected.message}</p></div><div className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString()}</div></div>
            </>
          ) : <p className="text-gray-500 text-center py-8">Select a request to view</p>}
        </div>
      </div>
    </div>
  );
}
