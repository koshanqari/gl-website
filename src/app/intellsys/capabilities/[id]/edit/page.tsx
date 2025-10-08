'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export default function EditCapabilityPage() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    image_url: '',
    image_text: '',
    title: '',
    tag: '',
    description: '',
    features: [''],
    sort_order: 10
  });

  useEffect(() => {
    fetchCapability();
  }, []);

  const fetchCapability = async () => {
    try {
      const response = await fetch(`/api/intellsys/capabilities/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          image_url: data.image_url,
          image_text: data.image_text,
          title: data.title,
          tag: data.tag,
          description: data.description,
          features: data.features || [''],
          sort_order: data.sort_order
        });
      }
    } catch (error) {
      console.error('Error fetching capability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty features
      const cleanedFeatures = formData.features.filter(f => f.trim() !== '');

      const response = await fetch(`/api/intellsys/capabilities/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: cleanedFeatures
        }),
      });

      if (response.ok) {
        router.push('/intellsys/capabilities');
      } else {
        alert('Failed to update capability');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-display-small font-bold txt-clr-black">Edit Capability</h1>
          <p className="text-body-medium txt-clr-neutral mt-1">Update capability information</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-body-medium font-medium txt-clr-black mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Event Strategy & Conceptualization"
            />
          </div>

          {/* Tag */}
          <div>
            <label className="block text-body-medium font-medium txt-clr-black mb-2">
              Tag *
            </label>
            <input
              type="text"
              required
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Event Strategy"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-body-medium font-medium txt-clr-black mb-2">
              Sort Order *
            </label>
            <input
              type="number"
              required
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="10, 20, 30..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-body-medium font-medium txt-clr-black mb-2">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://..."
            />
          </div>

          {/* Image Text */}
          <div>
            <label className="block text-body-medium font-medium txt-clr-black mb-2">
              Image Text *
            </label>
            <input
              type="text"
              required
              value={formData.image_text}
              onChange={(e) => setFormData({ ...formData, image_text: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Short description that appears on image"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-body-medium font-medium txt-clr-black mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Detailed description of the capability..."
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-body-medium font-medium txt-clr-black mb-2">
              Features *
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 text-primary hover:underline text-body-small"
            >
              + Add Feature
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary txt-clr-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
