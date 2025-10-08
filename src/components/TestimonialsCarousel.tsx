'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Testimonial } from '@/lib/supabase';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentTestimonialIndex(Math.max(0, currentTestimonialIndex - 1))}
        disabled={currentTestimonialIndex === 0}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-clr-white hover:bg-gray-100 text-accent-dark p-2 sm:p-3 rounded-full shadow-xl border-2 border-gray-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentTestimonialIndex(Math.min(testimonials.length - (isMobile ? 2 : 3), currentTestimonialIndex + 1))}
        disabled={currentTestimonialIndex >= testimonials.length - (isMobile ? 2 : 3)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-clr-white hover:bg-gray-100 text-accent-dark p-2 sm:p-3 rounded-full shadow-xl border-2 border-gray-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Testimonials Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl">
          {testimonials.slice(currentTestimonialIndex, currentTestimonialIndex + (isMobile ? 2 : 3)).map((testimonial) => (
            <div key={testimonial.id} className="bg-clr-white p-4 sm:p-5 md:p-6 shadow-lg">
              <div className="text-center">
                {testimonial.image_url && (
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mx-auto mb-2 sm:mb-3">
                    <Image
                      src={testimonial.image_url}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                      quality={95}
                    />
                  </div>
                )}
                <h4 className="text-sm sm:text-base font-semibold txt-clr-black mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                  {testimonial.designation}
                </p>
                <p className="text-xs sm:text-sm txt-clr-neutral mb-2 sm:mb-3">
                  {testimonial.company}
                </p>
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm sm:text-lg ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <blockquote className="text-xs sm:text-sm txt-clr-black leading-relaxed italic text-center">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.max(1, testimonials.length - (isMobile ? 1 : 2)) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonialIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentTestimonialIndex ? 'bg-clr-white' : 'bg-clr-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

