'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTAButton from '@/components/ui/CTAButton';
import { parseContent } from '@/lib/contentParser';

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
  content: string;
  featured: boolean;
}

export default function WorkDetailPage() {
  const params = useParams();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWork() {
      try {
        const response = await fetch(`/api/our-work/${params.id}`);
        if (!response.ok) {
          throw new Error('Work item not found');
        }
        const data = await response.json();
        setWork(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching work item:', error);
        setError('Project not found');
        setLoading(false);
      }
    }

    if (params.id) {
      fetchWork();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral">Loading project...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-display-medium mb-4">Project Not Found</h1>
            <p className="text-body-large mb-8">The project you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/our-work">
              <CTAButton variant="accent-primary" size="lg">
                Back to Our Work
              </CTAButton>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative secondary-section-bg py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 sm:mb-6">
              <span className="px-3 py-1 text-body-small font-semibold tag">
                {work.category}
              </span>
            </div>
            
            <h1 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-4 sm:mb-6 section-heading-onColor leading-tight">
              {work.title}
            </h1>
            
            <p className="text-body-medium sm:text-body-large mb-6 sm:mb-8 max-w-3xl mx-auto">
              {work.description}
            </p>
            
            {/* Project Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
              {work.client && (
                <div className="text-center">
                  <p className="text-body-small font-semibold txt-clr-white mb-1">Client</p>
                  <p className="text-body-medium txt-clr-white">{work.client}</p>
                </div>
              )}
              {work.attendees && (
                <div className="text-center">
                  <p className="text-body-small font-semibold txt-clr-white mb-1">Scale</p>
                  <p className="text-body-medium txt-clr-white">{work.attendees}</p>
                </div>
              )}
              {work.location && (
                <div className="text-center">
                  <p className="text-body-small font-semibold txt-clr-white mb-1">Location</p>
                  <p className="text-body-medium txt-clr-white">{work.location}</p>
                </div>
              )}
              {work.date && (
                <div className="text-center">
                  <p className="text-body-small font-semibold txt-clr-white mb-1">Date</p>
                  <p className="text-body-medium txt-clr-white">{work.date}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <Image
              src={work.image_url}
              alt={work.title}
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="(max-width: 1280px) 100vw, 1280px"
              quality={95}
            />
          </div>
        </div>
      </section>

      {/* Project Content */}
      {work.content && (
        <section className="py-8 sm:py-12 md:py-16 bg-clr-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              {parseContent(work.content)}
            </div>
          </div>
        </section>
      )}

      {/* Project Highlights */}
      {!work.content && (
        <section className="py-8 sm:py-12 md:py-16 bg-clr-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-headline-large sm:text-display-small mb-8 text-center section-heading-onwhite">
              Project Overview
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-body-large leading-relaxed">
                {work.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 footer-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium mb-4 sm:mb-6 section-heading-onColor">
            Ready to Create Your Next Event?
          </h2>
          <p className="text-body-large mb-8 sm:mb-10 max-w-2xl mx-auto">
            Let our team of experts help you create memorable experiences that drive results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link href="/contact">
              <CTAButton variant="accent-primary" size="lg">
                Get Started Today
              </CTAButton>
            </Link>
            <Link href="/our-work">
              <CTAButton variant="white-secondary" size="lg">
                View More Projects
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

