'use client';

import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
  {
    questionEn: 'What is the project execution time?',
    questionAr: 'ما هي مدة تنفيذ المشروع؟',
    answerEn: 'Execution time varies by project size. Small projects take 2-4 weeks, while larger projects may take 2-3 months.',
    answerAr: 'تختلف مدة التنفيذ حسب حجم المشروع. المشاريع الصغيرة تستغرق من 2-4 أسابيع، بينما المشاريع الكبيرة قد تستغرق 2-3 أشهر.',
  },
  {
    questionEn: 'Do you offer warranty on furniture?',
    questionAr: 'هل تقدمون ضمان على الأثاث؟',
    answerEn: 'Yes, we offer a 5-year warranty on all our products against manufacturing defects, with free maintenance service in the first year.',
    answerAr: 'نعم، نقدم ضمان 5 سنوات على جميع منتجاتنا ضد عيوب التصنيع، مع خدمة صيانة مجانية في السنة الأولى.',
  },
  {
    questionEn: 'Can you design custom furniture?',
    questionAr: 'هل يمكنكم تصميم أثاث مخصص؟',
    answerEn: 'Absolutely! We specialize in custom furniture. Our design team works with you to turn your ideas into reality.',
    answerAr: 'بالتأكيد! نحن متخصصون في الأثاث المخصص. فريق التصميم لدينا يعمل معك لتحويل أفكارك إلى واقع.',
  },
  {
    questionEn: 'What payment methods are available?',
    questionAr: 'ما هي طرق الدفع المتاحة؟',
    answerEn: 'We accept cash, bank transfer, and installment payments up to 12 months interest-free for large projects.',
    answerAr: 'نقبل الدفع نقداً، التحويل البنكي، والدفع بالتقسيط حتى 12 شهر بدون فوائد للمشاريع الكبيرة.',
  },
  {
    questionEn: 'Do you serve areas outside Cairo?',
    questionAr: 'هل تخدمون مناطق خارج القاهرة؟',
    answerEn: 'Yes, we serve all Egyptian governorates. We have a delivery and installation team that reaches anywhere.',
    answerAr: 'نعم، نخدم جميع محافظات مصر. لدينا فريق توصيل وتركيب يصل لأي مكان.',
  },
];

export default function FAQSection({ locale = 'en' }) {
  const [openIndex, setOpenIndex] = useState(null);
  const isRTL = locale === 'ar';

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-cream">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-6"></div>
          <h2 className="section-title">{isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h2>
          <p className="section-subtitle">{isRTL ? 'إجابات على أكثر الأسئلة شيوعاً' : 'Answers to the most common questions'}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                openIndex === index ? 'ring-2 ring-gold' : ''
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-deep-brown text-lg pr-4">
                  {isRTL ? faq.questionAr : faq.questionEn}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIndex === index ? 'bg-gold text-deep-brown rotate-180' : 'bg-beige text-deep-brown'
                }`}>
                  {openIndex === index ? <FaMinus className="w-4 h-4" /> : <FaPlus className="w-4 h-4" />}
                </div>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-0 text-warm-gray leading-relaxed border-t border-gray-100">
                    <p className="pt-4">
                      {isRTL ? faq.answerAr : faq.answerEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-warm-gray mb-4">
            {isRTL ? 'لم تجد إجابة سؤالك؟' : "Didn't find your answer?"}
          </p>
          <a
            href="https://wa.me/201020883895"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>💬</span>
            {isRTL ? 'تواصل معنا مباشرة' : 'Contact us directly'}
          </a>
        </div>
      </div>
    </section>
  );
}
