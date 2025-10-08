'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  preferred_connect_date?: string;
  preferred_connect_time?: string;
  preferred_connect_mode?: string | string[]; // Can be JSON array or legacy string
  service_type?: string | string[]; // Can be JSON array or legacy string
  project_date?: string;
  project_country?: string;
  project_pincode?: string;
  project_region?: string;
  project_city?: string;
  target_count?: number;
  additional_details: string;
  status: string;
  priority: string;
  admin_notes?: string;
  lead_source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  step1_completed_at?: string;
  step2_completed_at?: string;
  step3_completed_at?: string;
  created_at: string;
  updated_at: string;
}

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'created_at' | 'name' | 'service_type'>('created_at');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/intellsys/contact-inquiries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
        if (selectedLead?.id === id) {
          setShowDetailModal(false);
          setSelectedLead(null);
        }
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleOpenDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailModal(false);
    setSelectedLead(null);
  };

  const handleDownloadCSV = () => {
    // Create CSV headers
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Service Type',
      'Event Date',
      'Event Country',
      'Event City',
      'Event Region',
      'Guest Count',
      'Additional Details',
      'Status',
      'Priority',
      'Lead Source',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Admin Notes',
      'Step 1 Completed',
      'Step 2 Completed',
      'Step 3 Completed',
      'Created At',
      'Updated At'
    ];

    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...filteredInquiries.map(inquiry => [
        inquiry.id,
        `"${inquiry.name || ''}"`,
        `"${inquiry.email || ''}"`,
        `"${inquiry.phone || ''}"`,
        `"${inquiry.company || ''}"`,
        `"${inquiry.service_type ? (Array.isArray(inquiry.service_type) ? inquiry.service_type.join(', ') : inquiry.service_type) : ''}"`,
        `"${inquiry.project_date || ''}"`,
        `"${inquiry.project_country || ''}"`,
        `"${inquiry.project_city || ''}"`,
        `"${inquiry.project_region || ''}"`,
        inquiry.target_count || '',
        `"${(inquiry.additional_details || '').replace(/"/g, '""')}"`,
        `"${inquiry.status}"`,
        `"${inquiry.priority}"`,
        `"${inquiry.lead_source || ''}"`,
        `"${inquiry.utm_source || ''}"`,
        `"${inquiry.utm_medium || ''}"`,
        `"${inquiry.utm_campaign || ''}"`,
        `"${(inquiry.admin_notes || '').replace(/"/g, '""')}"`,
        `"${inquiry.step1_completed_at || ''}"`,
        `"${inquiry.step2_completed_at || ''}"`,
        `"${inquiry.step3_completed_at || ''}"`,
        `"${inquiry.created_at}"`,
        `"${inquiry.updated_at}"`
      ].join(','))
    ];

    // Create and download CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Filter and sort leads
  const filteredInquiries = inquiries
    .filter(inquiry => {
      const matchesSearch = inquiry.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           inquiry.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           inquiry.company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'All' || inquiry.priority === filterPriority;
      const matchesStatus = filterStatus === 'All' || inquiry.status === filterStatus;
      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'service_type':
          const aType = Array.isArray(a.service_type) ? a.service_type.join(',') : (a.service_type || '');
          const bType = Array.isArray(b.service_type) ? b.service_type.join(',') : (b.service_type || '');
          return aType.localeCompare(bType);
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-indigo-100 text-indigo-800';
      case 'proposal_sent': return 'bg-yellow-100 text-yellow-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
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
            CRM
          </h1>
          <p className="text-body-large txt-clr-neutral">
            Manage leads, track conversions, and grow your business
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-bold txt-clr-black mb-2">
              {inquiries.length}
            </h3>
            <p className="text-body-medium txt-clr-neutral">Total Leads</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">
              {inquiries.filter(i => i.status === 'new').length}
            </h3>
            <p className="text-body-medium txt-clr-neutral">New Leads</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              {inquiries.filter(i => i.status === 'won').length}
            </h3>
            <p className="text-body-medium txt-clr-neutral">Converted</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-red-600 mb-2">
              {inquiries.filter(i => i.priority === 'high').length}
            </h3>
            <p className="text-body-medium txt-clr-neutral">High Priority</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold txt-clr-black">Filters & Actions</h3>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CSV
            </button>
          </div>
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
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
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
                onChange={(e) => setSortBy(e.target.value as 'created_at' | 'name' | 'service_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="created_at">Date</option>
                <option value="name">Name</option>
                <option value="service_type">Service Type</option>
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
                    Admin Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <tr 
                    key={inquiry.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleOpenDetails(inquiry)}
                  >
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
                          {inquiry.service_type 
                            ? (Array.isArray(inquiry.service_type) 
                                ? inquiry.service_type.join(', ') 
                                : inquiry.service_type.replace('-', ' ')) 
                            : 'Not specified'}
                        </div>
                        {inquiry.project_date && (
                          <div className="text-sm text-gray-500">
                            {new Date(inquiry.project_date).toLocaleDateString()}
                          </div>
                        )}
                        {inquiry.target_count && (
                          <div className="text-sm text-gray-500">
                            {inquiry.target_count} people
                          </div>
                        )}
                        {inquiry.project_city && inquiry.project_region && (
                          <div className="text-sm text-gray-500">
                            {inquiry.project_city}, {inquiry.project_region}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(inquiry.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal_sent">Proposal Sent</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={inquiry.priority}
                        onChange={(e) => handlePriorityUpdate(inquiry.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getPriorityColor(inquiry.priority)}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 truncate">
                        {inquiry.admin_notes || <span className="text-gray-400 italic">No notes</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inquiry.created_at)}
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
              {inquiries.length === 0 ? 'No leads yet' : 'No leads match your filters'}
            </p>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseDetails}>
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold txt-clr-black">Lead Details</h2>
                <p className="text-sm txt-clr-neutral">ID: {selectedLead.id}</p>
              </div>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              {/* CRM Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold txt-clr-black mb-3">CRM Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Status</label>
                    <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedLead.status)}`}>
                      {selectedLead.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Priority</label>
                    <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedLead.priority)}`}>
                      {selectedLead.priority.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Lead Source</label>
                    <p className="mt-1 text-sm txt-clr-black">{selectedLead.lead_source || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Created</label>
                    <p className="mt-1 text-sm txt-clr-black">{formatDate(selectedLead.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Step 1: Contact Information */}
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold txt-clr-black mb-3 flex items-center">
                  <span className="bg-primary txt-clr-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">1</span>
                  Contact Information
                  {selectedLead.step1_completed_at && (
                    <span className="ml-2 text-xs text-green-600">✓ Completed {new Date(selectedLead.step1_completed_at).toLocaleDateString()}</span>
                  )}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Full Name</label>
                    <p className="mt-1 text-sm txt-clr-black font-medium">{selectedLead.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Email</label>
                    <p className="mt-1 text-sm txt-clr-black">{selectedLead.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Phone</label>
                    <p className="mt-1 text-sm txt-clr-black">{selectedLead.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Company</label>
                    <p className="mt-1 text-sm txt-clr-black">{selectedLead.company || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Meeting Preferences */}
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold txt-clr-black mb-3 flex items-center">
                  <span className="bg-primary txt-clr-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">2</span>
                  Meeting Preferences
                  {selectedLead.step2_completed_at && (
                    <span className="ml-2 text-xs text-green-600">✓ Completed {new Date(selectedLead.step2_completed_at).toLocaleDateString()}</span>
                  )}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Preferred Date</label>
                    <p className="mt-1 text-sm txt-clr-black">{selectedLead.preferred_connect_date || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Preferred Time</label>
                    <p className="mt-1 text-sm txt-clr-black capitalize">{selectedLead.preferred_connect_time || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Connection Mode</label>
                    <p className="mt-1 text-sm txt-clr-black capitalize">
                      {selectedLead.preferred_connect_mode 
                        ? (Array.isArray(selectedLead.preferred_connect_mode)
                            ? selectedLead.preferred_connect_mode.map(m => m.replace('_', ' ')).join(', ')
                            : selectedLead.preferred_connect_mode)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Event Details */}
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold txt-clr-black mb-3 flex items-center">
                  <span className="bg-primary txt-clr-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">3</span>
                  Event Details
                  {selectedLead.step3_completed_at && (
                    <span className="ml-2 text-xs text-green-600">✓ Completed {new Date(selectedLead.step3_completed_at).toLocaleDateString()}</span>
                  )}
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Capability Tags</label>
                    <p className="mt-1 text-sm txt-clr-black capitalize">
                      {selectedLead.service_type 
                        ? (Array.isArray(selectedLead.service_type) 
                            ? selectedLead.service_type.join(', ') 
                            : selectedLead.service_type.replace('-', ' ')) 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Preferred Date</label>
                    <p className="mt-1 text-sm txt-clr-black">
                      {selectedLead.project_date ? new Date(selectedLead.project_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Country</label>
                    <p className="mt-1 text-sm txt-clr-black">{selectedLead.project_country || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">Pincode/ZIP</label>
                    <p className="mt-1 text-sm txt-clr-black">{selectedLead.project_pincode || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">State/Region</label>
                    <p className="mt-1 text-sm txt-clr-black">{selectedLead.project_region || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium txt-clr-neutral">City</label>
                    <p className="mt-1 text-sm txt-clr-black">{selectedLead.project_city || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium txt-clr-neutral">Audience/Group Size</label>
                    <p className="mt-1 text-sm txt-clr-black">{selectedLead.target_count || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium txt-clr-neutral">Additional Details</label>
                  <p className="mt-1 text-sm txt-clr-black bg-gray-50 p-3 rounded whitespace-pre-wrap">
                    {selectedLead.additional_details || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Marketing Attribution */}
              {(selectedLead.utm_source || selectedLead.utm_medium || selectedLead.utm_campaign) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold txt-clr-black mb-3">Marketing Attribution</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedLead.utm_source && (
                      <div>
                        <label className="text-sm font-medium txt-clr-neutral">UTM Source</label>
                        <p className="mt-1 text-sm txt-clr-black">{selectedLead.utm_source}</p>
                      </div>
                    )}
                    {selectedLead.utm_medium && (
                      <div>
                        <label className="text-sm font-medium txt-clr-neutral">UTM Medium</label>
                        <p className="mt-1 text-sm txt-clr-black">{selectedLead.utm_medium}</p>
                      </div>
                    )}
                    {selectedLead.utm_campaign && (
                      <div>
                        <label className="text-sm font-medium txt-clr-neutral">UTM Campaign</label>
                        <p className="mt-1 text-sm txt-clr-black">{selectedLead.utm_campaign}</p>
                      </div>
                    )}
                    {selectedLead.utm_content && (
                      <div>
                        <label className="text-sm font-medium txt-clr-neutral">UTM Content</label>
                        <p className="mt-1 text-sm txt-clr-black">{selectedLead.utm_content}</p>
                      </div>
                    )}
                    {selectedLead.utm_term && (
                      <div>
                        <label className="text-sm font-medium txt-clr-neutral">UTM Term</label>
                        <p className="mt-1 text-sm txt-clr-black">{selectedLead.utm_term}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="text-sm font-medium txt-clr-neutral">Admin Notes</label>
                <textarea
                  value={selectedLead.admin_notes || ''}
                  onChange={(e) => {
                    setSelectedLead({ ...selectedLead, admin_notes: e.target.value });
                  }}
                  onBlur={() => {
                    fetch(`/api/intellsys/contact-inquiries/${selectedLead.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ admin_notes: selectedLead.admin_notes }),
                    }).then(() => fetchInquiries());
                  }}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Add internal notes about this lead..."
                />
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold txt-clr-black mb-3">Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="txt-clr-neutral">Created:</span>
                    <span className="txt-clr-black font-medium">{formatDate(selectedLead.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="txt-clr-neutral">Last Updated:</span>
                    <span className="txt-clr-black font-medium">{formatDate(selectedLead.updated_at)}</span>
                  </div>
                  {selectedLead.step1_completed_at && (
                    <div className="flex justify-between">
                      <span className="txt-clr-neutral">Step 1 Completed:</span>
                      <span className="txt-clr-black">{formatDate(selectedLead.step1_completed_at)}</span>
                    </div>
                  )}
                  {selectedLead.step2_completed_at && (
                    <div className="flex justify-between">
                      <span className="txt-clr-neutral">Step 2 Completed:</span>
                      <span className="txt-clr-black">{formatDate(selectedLead.step2_completed_at)}</span>
                    </div>
                  )}
                  {selectedLead.step3_completed_at && (
                    <div className="flex justify-between">
                      <span className="txt-clr-neutral">Step 3 Completed:</span>
                      <span className="txt-clr-black">{formatDate(selectedLead.step3_completed_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    if (selectedLead.email) {
                      window.location.href = `mailto:${selectedLead.email}`;
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Send Email
                </button>
                {selectedLead.phone && (
                  <button
                    onClick={() => {
                      window.location.href = `tel:${selectedLead.phone}`;
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Call {selectedLead.phone}
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this lead?')) {
                      handleDelete(selectedLead.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Lead
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleCloseDetails}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
