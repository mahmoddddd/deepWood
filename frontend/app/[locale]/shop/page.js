import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';
import translations from '@/locales/en/common.json';

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?status=active`, { next: { revalidate: 60 } });
    return res.ok ? (await res.json()).data : [];
  } catch { return []; }
}

export const metadata = {
  title: 'Shop | Deep Wood',
  description: 'Shop premium handcrafted furniture from Deep Wood.',
};

export default async function ShopPage() {
  const products = await getProducts();
  const t = translations;

  return (
    <>
      <section className="pt-32 pb-20 bg-deep-brown text-white">
        <div className="container-custom text-center">
          <div className="gold-line mx-auto mb-4"></div>
          <h1 className="text-5xl font-bold mb-4">{t.shop.title}</h1>
          <p className="text-xl text-beige">{t.shop.subtitle}</p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? products.map((product) => (
              <div key={product._id} className="card group">
                <Link href={`/en/shop/${product.slug}`}>
                  <div className="relative h-64 bg-beige overflow-hidden">
                    {product.image?.url && <Image src={product.image.url} alt={product.title_en} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />}
                    {product.featured && <span className="absolute top-4 left-4 bg-gold text-deep-brown px-2 py-1 text-xs font-medium rounded">Featured</span>}
                    {!product.inStock && <span className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 text-xs rounded">{t.shop.outOfStock}</span>}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/en/shop/${product.slug}`}>
                    <h3 className="text-lg font-semibold text-deep-brown mb-1 hover:text-gold transition-colors">{product.title_en}</h3>
                  </Link>
                  <p className="text-gold font-bold text-lg mb-3">{product.price.toLocaleString()} {t.common.egp}</p>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=I'm interested in: ${product.title_en} - ${product.price} EGP`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    <FaWhatsapp /> {t.shop.orderViaWhatsApp}
                  </a>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20">
                <p className="text-warm-gray text-lg">Products coming soon. Contact us for custom orders!</p>
                <Link href="/en/contact" className="btn-primary mt-4 inline-block">Contact Us</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
