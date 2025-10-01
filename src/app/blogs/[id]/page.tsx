'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTAButton from '@/components/ui/CTAButton';
import { parseContent } from '@/lib/contentParser';

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  date: string;
  read_time: string;
  author: string;
  content: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) {
          throw new Error('Blog not found');
        }
        const data = await response.json();
        setBlog(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Blog not found');
        setLoading(false);
      }
    }

    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-display-medium mb-4 txt-clr-black">Article Not Found</h1>
            <p className="text-body-large mb-8 txt-clr-neutral">The article you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/blogs">
              <CTAButton variant="golden-primary" size="lg">
                Back to Blogs
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
      <section className="relative bg-clr-secondary-medium py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 sm:mb-6">
              <span className="px-3 py-1 text-body-small font-semibold bg-clr-primary-dark txt-clr-white">
                {blog.category}
              </span>
            </div>
            
            <h1 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-4 sm:mb-6 txt-clr-white leading-tight">
              {blog.title}
            </h1>
            
            <p className="text-body-medium sm:text-body-large mb-6 sm:mb-8 txt-clr-primary max-w-3xl mx-auto">
              {blog.excerpt}
            </p>
            
            <div className="flex items-center justify-center space-x-6">
              <p className="text-body-small font-semibold txt-clr-white">
                By {blog.author}
              </p>
              <span className="txt-clr-white">•</span>
              <p className="text-body-small txt-clr-primary">
                {blog.read_time}
              </p>
              <span className="txt-clr-white">•</span>
              <p className="text-body-small txt-clr-primary">
                {blog.date}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <Image
              src={blog.image_url}
              alt={blog.title}
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="(max-width: 1024px) 100vw, 1024px"
              quality={95}
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 sm:py-12 md:py-16 bg-clr-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {parseContent(blog.content)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-clr-secondary-medium">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium mb-4 sm:mb-6 txt-clr-white">
            Ready to Plan Your Next Event?
          </h2>
          <p className="text-body-large mb-8 sm:mb-10 txt-clr-primary max-w-2xl mx-auto">
            Let our team of experts help you create memorable experiences that drive results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link href="/contact">
              <CTAButton variant="golden-primary" size="lg">
                Get Started Today
              </CTAButton>
            </Link>
            <Link href="/blogs">
              <CTAButton variant="white-secondary" size="lg">
                Read More Articles
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
