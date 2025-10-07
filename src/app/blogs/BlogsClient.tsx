'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CTAButton from '@/components/ui/CTAButton';

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

interface BlogsClientProps {
  allBlogs: Blog[];
  featuredBlogs: Blog[];
  categories: string[];
}

export default function BlogsClient({ allBlogs, featuredBlogs, categories }: BlogsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('Featured');

  const filteredBlogs = selectedCategory === 'All' 
    ? allBlogs
    : selectedCategory === 'Featured'
    ? featuredBlogs
    : allBlogs.filter(blog => blog.category === selectedCategory);

  // Sort blogs for better user experience
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (selectedCategory === 'Featured') {
      // In featured view, show top_featured first, then regular featured
      if (a.top_featured && !b.top_featured) return -1;
      if (!a.top_featured && b.top_featured) return 1;
    }
    // Then sort by date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <>
      {/* Categories Filter */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 secondary-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large mb-3 sm:mb-4 md:mb-6 section-heading section-heading-onColor">
              Browse by Category
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {/* Featured button first */}
            {featuredBlogs.length > 0 && (
              <button
                onClick={() => setSelectedCategory('Featured')}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-body-small sm:text-body-medium font-semibold transition-colors duration-200 ${
                  selectedCategory === 'Featured'
                    ? 'tag'
                    : 'bg-transparent border border-white/50 hover:bg-clr-white/10'
                }`}
              >
                Featured
              </button>
            )}
            
            {/* Category buttons from database */}
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-body-small sm:text-body-medium font-semibold transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'tag'
                    : 'bg-transparent border border-white/50 hover:bg-clr-white/10'
                }`}
              >
                {category}
              </button>
            ))}
            
            {/* All button last */}
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 sm:px-6 py-2 sm:py-3 text-body-small sm:text-body-medium font-semibold transition-colors duration-200 ${
                selectedCategory === 'All'
                  ? 'tag'
                  : 'bg-transparent border border-white/50 hover:bg-clr-white/10'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <p className="text-body-medium sm:text-body-large max-w-3xl mx-auto px-4">
              Stay updated with the latest insights and trends in corporate event management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {sortedBlogs.map((blog) => (
              <article key={blog.id} className="bg-clr-white border border-gray-200 shadow-lg group hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                <div className="relative h-[200px] sm:h-[250px] md:h-[280px] overflow-hidden">
                  <Image
                    src={blog.image_url}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={95}
                  />
                </div>
                
                <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <span className="px-2 py-1 text-body-small font-semibold tag">
                      {blog.category}
                    </span>
                    <span className="text-body-small content-date">
                      {blog.date}
                    </span>
                  </div>
                  
                  <h3 className="text-body-large sm:text-headline-small mb-3 sm:mb-4 leading-tight transition-colors duration-200 topic-heading">
                    {blog.title}
                  </h3>
                  
                  <p className="text-body-small sm:text-body-medium leading-relaxed mb-4 sm:mb-6 flex-grow">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-body-small content-date">
                      {blog.read_time}
                    </span>
                    <Link href={`/blogs/${blog.id}`}>
                      <CTAButton variant="accent-secondary" size="sm">
                        Read More
                      </CTAButton>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

