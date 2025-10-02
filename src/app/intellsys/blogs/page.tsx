'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  date: string;
  author: string;
  top_featured: boolean;
  featured: boolean;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'author'>('date');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/intellsys/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    setDeleteId(id);
    try {
      const response = await fetch(`/api/intellsys/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== id));
        alert('Blog deleted successfully!');
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleTopFeatured = async (id: number) => {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    const newValue = !blog.top_featured;

    // Warn if setting a new top featured when one already exists
    if (newValue) {
      const existingTopFeatured = blogs.find(b => b.top_featured && b.id !== id);
      if (existingTopFeatured) {
        if (!confirm(`Blog "${existingTopFeatured.title}" is currently TOP Featured. Replace it with "${blog.title}"?`)) {
          return;
        }
      }
    }

    try {
      const response = await fetch(`/api/intellsys/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...blog, top_featured: newValue }),
      });

      if (response.ok) {
        // Update local state
        setBlogs(blogs.map(b => ({
          ...b,
          top_featured: b.id === id ? newValue : (newValue ? false : b.top_featured)
        })));
        alert(newValue ? 'Set as TOP Featured!' : 'Removed from TOP Featured');
      } else {
        alert('Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Error updating blog');
    }
  };

  const handleToggleFeatured = async (id: number) => {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    const newValue = !blog.featured;

    // Warn if trying to feature more than 6
    if (newValue) {
      const featuredCount = blogs.filter(b => b.featured && b.id !== id).length;
      if (featuredCount >= 6) {
        alert('You already have 6 featured posts. Please unfeature one first.');
        return;
      }
    }

    try {
      const response = await fetch(`/api/intellsys/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...blog, featured: newValue }),
      });

      if (response.ok) {
        // Update local state
        setBlogs(blogs.map(b => b.id === id ? { ...b, featured: newValue } : b));
        alert(newValue ? 'Added to Featured!' : 'Removed from Featured');
      } else {
        alert('Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Error updating blog');
    }
  };

  // Get unique categories for filter
  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category)))];

  // Filter and sort blogs
  const filteredAndSortedBlogs = blogs
    .filter(blog => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = filterCategory === 'All' || blog.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'author') {
        return a.author.localeCompare(b.author);
      }
      return 0;
    });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral">Loading blogs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-display-medium txt-clr-black">Manage Blogs</h1>
            <p className="text-body-large txt-clr-neutral mt-2">
              {filteredAndSortedBlogs.length} of {blogs.length} blog post{blogs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/intellsys/blogs/new"
            className="bg-primary txt-clr-white px-6 py-3 rounded font-semibold hover:bg-primary-dark transition-colors inline-flex items-center"
          >
            Add New Blog
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <label htmlFor="search" className="block text-body-small font-semibold txt-clr-black mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title, author, or excerpt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category-filter" className="block text-body-small font-semibold txt-clr-black mb-2">
                Filter by Category
              </label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sort-by" className="block text-body-small font-semibold txt-clr-black mb-2">
                Sort By
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'author')}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="date">Date (Newest First)</option>
                <option value="title">Title (A-Z)</option>
                <option value="author">Author (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 flex items-center gap-6 text-body-small txt-clr-neutral">
            <span>TOP Featured: {blogs.filter(b => b.top_featured).length}/1</span>
            <span>Featured: {blogs.filter(b => b.featured).length}/6</span>
            <span>Regular: {blogs.filter(b => !b.top_featured && !b.featured).length}</span>
          </div>
        </div>

        {/* Blogs Table */}
        {blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-body-large txt-clr-neutral mb-4">No blogs found</p>
            <Link
              href="/intellsys/blogs/new"
              className="text-primary hover:underline"
            >
              Create your first blog post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-body-medium font-semibold txt-clr-black">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-body-medium font-semibold txt-clr-black">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-body-medium font-semibold txt-clr-black">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-body-medium font-semibold txt-clr-black">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-body-medium font-semibold txt-clr-black">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-body-medium font-semibold txt-clr-black">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-left text-body-medium font-semibold txt-clr-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-16 rounded overflow-hidden">
                          <Image
                            src={blog.image_url}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="font-semibold txt-clr-black">{blog.title}</div>
                          <div className="text-body-small txt-clr-neutral truncate">
                            {blog.excerpt}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-body-small bg-primary/10 txt-clr-primary rounded">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-body-medium txt-clr-neutral">
                        {blog.author}
                      </td>
                      <td className="px-6 py-4 text-body-medium txt-clr-neutral">
                        {blog.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleToggleTopFeatured(blog.id)}
                            className={`px-2 py-1 text-body-small rounded font-semibold transition-colors ${
                              blog.top_featured
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {blog.top_featured ? 'TOP Featured' : 'Set as TOP'}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(blog.id)}
                            className={`px-2 py-1 text-body-small rounded transition-colors ${
                              blog.featured
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {blog.featured ? 'Featured' : 'Set Featured'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/intellsys/blogs/${blog.id}/edit`}
                            className="px-3 py-1 text-body-small bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            disabled={deleteId === blog.id}
                            className="px-3 py-1 text-body-small bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            {deleteId === blog.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

