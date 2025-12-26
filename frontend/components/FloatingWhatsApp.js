'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

// WhatsApp number for Deep Wood
const WHATSAPP_NUMBER = '+201020883895';
const OWNER_NAME = 'Deep Wood';

export default function FloatingWhatsApp({ locale = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [message, setMessage] = useState('');

  const isRTL = locale === 'ar';

  // Show button after a short delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Default welcome message
  const defaultMessage = isRTL
    ? 'مرحباً، أود الاستفسار عن خدمات Deep Wood للأثاث الخشبي الفاخر.'
    : 'Hello, I would like to inquire about Deep Wood premium furniture services.';

  const handleSendMessage = () => {
    const textMessage = message || defaultMessage;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(textMessage)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  const handleDirectChat = () => {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!showButton) return null;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {/* Chat Popup */}
        {isOpen && (
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden w-80 animate-slideUp"
            style={{
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🪵</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{OWNER_NAME}</h3>
                    <p className="text-green-100 text-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                      {isRTL ? 'متاح الآن' : 'Online Now'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-gray-50">
              {/* Welcome Message Bubble */}
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm mb-4 max-w-[90%]">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {isRTL
                    ? '👋 مرحباً! أنا هنا لمساعدتك. كيف يمكنني خدمتك اليوم؟'
                    : '👋 Hello! I\'m here to help. How can I assist you today?'}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {isRTL ? 'الآن' : 'Just now'}
                </span>
              </div>

              {/* Quick Responses */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setMessage(isRTL ? 'أريد الاستفسار عن أسعار الأثاث' : 'I want to ask about furniture prices')}
                  className="text-xs bg-white border border-green-500 text-green-600 px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors"
                >
                  {isRTL ? '💰 الأسعار' : '💰 Prices'}
                </button>
                <button
                  onClick={() => setMessage(isRTL ? 'أريد تصميم أثاث مخصص' : 'I want custom furniture design')}
                  className="text-xs bg-white border border-green-500 text-green-600 px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors"
                >
                  {isRTL ? '🎨 تصميم مخصص' : '🎨 Custom Design'}
                </button>
                <button
                  onClick={() => setMessage(isRTL ? 'أريد حجز موعد للمعاينة' : 'I want to book a showroom visit')}
                  className="text-xs bg-white border border-green-500 text-green-600 px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors"
                >
                  {isRTL ? '📅 حجز موعد' : '📅 Book Visit'}
                </button>
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isRTL ? 'اكتب رسالتك...' : 'Type your message...'}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-green-500 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-4 py-2 text-center">
              <p className="text-xs text-gray-500">
                {isRTL ? 'مدعوم بواسطة WhatsApp' : 'Powered by WhatsApp'}
              </p>
            </div>
          </div>
        )}

        {/* Main WhatsApp Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          style={{
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.5)',
          }}
        >
          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30"></span>

          {/* Icon */}
          <FaWhatsapp className="w-7 h-7 relative z-10" />

          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {isRTL ? 'تواصل معنا' : 'Chat with us'}
            <span className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 rotate-45"></span>
          </span>

          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
            1
          </span>
        </button>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
