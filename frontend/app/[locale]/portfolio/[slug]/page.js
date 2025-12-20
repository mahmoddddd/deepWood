import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getProject(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()).data;
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title_en} | Deep Wood`,
    description: project.shortDescription_en || project.description_en?.slice(0, 160),
  };
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <>
      <section className="pt-32 pb-20 bg-deep-brown text-white">
        <div className="container-custom">
          <Link href="/en/portfolio" className="text-gold hover:underline mb-4 inline-block">← Back to Portfolio</Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title_en}</h1>
          {project.client && <p className="text-beige text-lg">Client: {project.client.name_en}</p>}
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {project.image?.url && (
                <div className="relative h-96 rounded-lg overflow-hidden mb-8">
                  <Image src={project.image.url} alt={project.title_en} fill className="object-cover" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-deep-brown mb-4">About This Project</h2>
              <p className="text-warm-gray whitespace-pre-line">{project.description_en}</p>

              {project.gallery?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-deep-brown mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="relative h-40 rounded-lg overflow-hidden bg-beige">
                        {img.url && <Image src={img.url} alt={`Gallery ${i + 1}`} fill className="object-cover" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
                <h3 className="text-xl font-bold text-deep-brown mb-4">Project Details</h3>
                <dl className="space-y-3">
                  {project.projectType && <><dt className="text-sm text-warm-gray">Type</dt><dd className="font-medium text-deep-brown capitalize">{project.projectType}</dd></>}
                  {project.location_en && <><dt className="text-sm text-warm-gray">Location</dt><dd className="font-medium text-deep-brown">{project.location_en}</dd></>}
                  {project.completionDate && <><dt className="text-sm text-warm-gray">Completed</dt><dd className="font-medium text-deep-brown">{new Date(project.completionDate).getFullYear()}</dd></>}
                </dl>
                <hr className="my-6" />
                <Link href="/en/contact" className="btn-gold w-full block text-center">Request Similar Project</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
