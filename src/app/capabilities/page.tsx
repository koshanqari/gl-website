import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CTAButton from '@/components/ui/CTAButton'
import { query } from '@/lib/db'

interface Capability {
  id: number;
  image_url: string;
  image_text: string;
  title: string;
  tag: string;
  description: string;
  features: string[];
  sort_order: number;
}

// Set revalidation time
export const revalidate = 300; // Revalidate every 5 minutes

async function getCapabilities() {
  try {
    const result = await query(
      'SELECT * FROM capabilities ORDER BY sort_order ASC'
    );
    return result.rows as Capability[];
  } catch (error) {
    console.error('Error fetching capabilities:', error);
    return [];
  }
}

export default async function CapabilitiesPage() {
  const capabilities = await getCapabilities();

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
            alt="Event Management Capabilities"
            fill
            className="object-cover"
            sizes="100vw"
            quality={95}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="section-heading section-heading-onColor mb-3 sm:mb-4 sm:mb-6">
              Our Capabilities
            </h1>
            <p className="text-body-small sm:text-body-medium sm:text-body-large mb-8 drop-shadow-md txt-clr-white">
              Comprehensive event solutions designed to deliver exceptional experiences and measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-12 sm:py-16 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-10 md:mb-12">
            <p className="text-body-small sm:text-body-medium sm:text-body-large max-w-3xl mx-auto">
              Comprehensive event management services designed to deliver exceptional experiences and measurable results.
            </p>
          </div>

          {/* Dynamic Capabilities from Database */}
          {capabilities.map((capability, index) => {
            // Alternate layout: even indices (0,2,4) = image left, odd indices (1,3,5) = image right
            const isImageRight = index % 2 === 1;
            
            return (
              <div key={capability.id} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 sm:mb-10 md:mb-12">
                {/* Image */}
                <div className={`lg:col-span-1 ${isImageRight ? 'order-1 lg:order-2' : 'order-1'}`}>
                  <div className="relative h-[220px] sm:h-[360px] md:h-[460px] lg:h-[550px] overflow-hidden">
                    <Image
                      src={capability.image_url}
                      alt={capability.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      quality={95}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end">
                      <div className="p-3 sm:p-6">
                        <h3 className="text-headline-small sm:text-display-small mb-1 sm:mb-2 txt-clr-white">
                          {capability.image_text}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className={`lg:col-span-1 ${isImageRight ? 'order-2 lg:order-1' : 'order-2'}`}>
                  <div className="bg-clr-white shadow-lg p-3 sm:p-6 md:p-8 h-auto lg:h-[550px] flex flex-col text-left">
                    <div className="mb-2 sm:mb-4">
                      <span className="tag">
                        {capability.tag}
                      </span>
                    </div>
                    <h3 className="text-headline-small sm:text-display-small topic-heading mb-2 sm:mb-4">
                      {capability.title}
                    </h3>
                    <p className="text-body-small sm:text-body-medium sm:text-body-large mb-3 sm:mb-6">
                      {capability.description}
                    </p>
                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-6 flex-grow">
                      {capability.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start justify-start">
                          <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                          <span className="text-body-small sm:text-body-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium section-heading-onColor mb-3 sm:mb-4 sm:mb-6">
            Ready to Plan Your Next Event?
          </h2>
          <p className="text-body-small sm:text-body-medium mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how we can bring your vision to life with our comprehensive event management capabilities.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:flex sm:flex-row sm:justify-center">
            <CTAButton variant="white-primary" size="lg" className="w-full sm:w-auto">
              Get Started
            </CTAButton>
            <CTAButton variant="white-secondary" size="lg" className="w-full sm:w-auto">
              Portfolio
            </CTAButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}