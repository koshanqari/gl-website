'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTAButton from '@/components/ui/CTAButton';
import MultiStepContactForm from '@/components/MultiStepContactForm';

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-clr-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 h-[50vh] sm:h-[55vh] md:h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
            alt="Event Planning Hero"
            fill
            className="object-cover"
            sizes="100vw"
            quality={95}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-headline-large sm:text-display-small section-heading-onColor mb-4 sm:mb-6 px-4">
            Let&apos;s Plan Your Perfect Event
          </h1>
          <p className="text-body-small sm:text-body-medium txt-clr-white mb-6 sm:mb-8 max-w-3xl mx-auto px-4" style={{opacity: 0.9}}>
            Ready to create unforgettable experiences? Get in touch with our expert team and let&apos;s bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-clr-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            {/* Multi-Step Contact Form */}
            <MultiStepContactForm />
            
            
          </div>
        </div>
      </section>

      {/* FAQ Heading */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 primary-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large section-heading section-heading-onColor text-center">
            Frequently Asked Questions
          </h2>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 sm:py-12 md:py-16 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-body-medium sm:text-body-large max-w-2xl mx-auto px-4">
              Get answers to common questions about our event planning services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-headline-small topic-heading mb-4">
                How far in advance should I book?
              </h3>
              <p className="text-body-medium txt-clr-black">
                We recommend booking at least 3-6 months in advance for large events, though we can accommodate shorter timelines for smaller gatherings. Popular dates and venues book quickly, so early planning ensures the best options.
              </p>
            </div>

            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-headline-small topic-heading mb-4">
                What&apos;s included in your services?
              </h3>
              <p className="text-body-medium txt-clr-black">
                Our full-service approach includes venue selection, vendor coordination, design and décor, catering management, entertainment booking, day-of coordination, and post-event follow-up. We tailor our services to your specific needs.
              </p>
            </div>

            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-headline-small topic-heading mb-4">
                Do you work with any budget?
              </h3>
              <p className="text-body-medium txt-clr-black">
                Yes! We work with clients across all budget ranges, from intimate gatherings to large-scale corporate events. We&apos;ll help you maximize your budget while creating an unforgettable experience.
              </p>
            </div>

            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-headline-small topic-heading mb-4">
                Can you handle virtual events?
              </h3>
              <p className="text-body-medium txt-clr-black">
                Absolutely! We specialize in both in-person and virtual events, including hybrid experiences that combine both formats. Our team has extensive experience with virtual platforms and engagement strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline-medium sm:text-headline-large section-heading-onColor mb-4 sm:mb-6 px-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-body-small sm:text-body-medium mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Let&apos;s discuss your event vision and turn it into reality. Our team is ready to bring your ideas to life.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:flex sm:flex-row sm:justify-center px-4">
            <Link href="/blogs">
              <CTAButton 
                variant="white-secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Blogs
              </CTAButton>
            </Link>
            <Link href="/our-work">
              <CTAButton 
                variant="white-secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Works
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
