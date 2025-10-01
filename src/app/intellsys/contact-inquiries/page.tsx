'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  country: string;
  pincode?: string;
  state?: string;
  city?: string;
  event_type: string;
  event_date?: string;
  budget?: string;
  guest_count?: number;
  message: string;
  status: string;
  priority: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState<'created_at' | 'name' | 'event_type'>('created_at');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/intellsys/contact-inquiries');
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/intellsys/contact-inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setInquiries(inquiries.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityUpdate = async (id: string, newPriority: string) => {
    try {
      const response = await fetch(`/api/intellsys/contact-inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (response.ok) {
        setInquiries(inquiries.map(inquiry => 
          inquiry.id === id ? { ...inquiry, priority: newPriority } : inquiry
        ));
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const response = await fetch(`/api/intellsys/contact-inquiries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  // Filter and sort inquiries
  const filteredInquiries = inquiries
    .filter(inquiry => {
      const matchesSearch = inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           inquiry.company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || inquiry.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || inquiry.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'event_type':
          return a.event_type.localeCompare(b.event_type);
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'followed_up': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-body-medium txt-clr-neutral">Loading inquiries...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-display-medium txt-clr-black mb-2">
            Contact Inquiries
          </h1>
          <p className="text-body-large txt-clr-neutral">
            Manage customer inquiries and event requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-bold txt-clr-primary mb-2">
              {inquiries.length}
            </h3>
            <p className="text-body-medium txt-clr-neutral">Total Inquiries</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-bold txt-clr-primary mb-2">
              {inquiries.filter(i => i.status === 'new').length}
            </h3>
            <p className="text-body-medium txt-clr-neutral">New Inquiries</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-bold txt-clr-primary mb-2">
              {inquiries.filter(i => i.priority === 'high' || i.priority === 'urgent').length}
            </h3>
            <p className="text-body-medium txt-clr-neutral">High Priority</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-bold txt-clr-primary mb-2">
              {inquiries.filter(i => i.status === 'closed').length}
            </h3>
            <p className="text-body-medium txt-clr-neutral">Closed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-body-medium font-semibold txt-clr-black mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or company..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-body-medium font-semibold txt-clr-black mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="followed_up">Followed Up</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-body-medium font-semibold txt-clr-black mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="All">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-body-medium font-semibold txt-clr-black mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'created_at' | 'name' | 'event_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="created_at">Date</option>
                <option value="name">Name</option>
                <option value="event_type">Event Type</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        {inquiry.company && (
                          <div className="text-sm text-gray-500">{inquiry.company}</div>
                        )}
                        {inquiry.phone && (
                          <div className="text-sm text-gray-500">{inquiry.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {inquiry.event_type.replace('-', ' ')}
                        </div>
                        {inquiry.event_date && (
                          <div className="text-sm text-gray-500">
                            {new Date(inquiry.event_date).toLocaleDateString()}
                          </div>
                        )}
                        {inquiry.guest_count && (
                          <div className="text-sm text-gray-500">
                            {inquiry.guest_count} guests
                          </div>
                        )}
                        {inquiry.budget && (
                          <div className="text-sm text-gray-500">
                            {inquiry.budget.replace('-', ' - ').replace('k', 'K')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(inquiry.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="followed_up">Followed Up</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={inquiry.priority}
                        onChange={(e) => handlePriorityUpdate(inquiry.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getPriorityColor(inquiry.priority)}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inquiry.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const message = prompt('Add notes:', inquiry.notes || '');
                            if (message !== null) {
                              fetch(`/api/intellsys/contact-inquiries/${inquiry.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ notes: message }),
                              }).then(() => fetchInquiries());
                            }
                          }}
                          className="text-primary hover:text-primary-dark"
                        >
                          Notes
                        </button>
                        <button
                          onClick={() => handleDelete(inquiry.id)}
                          className="text-red-600 hover:text-red-900"
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

        {filteredInquiries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-body-large txt-clr-neutral">
              {inquiries.length === 0 ? 'No inquiries yet' : 'No inquiries match your filters'}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
