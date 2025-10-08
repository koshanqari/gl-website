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
  preferred_connect_mode?: string | string[];
  service_type?: string | string[];
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

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [capabilityTags, setCapabilityTags] = useState<string[]>([]);

  // Form data for add/edit
  const [formData, setFormData] = useState<Partial<Lead>>({});

  useEffect(() => {
    fetchLeads();
    fetchCapabilityTags();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/intellsys/contact-inquiries');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCapabilityTags = async () => {
    try {
      const response = await fetch('/api/capabilities/tags');
      if (response.ok) {
        const tags = await response.json();
        setCapabilityTags(tags);
      }
    } catch (error) {
      console.error('Error fetching capability tags:', error);
    }
  };

  const handleAddLead = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service_type: [],
      status: 'new',
      priority: 'medium',
      lead_source: 'manual',
      additional_details: '',
    });
    setShowAddModal(true);
  };

  const handleEditLead = (lead: Lead) => {
    setFormData(lead);
    setShowEditModal(true);
  };

  const handleSaveLead = async () => {
    try {
      const url = showEditModal 
        ? `/api/intellsys/contact-inquiries/${formData.id}`
        : '/api/intellsys/contact-inquiries';
      
      const method = showEditModal ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(showEditModal ? 'Lead updated successfully!' : 'Lead created successfully!');
        setShowEditModal(false);
        setShowAddModal(false);
        fetchLeads();
      } else {
        alert('Failed to save lead');
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Error saving lead');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/intellsys/contact-inquiries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== id));
        setShowDetailModal(false);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    converted: leads.filter(l => l.status === 'converted').length,
    highPriority: leads.filter(l => l.priority === 'high' || l.priority === 'urgent').length,
  };

  // Render form modal (used for both add and edit)
  const renderFormModal = () => {
    const isEdit = showEditModal;
    const isAdd = showAddModal;
    
    if (!isEdit && !isAdd) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold txt-clr-black">
              {isEdit ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <button
              onClick={() => {
                setShowEditModal(false);
                setShowAddModal(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Meeting Preferences */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Meeting Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferred_connect_date || ''}
                    onChange={(e) => setFormData({ ...formData, preferred_connect_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Time</label>
                  <select
                    value={formData.preferred_connect_time || ''}
                    onChange={(e) => setFormData({ ...formData, preferred_connect_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Service & Project Details */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Service & Project Details</h3>
              
              {/* Service Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Service Required *</label>
                <div className="grid grid-cols-2 gap-2">
                  {capabilityTags.map((tag) => (
                    <label key={tag} className="flex items-center space-x-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={Array.isArray(formData.service_type) && formData.service_type.includes(tag)}
                        onChange={(e) => {
                          const currentTypes = Array.isArray(formData.service_type) ? formData.service_type : [];
                          const newTypes = e.target.checked
                            ? [...currentTypes, tag]
                            : currentTypes.filter(t => t !== tag);
                          setFormData({ ...formData, service_type: newTypes });
                        }}
                        className="w-4 h-4 text-primary border-gray-300 rounded"
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Date</label>
                  <input
                    type="date"
                    value={formData.project_date || ''}
                    onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Audience Size</label>
                  <input
                    type="number"
                    value={formData.target_count || ''}
                    onChange={(e) => setFormData({ ...formData, target_count: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.project_country || ''}
                    onChange={(e) => setFormData({ ...formData, project_country: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.project_city || ''}
                    onChange={(e) => setFormData({ ...formData, project_city: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Status & Priority */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Status & Priority</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status *</label>
                  <select
                    value={formData.status || 'new'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority *</label>
                  <select
                    value={formData.priority || 'medium'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-medium mb-1">Additional Details</label>
              <textarea
                value={formData.additional_details || ''}
                onChange={(e) => setFormData({ ...formData, additional_details: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
              />
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">Admin Notes</label>
              <textarea
                value={formData.admin_notes || ''}
                onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setShowAddModal(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLead}
                className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm sm:text-base"
              >
                {isEdit ? 'Update Lead' : 'Create Lead'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold txt-clr-black">Leads (CRM)</h1>
            <p className="text-sm sm:text-base txt-clr-neutral mt-1">
              Manage your customer leads and inquiries
            </p>
          </div>
          <button
            onClick={handleAddLead}
            className="w-full sm:w-auto px-4 py-2 bg-primary txt-clr-white rounded-lg hover:bg-opacity-90 transition-colors text-sm sm:text-base"
          >
            + Add New Lead
          </button>
        </div>

        {/* Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border">
            <div className="text-xs sm:text-sm txt-clr-neutral">Total Leads</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold txt-clr-black mt-1">{stats.total}</div>
          </div>
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border">
            <div className="text-xs sm:text-sm txt-clr-neutral">New</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mt-1">{stats.new}</div>
          </div>
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border">
            <div className="text-xs sm:text-sm txt-clr-neutral">Converted</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mt-1">{stats.converted}</div>
          </div>
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border">
            <div className="text-xs sm:text-sm txt-clr-neutral">High Priority</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 mt-1">{stats.highPriority}</div>
          </div>
        </div>

        {/* Filters - Mobile Optimized */}
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border space-y-3">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm sm:text-base"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary text-sm sm:text-base"
              >
                <option value="All">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Display - Mobile Cards / Desktop Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center txt-clr-neutral">No leads found</div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                        setSelectedLead(lead);
                        setShowDetailModal(true);
                      }}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{lead.name}</div>
                          {lead.company && <div className="text-sm text-gray-500">{lead.company}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{lead.email}</div>
                          {lead.phone && <div className="text-sm text-gray-500">{lead.phone}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {lead.service_type 
                              ? (Array.isArray(lead.service_type) 
                                  ? lead.service_type.join(', ') 
                                  : lead.service_type) 
                              : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(lead.priority)}`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEditLead(lead)}
                            className="text-primary hover:text-primary/80 text-sm mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Visible only on mobile */}
              <div className="lg:hidden divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowDetailModal(true);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base">{lead.name}</h3>
                        {lead.company && <p className="text-sm text-gray-600">{lead.company}</p>}
                      </div>
                      <div className="flex flex-col gap-1 items-end ml-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div>📧 {lead.email}</div>
                      {lead.phone && <div>📱 {lead.phone}</div>}
                      {lead.service_type && (
                        <div className="text-xs">
                          🎯 {Array.isArray(lead.service_type) ? lead.service_type.join(', ') : lead.service_type}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleEditLead(lead)}
                        className="flex-1 px-3 py-1.5 bg-primary text-white rounded text-xs sm:text-sm hover:bg-primary/90"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowDetailModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold">Lead Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {selectedLead.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {selectedLead.email || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {selectedLead.phone || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Company:</span> {selectedLead.company || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3">Service Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="sm:col-span-2">
                    <span className="font-medium">Services:</span>{' '}
                    {selectedLead.service_type 
                      ? (Array.isArray(selectedLead.service_type) 
                          ? selectedLead.service_type.join(', ') 
                          : selectedLead.service_type) 
                      : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedLead.status)}`}>
                      {selectedLead.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span>{' '}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(selectedLead.priority)}`}>
                      {selectedLead.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditLead(selectedLead);
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm sm:text-base"
                >
                  Edit Lead
                </button>
                <button
                  onClick={() => handleDelete(selectedLead.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm sm:text-base"
                >
                  Delete Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {renderFormModal()}
    </AdminLayout>
  );
}
