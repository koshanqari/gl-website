'use client';

import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-display-medium txt-clr-black mb-2">
            Admin Dashboard
          </h1>
          <p className="text-body-large txt-clr-neutral">
            Manage your website content from here
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Blogs Card */}
          <Link
            href="/intellsys/blogs"
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 border border-gray-200 group"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6 txt-clr-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  Manage Blogs
                </h2>
                <p className="text-gray-600 mb-4">
                  Create, edit, and manage blog posts. Set featured posts and organize by category.
                </p>
                <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                  Go to Blogs
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Work Card */}
          <Link
            href="/intellsys/our-work"
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 border border-gray-200 group"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6 txt-clr-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  Manage Work
                </h2>
                <p className="text-gray-600 mb-4">
                  Showcase your portfolio. Add projects, events, and highlight your best work.
                </p>
                <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                  Go to Portfolio
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Testimonials Card */}
          <Link
            href="/intellsys/testimonials"
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 border border-gray-200 group"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6 txt-clr-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  Manage Testimonials
                </h2>
                <p className="text-gray-600 mb-4">
                  Collect and showcase client feedback. Manage testimonials and reviews.
                </p>
                <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                  Go to Testimonials
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Contact Inquiries Card */}
          <Link
            href="/intellsys/contact-inquiries"
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 border border-gray-200 group"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6 txt-clr-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  Contact Inquiries
                </h2>
                <p className="text-gray-600 mb-4">
                  Manage customer inquiries and event requests from your contact form.
                </p>
                <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                  View Inquiries
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/intellsys/blogs/new"
              className="flex items-center px-4 py-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <svg className="w-5 h-5 txt-clr-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium text-gray-700">New Blog Post</span>
            </Link>

            <Link
              href="/intellsys/our-work/new"
              className="flex items-center px-4 py-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <svg className="w-5 h-5 txt-clr-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium text-gray-700">New Project</span>
            </Link>

            <Link
              href="/intellsys/testimonials/new"
              className="flex items-center px-4 py-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <svg className="w-5 h-5 txt-clr-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium text-gray-700">New Testimonial</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="font-medium text-gray-700">View Website</span>
            </Link>

            <a
              href="/blogs"
              target="_blank"
              className="flex items-center px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-medium text-gray-700">View Blogs</span>
            </a>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Getting Started</h4>
              <p className="text-sm text-blue-700">
                Use this dashboard to manage all your website content. Create engaging blog posts to share insights, 
                and showcase your best work in the portfolio section. All changes are saved to your database instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

