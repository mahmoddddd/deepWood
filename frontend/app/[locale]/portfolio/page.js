import Link from 'next/link';
import Image from 'next/image';
import enTranslations from '@/locales/en/common.json';
import arTranslations from '@/locales/ar/common.json';

const allTranslations = { en: enTranslations, ar: arTranslations };

async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?status=active`, { next: { revalidate: 60 } });
    return res.ok ? (await res.json()).data : [];
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  return {
    title: params.locale === 'ar' ? 'أعمالنا | ديب وود' : 'Portfolio | Deep Wood',
    description: params.locale === 'ar' ? 'استكشف مشاريعنا المميزة في الأثاث والأعمال الخشبية.' : 'Explore our portfolio of premium furniture and woodwork projects.',
  };
}

export default async function PortfolioPage({ params }) {
  const locale = params.locale || 'en';
  const t = allTranslations[locale] || allTranslations.en;
  const isRTL = locale === 'ar';
  const projects = await getProjects();

  return (
    <>
      <section className="pt-32 pb-20 bg-deep-brown text-white">
        <div className="container-custom text-center">
          <div className="gold-line mx-auto mb-4"></div>
          <h1 className="text-5xl font-bold mb-4">{t.portfolio.title}</h1>
          <p className="text-xl text-beige">{t.portfolio.subtitle}</p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? projects.map((project) => (
              <Link key={project._id} href={`/${locale}/portfolio/${project.slug}`} className="card group">
                <div className="relative h-64 bg-beige overflow-hidden">
                  {project.image?.url && <Image src={project.image.url} alt={isRTL ? project.title_ar : project.title_en} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />}
                  {project.isCorporate && <span className="absolute top-4 left-4 bg-gold text-deep-brown px-3 py-1 text-sm font-medium rounded">{isRTL ? 'مؤسسي' : 'Corporate'}</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-deep-brown mb-2">{isRTL ? project.title_ar : project.title_en}</h3>
                  <p className="text-warm-gray line-clamp-2">{isRTL ? project.shortDescription_ar || project.description_ar?.slice(0, 100) : project.shortDescription_en || project.description_en?.slice(0, 100)}</p>
                </div>
              </Link>
            )) : (
              <div className="col-span-3 text-center py-20">
                <p className="text-warm-gray text-lg">{isRTL ? 'المشاريع ستكون متاحة قريباً. ترقبوا!' : 'Projects will be available soon. Stay tuned!'}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
