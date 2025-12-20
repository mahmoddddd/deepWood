import translations from '@/locales/en/common.json';

export const metadata = {
  title: 'About Us | Deep Wood',
  description: 'Learn about Deep Wood - Premium furniture and woodwork company in Egypt since 1990.',
};

export default function AboutPage() {
  const t = translations;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-deep-brown text-white">
        <div className="container-custom text-center">
          <div className="gold-line mx-auto mb-4"></div>
          <h1 className="text-5xl font-bold mb-4">{t.about.title}</h1>
          <p className="text-xl text-beige">{t.about.subtitle}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-deep-brown mb-6">Our Story</h2>
              <p className="text-warm-gray mb-4">{t.about.description}</p>
              <p className="text-warm-gray mb-4">Founded in 1990, Deep Wood has grown from a small workshop to one of Egypt's most respected furniture manufacturers. Our journey has been defined by our unwavering commitment to quality and our passion for wood craftsmanship.</p>
              <p className="text-warm-gray">Today, we serve both residential clients seeking unique pieces for their homes and corporate clients who trust us with their office environments.</p>
            </div>
            <div className="bg-beige h-96 rounded-lg flex items-center justify-center">
              <span className="text-6xl">🪵</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gold/20 rounded-full flex items-center justify-center"><span className="text-4xl">✨</span></div>
              <h3 className="text-xl font-semibold text-deep-brown mb-2">Quality</h3>
              <p className="text-warm-gray">We use only the finest materials and employ skilled craftsmen to ensure every piece meets our exacting standards.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gold/20 rounded-full flex items-center justify-center"><span className="text-4xl">🎨</span></div>
              <h3 className="text-xl font-semibold text-deep-brown mb-2">Craftsmanship</h3>
              <p className="text-warm-gray">Each piece is handcrafted with attention to detail, combining traditional techniques with modern design.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gold/20 rounded-full flex items-center justify-center"><span className="text-4xl">🤝</span></div>
              <h3 className="text-xl font-semibold text-deep-brown mb-2">Trust</h3>
              <p className="text-warm-gray">We build lasting relationships with our clients based on transparency, reliability, and exceptional service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 bg-beige">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">How We Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Consultation', desc: 'We discuss your vision and requirements' },
              { step: 2, title: 'Design', desc: 'Our team creates detailed designs' },
              { step: 3, title: 'Crafting', desc: 'Skilled artisans bring designs to life' },
              { step: 4, title: 'Delivery', desc: 'Professional installation and setup' },
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-lg text-center relative">
                <div className="w-12 h-12 bg-gold text-deep-brown rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-deep-brown mb-2">{item.title}</h3>
                <p className="text-warm-gray text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
