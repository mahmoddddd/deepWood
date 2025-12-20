'use client';
import { useEffect, useState } from 'react';
import { FaBox, FaProjectDiagram, FaShoppingCart, FaEnvelope, FaUsers, FaEye } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, projects: 0, orders: 0, contacts: 0, clients: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { headers }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, { headers }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, { headers }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, { headers }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { headers }).then(r => r.json()),
    ]).then(([products, projects, orders, contacts, clients]) => {
      setStats({
        products: products.total || products.count || 0,
        projects: projects.total || projects.count || 0,
        orders: orders.total || orders.count || 0,
        contacts: contacts.total || contacts.count || 0,
        clients: clients.total || clients.count || 0,
      });
      setRecentOrders((orders.data || []).slice(0, 5));
      setRecentContacts((contacts.data || []).slice(0, 5));
    }).catch(console.error);
  }, []);

  const statCards = [
    { label: 'Products', value: stats.products, icon: FaBox, color: 'bg-blue-500' },
    { label: 'Projects', value: stats.projects, icon: FaProjectDiagram, color: 'bg-green-500' },
    { label: 'Orders', value: stats.orders, icon: FaShoppingCart, color: 'bg-purple-500' },
    { label: 'Contacts', value: stats.contacts, icon: FaEnvelope, color: 'bg-orange-500' },
    { label: 'Clients', value: stats.clients, icon: FaUsers, color: 'bg-gold' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-deep-brown mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-deep-brown">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-deep-brown mb-4">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.orderNumber}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{order.status}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">No orders yet</p>}
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-deep-brown mb-4">Recent Contact Requests</h2>
          {recentContacts.length > 0 ? (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div key={contact._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{contact.subject || contact.message?.slice(0, 30)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${contact.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{contact.status}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">No contact requests yet</p>}
        </div>
      </div>
    </div>
  );
}
