'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

interface Capability {
  id: number;
  image_url: string;
  image_text: string;
  title: string;
  tag: string;
  description: string;
  features: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function CapabilitiesAdminPage() {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCapabilities();
  }, []);

  const fetchCapabilities = async () => {
    try {
      const response = await fetch('/api/intellsys/capabilities');
      if (response.ok) {
        const data = await response.json();
        setCapabilities(data);
      }
    } catch (error) {
      console.error('Error fetching capabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this capability?')) return;

    try {
      const response = await fetch(`/api/intellsys/capabilities/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCapabilities(capabilities.filter(cap => cap.id !== id));
      }
    } catch (error) {
      console.error('Error deleting capability:', error);
    }
  };

  const filteredCapabilities = capabilities.filter(cap =>
    cap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cap.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-display-small font-bold txt-clr-black">Capabilities Management</h1>
            <p className="text-body-medium txt-clr-neutral mt-1">
              Manage your event management capabilities
            </p>
          </div>
          <Link
            href="/intellsys/capabilities/new"
            className="px-4 py-2 bg-primary txt-clr-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            + Add New Capability
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-body-small txt-clr-neutral">Total Capabilities</div>
            <div className="text-display-small font-bold txt-clr-black mt-1">{capabilities.length}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <input
            type="text"
            placeholder="Search capabilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Capabilities Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center txt-clr-neutral">Loading capabilities...</div>
          ) : filteredCapabilities.length === 0 ? (
            <div className="p-8 text-center txt-clr-neutral">No capabilities found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase tracking-wider">
                      Tag
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase tracking-wider">
                      Features
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium txt-clr-neutral uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCapabilities.map((capability) => (
                    <tr key={capability.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-body-medium txt-clr-black font-semibold">{capability.sort_order}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-body-medium txt-clr-black font-medium max-w-xs truncate">
                          {capability.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 txt-clr-black">
                          {capability.tag}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-body-small txt-clr-neutral">
                          {capability.features.length} features
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-body-small txt-clr-neutral">
                          {new Date(capability.updated_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-body-small">
                        <Link
                          href={`/intellsys/capabilities/${capability.id}/edit`}
                          className="txt-clr-primary hover:txt-clr-primary/80 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(capability.id)}
                          className="txt-clr-error hover:txt-clr-error/80"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
