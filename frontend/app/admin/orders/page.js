'use client';
import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { setOrders(data.data || []); setLoading(false); });
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
  };

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

  return (
    <div>
      <h1 className="text-2xl font-bold text-deep-brown mb-6">Orders</h1>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th></tr></thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={5} className="px-6 py-8 text-center">Loading...</td></tr> : orders.length === 0 ? <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orders yet</td></tr> : orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 font-mono text-sm">{order.orderNumber}</td>
                <td className="px-6 py-4"><div>{order.customerName}</div><div className="text-sm text-gray-500">{order.customerPhone}</div></td>
                <td className="px-6 py-4 font-medium">{order.total?.toLocaleString()} EGP</td>
                <td className="px-6 py-4"><select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className={`${statusColors[order.status]} px-2 py-1 text-xs rounded border-0 cursor-pointer`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
