'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaBox, FaProjectDiagram, FaTags, FaCogs, FaUsers, FaQuoteLeft, FaShoppingCart, FaEnvelope, FaSignOutAlt, FaBars } from 'react-icons/fa';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FaHome },
  { href: '/admin/products', label: 'Products', icon: FaBox },
  { href: '/admin/projects', label: 'Projects', icon: FaProjectDiagram },
  { href: '/admin/categories', label: 'Categories', icon: FaTags },
  { href: '/admin/services', label: 'Services', icon: FaCogs },
  { href: '/admin/clients', label: 'Clients', icon: FaUsers },
  { href: '/admin/testimonials', label: 'Testimonials', icon: FaQuoteLeft },
  { href: '/admin/orders', label: 'Orders', icon: FaShoppingCart },
  { href: '/admin/contacts', label: 'Contacts', icon: FaEnvelope },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/admin/login'); return; }
    if (userData) setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (!user) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-deep-brown text-white transition-all duration-300 fixed h-full z-40`}>
        <div className="p-4 border-b border-white/10">
          <Link href="/admin/dashboard" className="text-xl font-bold">{sidebarOpen ? 'Deep Wood' : 'DW'}</Link>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href ? 'bg-gold text-deep-brown' : 'hover:bg-white/10'}`}>
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-white/10 text-red-300">
            <FaSignOutAlt size={18} />{sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg"><FaBars /></button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-deep-brown font-bold">{user.name?.charAt(0)}</div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
