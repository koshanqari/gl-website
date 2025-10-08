'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Testimonial } from '@/lib/supabase';

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    company: '',
    content: '',
    image_url: '',
    rating: 5,
    sort_order: 0,
  });

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/intellsys/testimonials/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setTestimonial(data);
          setFormData({
            name: data.name,
            designation: data.designation,
            company: data.company,
            content: data.content,
            image_url: data.image_url || '',
            rating: data.rating,
            sort_order: data.sort_order || 0,
          });
        } else {
          alert('Testimonial not found');
          router.push('/intellsys/testimonials');
        }
      } catch (error) {
        console.error('Error fetching testimonial:', error);
        alert('Error fetching testimonial');
        router.push('/intellsys/testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const resolvedParams = await params;
      const response = await fetch(`/api/intellsys/testimonials/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/intellsys/testimonials');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert('Error updating testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading testimonial...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!testimonial) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <div className="text-lg txt-clr-black">Testimonial not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold txt-clr-black">Edit Testimonial</h1>
            <p className="text-sm txt-clr-black mt-1">
              Update testimonial details
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-clr-white p-6 rounded-lg border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium txt-clr-black mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter client name"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium txt-clr-black mb-2">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Marketing Director"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium txt-clr-black mb-2">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter company name"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium txt-clr-black mb-2">
                Rating
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium txt-clr-black mb-2">
                Sort Order
              </label>
              <input
                type="number"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first (e.g., 10, 20, 30)</p>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium txt-clr-black mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium txt-clr-black mb-2">
                Testimonial Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter the testimonial content..."
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary txt-clr-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
