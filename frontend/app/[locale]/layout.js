import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import LoadingScreen from '@/components/LoadingScreen';
import Providers from '@/components/Providers';
import enTranslations from '@/locales/en/common.json';
import arTranslations from '@/locales/ar/common.json';

const translations = {
  en: enTranslations,
  ar: arTranslations,
};

export async function generateMetadata({ params }) {
  const locale = params.locale;
  const t = translations[locale] || translations.en;
  return {
    title: locale === 'ar' ? 'ديب وود | أثاث فاخر وأعمال خشبية' : 'Deep Wood | Premium Furniture & Woodwork',
    description: locale === 'ar'
      ? 'ديب وود - شركة أثاث فاخر وأعمال خشبية في مصر. نصنع التميز منذ 1990.'
      : 'Deep Wood - Premium furniture and woodwork company in Egypt. Crafting excellence since 1990.',
  };
}

export default function LocaleLayout({ children, params }) {
  const locale = params.locale || 'en';
  const t = translations[locale] || translations.en;
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={isRTL ? 'font-cairo' : 'font-inter'}>
        <Providers locale={locale}>
          <LoadingScreen />
          <Header locale={locale} translations={t} />
          <main className="min-h-screen">{children}</main>
          <Footer locale={locale} translations={t} />
          <FloatingWhatsApp locale={locale} />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
