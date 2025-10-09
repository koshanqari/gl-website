'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ImageUpload from '@/components/admin/ImageUpload';

export default function NewOurWorkPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image_url: '',
    category: 'Conference',
    date: new Date().toISOString().split('T')[0],
    client: '',
    attendees: '',
    location: '',
    featured: false,
  });

  const categories = [
    'Conference',
    'Product Launch',
    'Corporate Event',
    'Gala Event',
    'Team Offsite',
    'Award Ceremony',
    'Exhibition',
    'Virtual Event',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/intellsys/our-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Project created successfully!');
        router.push('/intellsys/our-work');
      } else {
        alert('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-display-medium txt-clr-black">Add New Project</h1>
          <p className="text-body-large txt-clr-neutral mt-2">
            Add a new project to your portfolio
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-body-medium font-semibold txt-clr-black mb-2">
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Tech Summit 2024"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-body-medium font-semibold txt-clr-black mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Brief description of the project"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-body-medium font-semibold txt-clr-black mb-2">
              Project Image *
            </label>
            
            {/* Upload Component */}
            <ImageUpload
              currentUrl={formData.image_url}
              onUploadSuccess={(url) => setFormData({ ...formData, image_url: url })}
              folder="work"
              label="Upload Project Image"
            />
            
            {/* OR separator */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            
            {/* URL Input */}
            <div>
              <label htmlFor="image_url" className="block text-body-small font-medium txt-clr-neutral mb-2">
                Or paste image URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          {/* Category and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-body-medium font-semibold txt-clr-black mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-body-medium font-semibold txt-clr-black mb-2">
                Event Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Client and Attendees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="client" className="block text-body-medium font-semibold txt-clr-black mb-2">
                Client Name
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., TechCorp Inc."
              />
            </div>

            <div>
              <label htmlFor="attendees" className="block text-body-medium font-semibold txt-clr-black mb-2">
                Number of Attendees
              </label>
              <input
                type="text"
                id="attendees"
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 500+ Attendees"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-body-medium font-semibold txt-clr-black mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Mumbai, India"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-body-medium font-semibold txt-clr-black mb-2">
              Project Details (Optional)
            </label>
            <p className="text-body-small txt-clr-neutral mb-2">
              Add detailed information about the project that will be displayed on the individual project page.
            </p>
            <MarkdownEditor
              value={formData.content}
              onChange={(newContent) => setFormData({ ...formData, content: newContent })}
              placeholder="Write detailed project information here. Use the toolbar buttons above for formatting."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded font-semibold txt-clr-black hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary txt-clr-white rounded font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

