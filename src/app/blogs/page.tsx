import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTAButton from '@/components/ui/CTAButton';
import { supabase } from '@/lib/supabase';
import BlogsClient from './BlogsClient';

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  date: string;
  read_time: string;
  author: string;
  top_featured: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// Set revalidation time
export const revalidate = 300; // Revalidate every 5 minutes

async function getBlogs() {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogsPage() {
  const allBlogs = await getBlogs();
  
  // Find top featured blog (only 1)
  const topFeaturedBlog = allBlogs.find((blog: Blog) => blog.top_featured) || null;
  
  // Find featured blogs (up to 6, excluding top featured)
  const featuredBlogs = allBlogs.filter((blog: Blog) => blog.featured && !blog.top_featured).slice(0, 6);
  
  // Extract unique categories from all blogs
  const categories = Array.from(new Set(allBlogs.map((blog: Blog) => blog.category))) as string[];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative primary-section-bg">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
            <div className="max-w-xl">
              <h1 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-4 sm:mb-6 md:mb-8 leading-tight section-heading section-heading-onColor">
                Insights, trends, and best practices in corporate event management
              </h1>
              <p className="text-body-medium sm:text-body-large leading-relaxed txt-clr-white text-center sm:text-left">
                Curated by the Golden Lotus team to help you stay ahead in the world of corporate events and experiential marketing.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto lg:min-h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1553484771-371a605b060b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Business Insights and Content"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
              priority
            />
          </div>
        </div>
      </section>

      {/* Top Featured Blog Section */}
      {topFeaturedBlog && (
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 section-heading section-heading-onwhite">
              Featured Article
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Featured Image */}
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto lg:min-h-[400px]">
              <Image
                src={topFeaturedBlog.image_url}
                alt={topFeaturedBlog.title}
                fill
                className="object-cover shadow-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
              />
            </div>

            {/* Featured Content */}
            <div className="flex flex-col justify-center space-y-4 sm:space-y-6 md:space-y-8">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-body-small font-semibold tag">
                  {topFeaturedBlog.category}
                </span>
                <span className="text-body-small content-date">
                  {topFeaturedBlog.date}
                </span>
              </div>
              
              <h3 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large leading-tight">
                {topFeaturedBlog.title}
              </h3>
              
              <p className="text-body-medium sm:text-body-large leading-relaxed text-center sm:text-left">
                {topFeaturedBlog.excerpt}
              </p>

              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-body-small font-semibold">
                    By {topFeaturedBlog.author} • {topFeaturedBlog.read_time}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href={`/blogs/${topFeaturedBlog.id}`}>
                  <CTAButton variant="accent-secondary" size="lg" className="w-full sm:w-auto">
                    Read Full Article
                  </CTAButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Client-side filtering and blog grid */}
      <BlogsClient allBlogs={allBlogs} featuredBlogs={featuredBlogs} categories={categories} />

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 px-4 section-heading section-heading-onColor">
            Ready to Plan Your Next Event?
          </h2>
          <p className="text-body-medium sm:text-body-large mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Let our team of experts help you create an unforgettable experience that exceeds expectations.
          </p>
          <Link href="/contact">
            <CTAButton
              variant="white-secondary"
              size="lg"
            >
              Contact Us
            </CTAButton>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
