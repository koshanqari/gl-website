import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTAButton from '@/components/ui/CTAButton';
import { Testimonial } from '@/lib/types';
import { query } from '@/lib/db';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

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

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  date: string;
  author: string;
  read_time: string;
  top_featured: boolean;
  featured: boolean;
}

// Set revalidation time
export const revalidate = 300; // Revalidate every 5 minutes

async function getFeaturedWorks() {
  try {
    const { query } = await import('@/lib/db');
    const result = await query(
      'SELECT * FROM work WHERE featured = true ORDER BY created_at DESC LIMIT 3'
    );
    return result.rows || [];
  } catch (error) {
    console.error('Error fetching featured works:', error);
    return [];
  }
}

async function getTopFeaturedBlog() {
  try {
    const result = await query(
      'SELECT * FROM blogs WHERE top_featured = true ORDER BY created_at DESC LIMIT 1'
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching top featured blog:', error);
    return null;
  }
}

async function getTestimonials() {
  try {
    const { query } = await import('@/lib/db');
    const result = await query('SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC');
    return result.rows && result.rows.length > 0 ? result.rows : getStaticTestimonials();
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return getStaticTestimonials();
  }
}

function getStaticTestimonials(): Testimonial[] {
  return [
    {
      id: 1,
      name: "Sarah Johnson",
      designation: "VP Marketing",
      company: "TechCorp International",
      content: "Golden Lotus transformed our annual conference into an unforgettable experience. Their attention to detail and innovative approach exceeded all our expectations.",
      image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      featured: false,
      sort_order: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Michael Chen",
      designation: "CEO",
      company: "Luxury Auto Group",
      content: "The product launch event they orchestrated was flawless. Every element was perfectly executed, from the venue setup to the guest experience.",
      image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      featured: false,
      sort_order: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      name: "Priya Sharma",
      designation: "Head of Events",
      company: "Global Finance Ltd",
      content: "Professional, creative, and reliable. Golden Lotus delivered our leadership retreat with exceptional quality and seamless execution.",
      image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      featured: false,
      sort_order: 30,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      name: "David Thompson",
      designation: "VP Operations",
      company: "StartupHub",
      content: "Golden Lotus made our corporate retreat seamless and engaging. Their team handled every detail perfectly, allowing us to focus on our business.",
      image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      featured: false,
      sort_order: 40,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
      name: "Lisa Wang",
      designation: "Head of Marketing",
      company: "GrowthTech",
      content: "The creativity and professionalism of Golden Lotus is unmatched. They turned our brand activation into a memorable experience for all attendees.",
      image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      featured: false,
      sort_order: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 6,
      name: "James Wilson",
      designation: "Founder",
      company: "NextGen Ventures",
      content: "Golden Lotus delivered beyond our expectations. Their strategic approach and flawless execution made our investor event a huge success.",
      image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      featured: false,
      sort_order: 60,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 7,
      name: "Emma Rodriguez",
      designation: "Event Manager",
      company: "Global Enterprises",
      content: "Working with Golden Lotus was a game-changer. They understood our vision and brought it to life with exceptional execution and creativity.",
      image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      featured: false,
      sort_order: 70,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 8,
      name: "Alex Kumar",
      designation: "Marketing Director",
      company: "TechStart Inc",
      content: "The team's professionalism and attention to detail made our product launch a huge success. Highly recommended!",
      image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      featured: false,
      sort_order: 80,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
}

export default async function HomePage() {
  const [featuredWorks, featuredBlog, testimonials] = await Promise.all([
    getFeaturedWorks(),
    getTopFeaturedBlog(),
    getTestimonials()
  ]);

  const services = [
    {
      title: "Event Strategy & Conceptualization",
      description: "Strategic planning and creative conceptualization that transforms your vision into memorable experiences.",
      image: "https://golden-lotus-prod.b-cdn.net/homepage/what-we-do1.webp?optimizer=image&width=1920&quality=85",
      features: ["Strategic event planning", "Theme development", "Target audience analysis"]
    },
    {
      title: "Corporate Event Management",
      description: "End-to-end management of corporate events, conferences, and business gatherings with precision and excellence.",
      image: "https://golden-lotus-prod.b-cdn.net/homepage/what-we-do2.webp?optimizer=image&width=1920&quality=85",
      features: ["Conference management", "Team building events", "Executive retreats"]
    }
  ];

  const metrics = [
    { number: "500+", label: "Events Delivered", description: "Successful corporate events and conferences" },
    { number: "50+", label: "Fortune 500 Clients", description: "Leading companies trust our expertise" },
    { number: "98%", label: "Client Satisfaction", description: "Consistently exceeding expectations" },
    { number: "15+", label: "Years Experience", description: "Proven track record in event management" }
  ];


  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar transparent />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center">
        {/* Background Image - Using Next.js Image for optimization */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://golden-lotus-prod.b-cdn.net/homepage/hero1.webp"
            alt="Golden Lotus Events - Plan Your Next Event"
            fill
            priority
            quality={85}
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-headline-large sm:text-display-large lg:text-display-large txt-clr-white mb-4 sm:mb-6 drop-shadow-lg leading-tight">
              Step into the Golden Experience
            </h1>
            <p className="text-body-medium sm:text-body-large txt-clr-white mb-6 sm:mb-8 drop-shadow-md">
              Corporate events designed with precision & elegance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/contact">
                <CTAButton variant="white-primary" size="md" className="sm:size-lg">
                  Plan My Event
                </CTAButton>
              </Link>
              <Link href="/about-us">
                <CTAButton variant="white-secondary" size="md" className="sm:size-lg">
                  About Us
                </CTAButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos Strip - Continuous Scroll (image-based, easy to update) */}
      <section className="pt-6 sm:pt-8 md:pt-12 lg:pt-16 pb-2 sm:pb-3 md:pb-4 bg-clr-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(() => {
            const clientLogos: string[] = [
              // Update these URLs to add/remove client logos
              'https://golden-lotus-prod.b-cdn.net/homepage/clientlogos/tatamotors.png',
              'https://golden-lotus-prod.b-cdn.net/homepage/clientlogos/meta.png',
              'https://golden-lotus-prod.b-cdn.net/homepage/clientlogos/aditya.webp',

            ]

            return (
              <div className="relative">
                {/* Track: duplicate content for seamless marquee */}
                <div className="flex animate-scroll">
                  {/* set 1 */}
                  <div className="flex items-center gap-8 sm:gap-10 md:gap-12 lg:gap-16 flex-shrink-0 pr-8 sm:pr-10 md:pr-12 lg:pr-16">
                    {clientLogos.map((src, idx) => (
                      <div key={`logos-1-${idx}`} className="flex items-center justify-center p-2 sm:p-3 md:p-4 rounded-lg min-w-[96px] sm:min-w-[120px]">
                        <img src={src} alt="Client logo" className="h-8 sm:h-10 md:h-12 w-auto object-contain" />
                      </div>
                    ))}
                  </div>
                  {/* set 2 (duplicate) */}
                  <div className="flex items-center gap-8 sm:gap-10 md:gap-12 lg:gap-16 flex-shrink-0">
                    {clientLogos.map((src, idx) => (
                      <div key={`logos-2-${idx}`} className="flex items-center justify-center p-2 sm:p-3 md:p-4 rounded-lg min-w-[96px] sm:min-w-[120px]">
                        <img src={src} alt="Client logo" className="h-8 sm:h-10 md:h-12 w-auto object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </section>



      {/* Client Stories Section */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 section-heading section-heading-onwhite">
              Client Stories
            </h2>
            <p className="text-body-small sm:text-body-medium md:text-body-large mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              Discover how we&apos;ve transformed corporate events for leading organizations across industries.
            </p>
          </div>

          {/* Featured Work Cards */}
          {featuredWorks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {featuredWorks.map((work) => (
                <article key={work.id} className="bg-clr-white border border-gray-200 shadow-lg group hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                  <div className="relative h-[180px] sm:h-[200px] md:h-[250px] lg:h-[280px] overflow-hidden">
                    <Image
                      src={work.image_url}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={95}
                    />
                  </div>

                  <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col flex-grow">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3 md:mb-4">
                      <span className="px-2 py-1 text-xs sm:text-body-small font-semibold tag">
                        {work.category}
                      </span>
                      <span className="text-xs sm:text-body-small content-date">
                        {work.date}
                      </span>
                    </div>

                    <h3 className="text-body-medium sm:text-body-large md:text-headline-small mb-2 sm:mb-3 md:mb-4 leading-tight topic-heading">
                      {work.title}
                    </h3>

                    <p className="text-body-small sm:text-body-medium leading-relaxed mb-3 sm:mb-4 md:mb-6 line-clamp-3">
                      {work.description}
                    </p>

                    <div className="mt-auto grid grid-cols-2 gap-4 items-end">
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-body-small">
                        {work.client && <div><span className="font-semibold">Client:</span> {work.client}</div>}
                        {work.attendees && <div><span className="font-semibold">Scale:</span> {work.attendees}</div>}
                        {work.location && <div><span className="font-semibold">Location:</span> {work.location}</div>}
                      </div>
                      
                      <div className="flex justify-end">
                        <Link href={`/our-work/${work.id}`}>
                          <button type="button" className="px-4 sm:px-6 py-2 text-xs sm:text-body-medium
    cta-btn-accent-secondary
    font-semibold
    transition-all
    duration-300
    ease-in-out
    cursor-pointer">
                            View Project
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-body-medium">No featured work available at the moment.</p>
            </div>
          )}

          {/* CTAs after cards */}
          <div className="text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:flex sm:flex-row sm:justify-center">
              <Link href="/our-work">
                <CTAButton variant="accent-primary" size="md" className="w-full sm:w-auto">
                  Our Works
                </CTAButton>
              </Link>
              <Link href="/capabilities">
                <CTAButton variant="accent-secondary" size="md" className="w-full sm:w-auto">
                  Our Services
                </CTAButton>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Services Section 1: Event Strategy */}
      <section className="bg-clr-primary-dark">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Left */}
          <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-auto lg:min-h-[360px] xl:min-h-[576px] order-2 lg:order-1">
            <Image
              src={services[0].image}
              alt={services[0].title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
            />
          </div>

          {/* Content Right */}
          <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14 order-1 lg:order-2">
            <div className="max-w-xl space-y-3 sm:space-y-4 md:space-y-5">
              <h3 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large section-heading section-heading-accent leading-tight">
                {services[0].title}
              </h3>
              <p className="text-body-small sm:text-body-medium md:text-body-large txt-clr-white leading-relaxed">
                {services[0].description}
              </p>
              <ul className="space-y-2 sm:space-y-3 pt-2 list-disc pl-5 marker:text-accent">
                {services[0].features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-body-small sm:text-body-medium txt-clr-white">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section 2: Corporate Event Management */}
      <section className="bg-clr-primary-dark">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Content Left */}
          <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14">
            <div className="max-w-xl space-y-3 sm:space-y-4 md:space-y-5">
              <h3 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large section-heading section-heading-accent leading-tight">
                {services[1].title}
              </h3>
              <p className="text-body-small sm:text-body-medium md:text-body-large txt-clr-white leading-relaxed">
                {services[1].description}
              </p>
              <ul className="space-y-2 sm:space-y-3 pt-2 list-disc pl-5 marker:text-accent">
                {services[1].features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-body-small sm:text-body-medium txt-clr-white">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image Right */}
          <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-auto lg:min-h-[360px] xl:min-h-[576px]">
            <Image
              src={services[1].image}
              alt={services[1].title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
            />
          </div>
        </div>
      </section>

      {/* Services Section CTA */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 bg-clr-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:flex sm:flex-row sm:justify-center">
              <Link href="/capabilities">
                <CTAButton variant="accent-primary" size="md" className="w-full sm:w-auto">
                  Our Capabilities
                </CTAButton>
              </Link>
              <Link href="/our-work">
                <CTAButton variant="accent-secondary" size="md" className="w-full sm:w-auto">
                  Client Stories
                </CTAButton>
              </Link>
            </div>
          </div>
        </div>
      </section>


       {/* Why Choose Us Section: The Golden Difference */}
       <section className="py-12 sm:py-16 bg-clr-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Section Header */}
           <div className="text-center mb-6 sm:mb-10 md:mb-12">
             <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large section-heading section-heading-onwhite mb-3 sm:mb-4 md:mb-6">
             The Golden Difference
             </h2>
             <p className="text-body-small sm:text-body-medium md:text-body-large max-w-3xl mx-auto">
               The Golden Lotus difference: Where expertise meets excellence in every detail.
             </p>
           </div>

           {/* Reason 1: Experience & Expertise - Image Left */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 sm:mb-10 md:mb-12">
             {/* Image */}
             <div className="lg:col-span-1 order-1">
               <div className="relative h-[220px] sm:h-[360px] md:h-[460px] lg:h-[550px] overflow-hidden">
                 <Image
                   src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
                   alt="Experience & Expertise"
                   fill
                   className="object-cover"
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                   quality={95}
                 />
                 <div className="absolute inset-0 bg-black/40 flex items-end">
                   <div className="p-3 sm:p-6">
                     <h3 className="text-headline-small sm:text-display-small mb-1 sm:mb-2 txt-clr-white">
                       15+ Years of Excellence
                     </h3>
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Content */}
             <div className="lg:col-span-1 order-2">
               <div className="bg-clr-white shadow-lg p-3 sm:p-6 md:p-8 h-auto lg:h-[550px] flex flex-col text-left">
                 <h3 className="text-headline-small sm:text-display-small topic-heading mb-2 sm:mb-4">
                   Proven Track Record
                 </h3>
                 <p className="text-body-small sm:text-body-medium md:text-body-large mb-3 sm:mb-6">
                   With over a decade of experience, we&apos;ve perfected the art of creating unforgettable events that exceed expectations.
                 </p>
                 <ul className="space-y-2 sm:space-y-3 mb-3 sm:mb-6 flex-grow list-disc pl-5 marker:text-primary">
                   <li className="text-body-small sm:text-body-medium">500+ successful events delivered</li>
                   <li className="text-body-small sm:text-body-medium">50+ Fortune 500 clients trust us</li>
                   <li className="text-body-small sm:text-body-medium">98% client satisfaction rate</li>
                   <li className="text-body-small sm:text-body-medium">Award-winning event design</li>
                 </ul>
               </div>
             </div>
           </div>

           {/* Reason 2: End-to-End Solutions - Image Right */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 sm:mb-10 md:mb-12">
             {/* Image */}
             <div className="lg:col-span-1 order-1 lg:order-2">
               <div className="relative h-[220px] sm:h-[360px] md:h-[460px] lg:h-[550px] overflow-hidden">
                 <Image
                   src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
                   alt="End-to-End Solutions"
                   fill
                   className="object-cover"
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                   quality={95}
                 />
                 <div className="absolute inset-0 bg-black/40 flex items-end">
                   <div className="p-3 sm:p-6">
                     <h3 className="text-headline-small sm:text-display-small mb-1 sm:mb-2 txt-clr-white">
                       Comprehensive Solutions
                     </h3>
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Content */}
             <div className="lg:col-span-1 order-2 lg:order-1">
               <div className="bg-clr-white shadow-lg p-3 sm:p-6 md:p-8 h-auto lg:h-[550px] flex flex-col text-left">
                 <h3 className="text-headline-small sm:text-display-small topic-heading mb-2 sm:mb-4">
                   End-to-End Event Management
                 </h3>
                 <p className="text-body-small sm:text-body-medium md:text-body-large mb-3 sm:mb-6">
                   From concept to execution, we handle every detail so you can focus on what matters most.
                 </p>
                 <ul className="space-y-2 sm:space-y-3 mb-3 sm:mb-6 flex-grow list-disc pl-5 marker:text-primary">
                   <li className="text-body-small sm:text-body-medium">Strategic planning & creative conceptualization</li>
                   <li className="text-body-small sm:text-body-medium">Venue selection & logistics management</li>
                   <li className="text-body-small sm:text-body-medium">On-site coordination & technical support</li>
                   <li className="text-body-small sm:text-body-medium">Post-event analysis & reporting</li>
                 </ul>
               </div>
             </div>
           </div>
         </div>
       </section>

      {/* Our Impact Section */}
      <section className="relative py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
        <div className="absolute inset-0">
          <Image
            src="https://golden-lotus-prod.b-cdn.net/homepage/our-impact.webp?optimizer=image&width=2400&quality=85"
            alt="Our Impact"
            fill
            className="object-cover"
            sizes="100vw"
            quality={95}
          />
        </div>
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--overlay-primary)' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 section-heading section-heading-onColor">
            Our Impact
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <div className="text-center border-t border-white/50 pt-2 sm:pt-3 md:pt-4 lg:pt-6">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium txt-clr-white mb-1 sm:mb-2 md:mb-3">
                500+
              </div>
              <div className="text-xs sm:text-body-small md:text-body-medium lg:text-body-large txt-clr-white px-1">
                Events Delivered
              </div>
            </div>

            <div className="text-center border-t border-white/50 pt-2 sm:pt-3 md:pt-4 lg:pt-6">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium txt-clr-white mb-1 sm:mb-2 md:mb-3">
                50+
              </div>
              <div className="text-xs sm:text-body-small md:text-body-medium lg:text-body-large txt-clr-white px-1">
                Fortune 500 Clients
              </div>
            </div>

            <div className="text-center border-t border-white/50 pt-2 sm:pt-3 md:pt-4 lg:pt-6">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium txt-clr-white mb-1 sm:mb-2 md:mb-3">
                98%
              </div>
              <div className="text-xs sm:text-body-small md:text-body-medium lg:text-body-large txt-clr-white px-1">
                Client Satisfaction
              </div>
            </div>

            <div className="text-center border-t border-white/50 pt-2 sm:pt-3 md:pt-4 lg:pt-6">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium txt-clr-white mb-1 sm:mb-2 md:mb-3">
                15+
              </div>
              <div className="text-xs sm:text-body-small md:text-body-medium lg:text-body-large txt-clr-white px-1">
                Years Experience
              </div>
            </div>

            <div className="text-center border-t border-white/50 pt-2 sm:pt-3 md:pt-4 lg:pt-6">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium txt-clr-white mb-1 sm:mb-2 md:mb-3">
                25+
              </div>
              <div className="text-xs sm:text-body-small md:text-body-medium lg:text-body-large txt-clr-white px-1">
                Countries Served
              </div>
            </div>

            <div className="text-center border-t border-white/50 pt-2 sm:pt-3 md:pt-4 lg:pt-6">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium txt-clr-white mb-1 sm:mb-2 md:mb-3">
                1000+
              </div>
              <div className="text-xs sm:text-body-small md:text-body-medium lg:text-body-large txt-clr-white px-1">
                Team Members
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Blog */}
      <section className="relative primary-section-bg">
        {featuredBlog ? (
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Content */}
            <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 order-2 lg:order-1">
              <div className="max-w-xl space-y-3 sm:space-y-4 md:space-y-5">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="px-2 py-1 text-xs sm:text-body-small font-semibold bg-accent txt-clr-white">
                    {featuredBlog.category}
                  </span>
                  <span className="text-xs sm:text-body-small txt-clr-white">
                    {featuredBlog.read_time}
                  </span>
                </div>

                <h3 className="text-headline-large sm:text-headline-large md:text-display-small section-heading section-heading-onColor leading-tight">
                  {featuredBlog.title}
                </h3>

                <p className="text-body-small sm:text-body-medium md:text-body-large txt-clr-white leading-relaxed">
                  {featuredBlog.excerpt}
                </p>

                <div className="flex items-center space-x-2 text-xs sm:text-body-small txt-clr-white">
                  <span>By {featuredBlog.author}</span>
                  <span>•</span>
                  <span>{featuredBlog.date}</span>
                </div>

                <div className="pt-3 sm:pt-4 grid grid-cols-2 gap-3 sm:gap-4 sm:flex sm:flex-row sm:justify-start">
                  <Link href={`/blogs/${featuredBlog.id}`}>
                    <CTAButton variant="white-primary" size="md" className="w-full sm:w-auto">
                      Read Article
                    </CTAButton>
                  </Link>
                  <Link href="/blogs">
                    <CTAButton variant="white-secondary" size="md" className="w-full sm:w-auto">
                      Our Blogs
                    </CTAButton>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-auto lg:min-h-[560px] order-1 lg:order-2">
              <Image
                src={featuredBlog.image_url}
                alt={featuredBlog.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Fallback Content */}
            <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
              <div className="max-w-xl space-y-4 sm:space-y-6 md:space-y-8 text-center sm:text-left mx-auto sm:mx-0">
                <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large leading-tight section-heading section-heading-onColor">
                  Mission & Vision
                </h2>
                <p className="text-body-small sm:text-body-medium md:text-body-large txt-clr-white leading-relaxed">
                  We combine the talent, technology and creative power of our agency to connect brands, institutions and associations with their audiences in the digital age.
                </p>
              </div>
            </div>
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-auto lg:min-h-[560px]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
                alt="Our Team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
              />
            </div>
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 section-heading section-heading-onwhite">
              Client Testimonials
            </h2>
            <p className="text-body-small sm:text-body-medium md:text-body-large max-w-3xl mx-auto px-4">
              Hear from our satisfied clients about their experience working with Golden Lotus.
            </p>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <TestimonialsCarousel testimonials={testimonials} />
      </section>

      {/* CTA Section */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 px-4 section-heading section-heading-onColor">
            Ready to Elevate Your Next Event?
          </h2>
          <p className="text-body-small sm:text-body-medium md:text-body-large mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Let our team of experts help you create an unforgettable experience that exceeds expectations and delivers measurable results.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:flex sm:flex-row sm:justify-center">
            <Link href="/contact">
              <CTAButton variant="white-secondary" size="md" className="w-full sm:w-auto">
                Get Started
              </CTAButton>
            </Link>
            <Link href="/about-us">
              <CTAButton variant="accent-secondary" size="md" className="w-full sm:w-auto">
                About Us
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}