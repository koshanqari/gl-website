'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTAButton from '@/components/ui/CTAButton';

export default function AboutUsPage() {
  const stats = [
    { number: '15+', label: 'Years of Experience' },
    { number: '500+', label: 'Events Delivered' },
    { number: '200+', label: 'Happy Clients' },
    { number: '50+', label: 'Team Members' },
    { number: '₹100Cr+', label: 'Events Managed' },
    { number: '10+', label: 'Cities Served' },
  ];


  const team = [
    {
      name: 'Rajesh Sharma',
      position: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
      bio: 'With 20+ years in event management, Rajesh founded Golden Lotus to redefine corporate events in India.'
    },
    {
      name: 'Priya Patel',
      position: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
      bio: 'Priya brings innovative design thinking and creative excellence to every event we produce.'
    },
    {
      name: 'Amit Kumar',
      position: 'Operations Head',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
      bio: 'Amit ensures seamless execution with his expertise in logistics and vendor management.'
    },
    {
      name: 'Sneha Reddy',
      position: 'Client Relations Manager',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
      bio: 'Sneha builds lasting relationships and ensures every client receives personalized attention.'
    },
  ];

  return (
    <div className="min-h-screen bg-bg-clr-primary-medium">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-clr-secondary-medium">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
            <div className="max-w-xl">
              <h1 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 leading-tight txt-clr-white">
                We are human-first event experts helping brands create lasting impact
              </h1>
              <p className="text-body-medium sm:text-body-large leading-relaxed txt-clr-white">
                India&apos;s leading MICE and experiential marketing agency, delivering events with measurable impact.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto lg:min-h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
              alt="Golden Lotus Events"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
              priority
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-clr-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium mb-4 sm:mb-6 md:mb-8 txt-clr-primary text-center">
            About Golden Lotus
          </h2>
          
          <p className="text-body-medium sm:text-body-large txt-clr-neutral mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed">
            In our fifteen plus years, we&apos;ve sought new ways to define what it means to connect. This mindset has seen us grow from a boutique event management company into India&apos;s leading MICE and experiential marketing agency, specializing in corporate events, strategic communications, and brand activations.
          </p>

          {/* Section with Text and Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="flex flex-col justify-center">
              <p className="text-body-medium sm:text-body-large txt-clr-neutral leading-relaxed">
                Today, the way the world connects is evolving rapidly. Innovation in technology and data has given rise to new opportunities in event management. This new era means we will see a massive transformation in the way people work, collaborate and consume, and how organizations create, innovate and sell.
              </p>
            </div>
            <div className="relative h-[250px] sm:h-[300px] md:h-[360px]">
              <Image
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center&auto=format&q=80"
                alt="Event Planning"
                fill
                className="object-cover shadow-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={95}
              />
            </div>
          </div>

          {/* Section with Image and Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="relative h-[250px] sm:h-[300px] md:h-[360px] order-2 md:order-1">
              <Image
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center&auto=format&q=80"
                alt="Corporate Events"
                fill
                className="object-cover shadow-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={95}
              />
            </div>
            <div className="flex flex-col justify-center gap-4 sm:gap-6 md:gap-8 order-1 md:order-2">
              <p className="text-body-medium sm:text-body-large txt-clr-neutral leading-relaxed">
                Organizations have adapted their event strategies, marketing approaches, and engagement models. In response, Golden Lotus combines its strengths and capabilities to help clients navigate change and achieve positive outcomes.
              </p>
              <p className="text-body-medium sm:text-body-large txt-clr-neutral leading-relaxed">
                Together as strategists, storytellers, creatives, and consultants, we help brands and organizations to remain influential and future-fit in an increasingly unpredictable world.
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <p className="text-body-medium sm:text-body-large txt-clr-neutral leading-relaxed">
              We enable our clients to shape tomorrow by integrating strategy, creativity, and technology to deliver solutions that connect people, shift perceptions, and drive transformation.
            </p>
            <p className="text-body-medium sm:text-body-large txt-clr-neutral leading-relaxed">
              Our approach is human-centric and consistent – leveraging imagination and innovation to help clients grow and remain relevant.
            </p>
          </div>
        </div>
      </section>

      {/* Event Photo */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1558008258-3256797b43f3?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
          alt="Our Events"
          fill
          className="object-cover"
          sizes="100vw"
          quality={95}
        />
      </section>

      {/* Global Impact / Stats Section */}
      <section className="relative py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
            alt="Global Impact"
            fill
            className="object-cover"
            sizes="100vw"
            quality={95}
          />
        </div>
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--overlay-blue-dark)' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large txt-clr-white text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            Our Impact
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center border-t border-white/50 pt-3 sm:pt-4 md:pt-6"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium txt-clr-white mb-1 sm:mb-2 md:mb-3">
                  {stat.number}
                </div>
                <div className="text-body-small sm:text-body-medium md:text-body-large txt-clr-white px-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-neutral-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start">
            {/* Image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
                  alt="Rajesh Sharma"
                  fill
                  className="object-cover shadow-lg"
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
                  quality={95}
                />
              </div>
            </div>

            {/* Quote */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="relative">
                {/* Quotation marks */}
                <div className="text-6xl sm:text-7xl md:text-8xl txt-clr-primary font-serif leading-none mb-2">
                  &ldquo;
                </div>
                
                <blockquote className="text-body-medium sm:text-body-large md:text-headline-small txt-clr-black leading-relaxed -mt-6 sm:-mt-8 md:-mt-10">
                  <span className="inline">Our work is about bringing our clients&apos; </span>
                  <span className="bg-clr-primary-dark txt-clr-white px-2 py-1 inline-block">
                    brand voices to their audiences in a way that builds lasting memories, and sparks transformation,
                  </span>
                  <span className="inline"> but we do this work with care, warmth and respect&rdquo;</span>
                </blockquote>
              </div>
              
              <div className="mt-6 sm:mt-8 space-y-0.5">
                <p className="text-body-medium sm:text-body-large font-semibold txt-clr-black">
                  Rajesh Sharma
                </p>
                <p className="text-body-small sm:text-body-medium txt-clr-neutral">
                  Founder & CEO
                </p>
                <p className="text-body-small sm:text-body-medium font-semibold text-neutral-dark">
                  Golden Lotus Events
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Leadership Team */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 txt-clr-primary">
              Meet Our Team
            </h2>
            <p className="text-body-medium sm:text-body-large txt-clr-neutral max-w-3xl mx-auto px-4">
              The passionate professionals behind every successful event.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto mb-3 sm:mb-4 md:mb-6 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
                    quality={95}
                  />
                </div>
                <h3 className="text-body-large sm:text-headline-small txt-clr-primary mb-1 sm:mb-2">
                  {member.name}
                </h3>
                <p className="text-body-small sm:text-body-medium txt-clr-black font-semibold mb-2 sm:mb-3 md:mb-4">
                  {member.position}
                </p>
                <p className="text-body-small sm:text-body-medium txt-clr-neutral leading-relaxed px-2">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values Hero */}
      <section className="relative bg-clr-secondary-medium">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
            <div className="max-w-xl space-y-6 sm:space-y-8">
              <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large txt-clr-white leading-tight">
                Mission & Vision
              </h2>
              <p className="text-body-medium sm:text-body-large txt-clr-white leading-relaxed">
                We combine the talent, technology and creative power of our agency to connect brands, institutions and associations with their audiences in the digital age.
              </p>
              <p className="text-body-medium sm:text-body-large txt-clr-white leading-relaxed">
                We act as a bridge for transformation and growth, designing creative and strategic solutions executed with operational excellence.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto lg:min-h-[560px]">
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
      </section>

      {/* Our Core Values Heading */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-clr-neutral-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large txt-clr-white text-center">
            Our Core Values
          </h2>
        </div>
      </section>

      {/* Values Section 1: People First */}
      <section className="bg-clr-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Left */}
          <div className="relative h-[180px] sm:h-[240px] md:h-[300px] lg:h-auto lg:min-h-[360px] xl:min-h-[576px] order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
              alt="People First"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
            />
          </div>

          {/* Content Right */}
          <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-14 order-1 lg:order-2">
            <div className="max-w-xl space-y-3 sm:space-y-4 md:space-y-5">
              <h3 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large txt-clr-primary leading-tight">
                People First
              </h3>
              <p className="text-body-medium sm:text-body-large txt-clr-black leading-relaxed">
                Be yourself – diverse perspectives help us thrive.
              </p>
              <p className="text-body-medium sm:text-body-large txt-clr-black leading-relaxed">
                We nurture our people, supporting one another with care, respect, and warmth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section 2: Winning Together */}
      <section className="bg-clr-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Content Left */}
          <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-14">
            <div className="max-w-xl space-y-3 sm:space-y-4 md:space-y-5">
              <h3 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large txt-clr-primary leading-tight">
                Winning Together
              </h3>
              <p className="text-body-medium sm:text-body-large txt-clr-black leading-relaxed">
                When we unite around a shared goal, we are unstoppable.
              </p>
              <p className="text-body-medium sm:text-body-large txt-clr-black leading-relaxed">
                We act as a bridge for our talents, customers, and partners – empowering each to thrive.
              </p>
            </div>
          </div>

          {/* Image Right */}
          <div className="relative h-[180px] sm:h-[240px] md:h-[300px] lg:h-auto lg:min-h-[360px] xl:min-h-[576px]">
            <Image
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
              alt="Winning Together"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
            />
          </div>
        </div>
      </section>

      {/* Values Section 3: Growth Mindset */}
      <section className="bg-clr-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Left */}
          <div className="relative h-[180px] sm:h-[240px] md:h-[300px] lg:h-auto lg:min-h-[360px] xl:min-h-[576px] order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
              alt="Growth Mindset"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
            />
          </div>

          {/* Content Right */}
          <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-14 order-1 lg:order-2">
            <div className="max-w-xl space-y-3 sm:space-y-4 md:space-y-5">
              <h3 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large txt-clr-primary leading-tight">
                Growth Mindset
              </h3>
              <p className="text-body-medium sm:text-body-large txt-clr-black leading-relaxed">
                Curiosity and ambition fuel our growth and drive our success.
              </p>
              <p className="text-body-medium sm:text-body-large txt-clr-black leading-relaxed">
                We stay ahead of the curve by embracing new ideas and championing innovative ways of working.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section 4: Delivering Results */}
      <section className="bg-clr-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Content Left */}
          <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-14">
            <div className="max-w-xl space-y-3 sm:space-y-4 md:space-y-5">
              <h3 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large txt-clr-primary leading-tight">
                Delivering Results
              </h3>
              <p className="text-body-medium sm:text-body-large txt-clr-black leading-relaxed">
                Our relentless pursuit of progress leads to positive change.
              </p>
              <p className="text-body-medium sm:text-body-large txt-clr-black leading-relaxed">
                We actively share the insight, knowledge, and experience we have acquired over the last 15+ years.
              </p>
            </div>
          </div>

          {/* Image Right */}
          <div className="relative h-[180px] sm:h-[240px] md:h-[300px] lg:h-auto lg:min-h-[360px] xl:min-h-[576px]">
            <Image
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
              alt="Delivering Results"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 txt-clr-white bg-clr-secondary-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 px-4 txt-clr-white">
            Let&apos;s Create Something Extraordinary Together
          </h2>
          <p className="text-body-medium sm:text-body-large txt-clr-white mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Partner with us to transform your event vision into an unforgettable reality.
          </p>
          <CTAButton
            variant="white-secondary"
            size="lg"
          >
            Plan Your Event
          </CTAButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
