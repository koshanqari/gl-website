import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
// Removed supabase import - now using PostgreSQL

interface Work {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  date: string;
  client: string;
  attendees: string;
  location: string;
  featured: boolean;
}

// Set revalidation time
export const revalidate = 300; // Revalidate every 5 minutes

async function getWorks() {
  try {
    const { query } = await import('@/lib/db');
    const result = await query('SELECT * FROM work ORDER BY created_at DESC');
    return result.rows || [];
  } catch (error) {
    console.error('Error fetching work:', error);
    return [];
  }
}

export default async function OurWorkPage() {
  const allWorks = await getWorks();
  
  // Separate featured (max 3) and regular works
  const featuredWorks = allWorks.filter((work: Work) => work.featured).slice(0, 3);
  const regularWorks = allWorks.filter((work: Work) => !work.featured);

  return (
    <div className="min-h-screen bg-clr-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative primary-section-bg">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
            <div className="max-w-xl">
              <h1 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-4 sm:mb-6 md:mb-8 leading-tight">
                Our Portfolio of Exceptional Events
              </h1>
              <p className="text-body-medium sm:text-body-large leading-relaxed">
                Explore our showcase of successful corporate events, product launches, conferences, and experiential marketing campaigns that have delivered measurable impact for leading brands.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto lg:min-h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
              alt="Our Work Portfolio"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Projects Section Heading */}
      {featuredWorks.length > 0 && (
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 secondary-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large text-center section-heading-onColor">
            Featured Projects
          </h2>
        </div>
      </section>
      )}

      {/* Featured Projects - Alternating Layout (like Our Core Values) */}
      {featuredWorks.map((work: Work, index: number) => {
        const isOdd = index % 2 === 1;
        
        return (
          <section key={work.id} className="bg-clr-white">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image - Even (0,2): Left, Odd (1): Right */}
              <div className={`relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-auto lg:min-h-[400px] xl:min-h-[500px] ${
                isOdd ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
              }`}>
                <Image
                  src={work.image_url}
                  alt={work.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={95}
                />
              </div>

              {/* Content - Even (0,2): Right, Odd (1): Left */}
              <div className={`flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-14 ${
                isOdd ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
              }`}>
                <div className="max-w-xl space-y-3 sm:space-y-4 md:space-y-5">
                  <div>
                    <span className="px-3 py-1 text-body-small font-semibold tag rounded">
                      {work.category}
                    </span>
                  </div>
                  <h3 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large topic-heading leading-tight">
                    {work.title}
                  </h3>
                  <p className="text-body-medium sm:text-body-large leading-relaxed">
                    {work.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {work.client && (
                      <div>
                        <p className="text-body-small font-semibold">Client</p>
                        <p className="text-body-medium">{work.client}</p>
                      </div>
                    )}
                    {work.attendees && (
                      <div>
                        <p className="text-body-small font-semibold">Scale</p>
                        <p className="text-body-medium">{work.attendees}</p>
                      </div>
                    )}
                    {work.location && (
                      <div>
                        <p className="text-body-small font-semibold">Location</p>
                        <p className="text-body-medium">{work.location}</p>
                      </div>
                    )}
                    {work.date && (
                      <div>
                        <p className="text-body-small font-semibold">Date</p>
                        <p className="text-body-medium">{work.date}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* All Projects Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 section-heading-onwhite">
              {featuredWorks.length > 0 ? 'More Projects' : 'Our Projects'}
            </h2>
            <p className="text-body-medium sm:text-body-large max-w-3xl mx-auto px-4">
              Delivering excellence across conferences, product launches, corporate events, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {regularWorks.map((work: Work) => (
              <article key={work.id} className="bg-clr-white border border-gray-200 shadow-lg group hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-[200px] sm:h-[250px] md:h-[280px] overflow-hidden">
                  <Image
                    src={work.image_url}
                    alt={work.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={95}
                  />
                </div>
                
                <div className="p-5 sm:p-6 md:p-8">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <span className="px-2 py-1 text-body-small font-semibold tag">
                      {work.category}
                    </span>
                    <span className="text-body-small">
                      {work.date}
                    </span>
                  </div>
                  
                  <h3 className="text-body-large sm:text-headline-small mb-3 sm:mb-4 leading-tight topic-heading">
                    {work.title}
                  </h3>
                  
                  <p className="text-body-small sm:text-body-medium leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                    {work.description}
                  </p>
                  
                  <div className="space-y-2 text-body-small">
                    {work.client && <div><span className="font-semibold">Client:</span> {work.client}</div>}
                    {work.attendees && <div><span className="font-semibold">Scale:</span> {work.attendees}</div>}
                    {work.location && <div><span className="font-semibold">Location:</span> {work.location}</div>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 px-4 section-heading-onColor">
            Ready to Create Your Next Event?
          </h2>
          <p className="text-body-medium sm:text-body-large mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Let our team of experts help you create an unforgettable experience that exceeds expectations.
          </p>
          <a href="/contact">
            <button type="button" className="px-8 py-4 text-lg
    cta-btn-white-secondary
    font-semibold
    transition-all
    duration-300
    ease-in-out
    cursor-pointer">
              Contact Us
            </button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

