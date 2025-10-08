'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ImageUpload from '@/components/admin/ImageUpload';

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capabilityTags, setCapabilityTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    read_time: '5 min read',
    author: 'Golden Lotus Team',
    top_featured: false,
    featured: false,
  });

  // Fetch capability tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/capabilities/tags');
        if (response.ok) {
          const tags = await response.json();
          setCapabilityTags(tags);
          // Set first tag as default if available
          if (tags.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: tags[0] }));
          }
        }
      } catch (error) {
        console.error('Error fetching capability tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/intellsys/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Blog created successfully!');
        router.push('/intellsys/blogs');
      } else {
        alert('Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-display-medium txt-clr-black">Add New Blog Post</h1>
          <p className="text-body-large txt-clr-neutral mt-2">
            Create a new blog post for your website
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-body-medium font-semibold txt-clr-black mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter blog title"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-body-medium font-semibold txt-clr-black mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Short description (2-3 sentences)"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-body-medium font-semibold txt-clr-black mb-2">
              Featured Image *
            </label>
            
            {/* Upload Component */}
            <ImageUpload
              currentUrl={formData.image_url}
              onUploadSuccess={(url) => setFormData({ ...formData, image_url: url })}
              folder="blogs"
              label="Upload Featured Image"
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
                {capabilityTags.length === 0 ? (
                  <option value="">Loading categories...</option>
                ) : (
                  capabilityTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-body-medium font-semibold txt-clr-black mb-2">
                Publish Date *
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

          {/* Author and Read Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author" className="block text-body-medium font-semibold txt-clr-black mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Author name"
              />
            </div>

            <div>
              <label htmlFor="read_time" className="block text-body-medium font-semibold txt-clr-black mb-2">
                Read Time *
              </label>
              <input
                type="text"
                id="read_time"
                name="read_time"
                value={formData.read_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="5 min read"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-body-medium font-semibold txt-clr-black mb-2">
              Content *
            </label>
            <MarkdownEditor
              value={formData.content}
              onChange={(newContent) => setFormData({ ...formData, content: newContent })}
              placeholder="Write your blog content here. Use the toolbar buttons above for formatting."
            />
          </div>

          {/* Featured Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="featured" className="text-body-medium txt-clr-black cursor-pointer">
                Featured Blog
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="top_featured"
                name="top_featured"
                checked={formData.top_featured}
                onChange={(e) => setFormData({ ...formData, top_featured: e.target.checked })}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="top_featured" className="text-body-medium txt-clr-black cursor-pointer">
                Top Featured (Homepage)
              </label>
            </div>
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
              {isSubmitting ? 'Creating...' : 'Create Blog Post'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

