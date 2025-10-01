'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';

interface Work {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  date: string;
  client: string;
  attendees: string;
  location: string;
  featured: boolean;
}

export default function AdminOurWorkPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'client'>('date');

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/intellsys/our-work');
      const data = await response.json();
      setWorks(data);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this work item?')) return;

    setDeleteId(id);
    try {
      const response = await fetch(`/api/intellsys/our-work/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWorks(works.filter(work => work.id !== id));
        alert('Work deleted successfully!');
      } else {
        alert('Failed to delete work');
      }
    } catch (error) {
      console.error('Error deleting work:', error);
      alert('Error deleting work');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    const work = works.find(w => w.id === id);
    if (!work) return;

    const newValue = !work.featured;

    // Warn if trying to feature more than 3
    if (newValue) {
      const featuredCount = works.filter(w => w.featured && w.id !== id).length;
      if (featuredCount >= 3) {
        alert('You already have 3 featured projects. Please unfeature one first.');
        return;
      }
    }

    try {
      const response = await fetch(`/api/intellsys/our-work/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...work, featured: newValue }),
      });

      if (response.ok) {
        setWorks(works.map(w => w.id === id ? { ...w, featured: newValue } : w));
        alert(newValue ? 'Added to Featured!' : 'Removed from Featured');
      } else {
        alert('Failed to update work');
      }
    } catch (error) {
      console.error('Error updating work:', error);
      alert('Error updating work');
    }
  };

  // Get unique categories for filter
  const categories = ['All', ...Array.from(new Set(works.map(w => w.category)))];

  // Filter and sort works
  const filteredAndSortedWorks = works
    .filter(work => {
      const matchesSearch = searchQuery === '' || 
        work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (work.client && work.client.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = filterCategory === 'All' || work.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'client') {
        return (a.client || '').localeCompare(b.client || '');
      }
      return 0;
    });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral">Loading projects...</p>
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
            <h1 className="text-display-medium txt-clr-black">Manage Work</h1>
            <p className="text-body-large txt-clr-neutral mt-2">
              {filteredAndSortedWorks.length} of {works.length} project{works.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/admin/our-work/new"
            className="bg-primary txt-clr-white px-6 py-3 rounded font-semibold hover:bg-primary-dark transition-colors inline-flex items-center"
          >
            Add New Project
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
                placeholder="Search by title, description, or client..."
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
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'client')}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="date">Date (Newest First)</option>
                <option value="title">Title (A-Z)</option>
                <option value="client">Client (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 flex items-center gap-6 text-body-small txt-clr-neutral">
            <span>Featured: {works.filter(w => w.featured).length}/3</span>
            <span>Regular: {works.filter(w => !w.featured).length}</span>
          </div>
        </div>

        {/* Works Grid */}
        {works.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-body-large txt-clr-neutral mb-4">No projects found</p>
            <Link
              href="/admin/our-work/new"
              className="text-primary hover:underline"
            >
              Add your first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedWorks.map((work) => (
              <div key={work.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={work.image_url}
                    alt={work.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="px-2 py-1 text-body-small bg-primary/10 txt-clr-primary rounded">
                      {work.category}
                    </span>
                    {work.featured && (
                      <span className="px-2 py-1 text-body-small bg-green-100 text-green-800 rounded font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-headline-small txt-clr-black mb-2 line-clamp-2">
                    {work.title}
                  </h3>
                  <p className="text-body-medium txt-clr-neutral mb-3 line-clamp-2">
                    {work.description}
                  </p>
                  <div className="text-body-small txt-clr-neutral mb-4 space-y-1">
                    <div>📅 {work.date}</div>
                    {work.client && <div>🏢 {work.client}</div>}
                    {work.attendees && <div>👥 {work.attendees}</div>}
                    {work.location && <div>📍 {work.location}</div>}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleToggleFeatured(work.id)}
                      className={`w-full px-3 py-2 text-body-small rounded transition-colors ${
                        work.featured
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 font-semibold'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {work.featured ? 'Featured' : 'Set as Featured'}
                    </button>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/our-work/${work.id}/edit`}
                        className="flex-1 px-3 py-2 text-center text-body-small bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(work.id)}
                        disabled={deleteId === work.id}
                        className="flex-1 px-3 py-2 text-body-small bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        {deleteId === work.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

