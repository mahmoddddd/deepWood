'use client';
import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import translations from '@/locales/en/common.json';

export default function ContactPage() {
  const t = translations;
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', type: 'general' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus({ loading: false, success: true, error: '' });
        setForm({ name: '', email: '', phone: '', message: '', type: 'general' });
      } else throw new Error('Failed to submit');
    } catch (err) {
      setStatus({ loading: false, success: false, error: t.contact.error });
    }
  };

  return (
    <>
      <section className="pt-32 pb-20 bg-deep-brown text-white">
        <div className="container-custom text-center">
          <div className="gold-line mx-auto mb-4"></div>
          <h1 className="text-5xl font-bold mb-4">{t.contact.title}</h1>
          <p className="text-xl text-beige">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center"><FaMapMarkerAlt className="text-gold text-xl" /></div>
                <div><h3 className="font-semibold text-deep-brown">Address</h3><p className="text-warm-gray">{t.footer.address}</p></div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center"><FaPhone className="text-gold text-xl" /></div>
                <div><h3 className="font-semibold text-deep-brown">Phone</h3><p className="text-warm-gray">{t.footer.phone}</p></div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center"><FaEnvelope className="text-gold text-xl" /></div>
                <div><h3 className="font-semibold text-deep-brown">Email</h3><p className="text-warm-gray">{t.footer.email}</p></div>
              </div>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" className="flex items-center justify-center gap-3 bg-green-500 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-green-600 transition-colors">
                <FaWhatsapp size={24} /> Chat on WhatsApp
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-deep-brown mb-6">{t.contact.quotation}</h2>
                {status.success && <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">{t.contact.success}</div>}
                {status.error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{status.error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-deep-brown mb-2">{t.contact.name} *</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-deep-brown mb-2">{t.contact.email} *</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-deep-brown mb-2">{t.contact.phone}</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" /></div>
                  <div><label className="block text-sm font-medium text-deep-brown mb-2">Request Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                      <option value="general">General Inquiry</option><option value="quotation">Quotation Request</option><option value="support">Support</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-deep-brown mb-2">{t.contact.message} *</label><textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field"></textarea></div>
                  <button type="submit" disabled={status.loading} className="btn-primary w-full">{status.loading ? 'Sending...' : t.contact.submit}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
