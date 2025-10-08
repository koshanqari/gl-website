'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Testimonial } from '@/lib/types';

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/intellsys/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/intellsys/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id));
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial');
    }
  };


  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading testimonials...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold txt-clr-black">Testimonials</h1>
            <p className="text-sm txt-clr-black mt-1">
              Manage client testimonials and reviews
            </p>
          </div>
          <button
            onClick={() => router.push('/intellsys/testimonials/new')}
            className="px-4 py-2 bg-primary txt-clr-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Add New Testimonial
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-clr-white p-4 rounded-lg border">
            <div className="text-2xl font-bold txt-clr-black">{testimonials.length}</div>
            <div className="text-sm txt-clr-black">Total Testimonials</div>
          </div>
          <div className="bg-clr-white p-4 rounded-lg border">
            <div className="text-2xl font-bold txt-clr-black">{testimonials.filter(t => t.rating === 5).length}</div>
            <div className="text-sm txt-clr-black">5-Star Reviews</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-clr-white p-4 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Testimonials Table */}
        <div className="bg-clr-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-clr-neutral-light">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium txt-clr-black">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium txt-clr-black">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium txt-clr-black">Content</th>
                  <th className="px-4 py-3 text-left text-sm font-medium txt-clr-black">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-medium txt-clr-black">Sort</th>
                  <th className="px-4 py-3 text-left text-sm font-medium txt-clr-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {testimonial.image_url && (
                          <img
                            src={testimonial.image_url}
                            alt={testimonial.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium txt-clr-black">{testimonial.name}</div>
                          <div className="text-sm txt-clr-black">{testimonial.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm txt-clr-black">{testimonial.company}</td>
                    <td className="px-4 py-3 text-sm txt-clr-black max-w-xs truncate">
                      {testimonial.content}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm txt-clr-black">{testimonial.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/intellsys/testimonials/${testimonial.id}/edit`)}
                          className="px-3 py-1 bg-blue-500 txt-clr-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="px-3 py-1 bg-red-500 txt-clr-white rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-8 txt-clr-black">
            No testimonials found matching your criteria.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
