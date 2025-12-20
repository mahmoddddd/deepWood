import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import translations from '@/locales/en/common.json';

export const metadata = {
  title: 'Deep Wood | Premium Furniture & Woodwork',
  description: 'Deep Wood - Premium furniture and woodwork company in Egypt. Crafting excellence since 1990.',
};

export default function EnglishLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className="font-inter">
        <Header locale="en" translations={translations} />
        <main className="min-h-screen">{children}</main>
        <Footer locale="en" translations={translations} />
      </body>
    </html>
  );
}
