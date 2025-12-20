import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';

async function getProduct(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()).data;
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.title_en} | Deep Wood Shop`,
    description: product.shortDescription_en || product.description_en?.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <>
      <section className="pt-32 pb-8 bg-deep-brown">
        <div className="container-custom">
          <Link href="/en/shop" className="text-gold hover:underline">← Back to Shop</Link>
        </div>
      </section>

      <section className="py-12 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative h-96 bg-beige rounded-lg overflow-hidden mb-4">
                {product.image?.url && <Image src={product.image.url} alt={product.title_en} fill className="object-cover" />}
              </div>
              {product.gallery?.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.gallery.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative h-20 bg-beige rounded overflow-hidden">
                      {img.url && <Image src={img.url} alt={`${product.title_en} ${i + 1}`} fill className="object-cover" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4">{product.title_en}</h1>
              <p className="text-3xl font-bold text-gold mb-6">{product.price.toLocaleString()} EGP</p>

              <p className="text-warm-gray mb-6 whitespace-pre-line">{product.description_en}</p>

              {product.specifications?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-deep-brown mb-2">Specifications</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {product.specifications.map((spec, i) => (
                      <div key={i}><dt className="text-warm-gray">{spec.key_en}</dt><dd className="font-medium">{spec.value_en}</dd></div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=I'm interested in: ${product.title_en} (${product.slug}) - Price: ${product.price} EGP`}
                  target="_blank"
                  className="flex items-center justify-center gap-3 bg-green-500 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp size={24} /> Order via WhatsApp
                </a>
                <Link href="/en/contact" className="btn-secondary text-center">Request Custom Quote</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
