'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { INDIAN_STATES, INDIAN_CITIES, COUNTRIES } from '@/lib/locationData';

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
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage, setLeadsPerPage] = useState(50);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [capabilityTags, setCapabilityTags] = useState<string[]>([]);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);

  // Dynamic location options (start with defaults, add API results if not present)
  const [countryOptions, setCountryOptions] = useState<string[]>(COUNTRIES);
  const [stateOptions, setStateOptions] = useState<string[]>(INDIAN_STATES);
  const [cityOptions, setCityOptions] = useState<string[]>(INDIAN_CITIES);

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
      
      if (!response.ok) {
        console.error('API Error:', data.error || 'Unknown error');
        setLeads([]);
        return;
      }
      
      if (Array.isArray(data)) {
        setLeads(data);
      } else {
        console.error('Invalid data format received:', data);
        setLeads([]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCapabilityTags = async () => {
    try {
      const response = await fetch('/api/capabilities/tags');
      if (response.ok) {
        const tags = await response.json();
        if (Array.isArray(tags)) {
          setCapabilityTags(tags);
        } else {
          console.error('Invalid tags format received:', tags);
          setCapabilityTags([]);
        }
      } else {
        console.error('Failed to fetch capability tags:', response.status);
        setCapabilityTags([]);
      }
    } catch (error) {
      console.error('Error fetching capability tags:', error);
      setCapabilityTags([]);
    }
  };

  // Auto-fill region and city from pincode
  const autofillFromPincode = async (pin: string): Promise<{ region: string; city: string }> => {
    try {
      if (!/^\d{6}$/.test(pin)) {
        return { region: '', city: '' };
      }

      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await response.json();
      
      if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        return {
          region: postOffice.State || '',
          city: postOffice.District || ''
        };
      }
      
      return { region: '', city: '' };
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      return { region: '', city: '' };
    }
  };

  const handlePincodeChange = async (pincode: string) => {
    setFormData({ ...formData, project_pincode: pincode });
    
    if (pincode.length === 6) {
      setIsLoadingPincode(true);
      const { region, city } = await autofillFromPincode(pincode);
      
      // Add region to dropdown if not already present
      if (region && !stateOptions.includes(region)) {
        setStateOptions(prev => [...prev, region].sort());
      }
      
      // Add city to dropdown if not already present
      if (city && !cityOptions.includes(city)) {
        setCityOptions(prev => [...prev, city].sort());
      }
      
      setFormData(prev => ({
        ...prev,
        project_region: region,
        project_city: city
      }));
      setIsLoadingPincode(false);
    } else if (pincode.length === 0) {
      setFormData(prev => ({
        ...prev,
        project_region: '',
        project_city: ''
      }));
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
      project_country: 'India', // Default to India
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

      console.log('Saving lead with data:', formData);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        alert(showEditModal ? 'Lead updated successfully!' : 'Lead created successfully!');
        setShowEditModal(false);
        setShowAddModal(false);
        fetchLeads();
      } else {
        console.error('Failed to save lead:', data);
        alert(`Failed to save lead: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      alert(`Error saving lead: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = 
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || lead.priority === filterPriority;
      const matchesSource = filterSource === 'All' || lead.lead_source === filterSource;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesSource;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        default:
          return 0;
      }
    });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil((filteredLeads || []).length / leadsPerPage));
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = (filteredLeads || []).slice(indexOfFirstLead, indexOfLastLead);

  // Reset to page 1 when filters or per-page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterPriority, filterSource, sortBy, leadsPerPage]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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
      <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="bg-white rounded-lg w-full max-w-4xl my-4 mx-4 flex flex-col" style={{ minHeight: 'min-content', maxHeight: 'calc(100vh - 2rem)' }}>
          {/* Sticky Header */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-lg sticky top-0 z-10">
            <h2 className="text-lg sm:text-xl font-bold txt-clr-black">
              {isEdit ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <button
              onClick={() => {
                setShowEditModal(false);
                setShowAddModal(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
            <form className="space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-green-900">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none' }}
                    required
                  />
        </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none' }}
                  />
                </div>
            </div>
          </div>

            {/* Meeting Preferences */}
            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-purple-900">Meeting Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
                  <label className="block text-sm font-medium mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferred_connect_date || ''}
                    onChange={(e) => setFormData({ ...formData, preferred_connect_date: e.target.value })}
                    placeholder="Select date"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none', minHeight: '42px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Time</label>
                  <select
                    value={formData.preferred_connect_time || ''}
                    onChange={(e) => setFormData({ ...formData, preferred_connect_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23333\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 7 PM)</option>
                  </select>
                </div>
        </div>

              {/* Connection Mode */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Preferred Mode of Connection</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'phone', label: 'Phone' },
                    { value: 'whatsapp', label: 'WhatsApp' },
                    { value: 'video_call', label: 'Video Call' },
                    { value: 'in_person', label: 'In-Person Meeting' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={Array.isArray(formData.preferred_connect_mode) && formData.preferred_connect_mode.includes(option.value)}
                        onChange={(e) => {
                          const currentModes = Array.isArray(formData.preferred_connect_mode) ? formData.preferred_connect_mode : [];
                          const newModes = e.target.checked
                            ? [...currentModes, option.value]
                            : currentModes.filter(m => m !== option.value);
                          setFormData({ ...formData, preferred_connect_mode: newModes });
                        }}
                        className="w-4 h-4 text-primary border-gray-300 rounded"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
          </div>
          </div>
          </div>

            {/* Service & Project Details */}
            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-orange-900">Service & Project Details</h3>
              
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
                    placeholder="Select date"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none', minHeight: '42px' }}
                  />
          </div>
            <div>
                  <label className="block text-sm font-medium mb-1">Audience Size</label>
              <input
                    type="number"
                    value={formData.target_count || ''}
                    onChange={(e) => setFormData({ ...formData, target_count: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none' }}
              />
            </div>
            <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
              <select
                    value={formData.project_country || 'India'}
                    onChange={(e) => setFormData({ ...formData, project_country: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23333\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}
                  >
                    <option value="">Select Country</option>
                    {countryOptions.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
              </select>
            </div>
            <div>
                  <label className="block text-sm font-medium mb-1">Pincode/ZIP</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.project_pincode || ''}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      maxLength={6}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary"
                      style={{ fontSize: '16px' }}
                      placeholder="110001"
                    />
                    {isLoadingPincode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter 6-digit pincode to auto-fill city & state</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State/Region</label>
              <select
                    value={formData.project_region || ''}
                    onChange={(e) => setFormData({ ...formData, project_region: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23333\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}
                  >
                    <option value="">Select State</option>
                    {stateOptions.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
              </select>
            </div>
            <div>
                  <label className="block text-sm font-medium mb-1">City</label>
              <select
                    value={formData.project_city || ''}
                    onChange={(e) => setFormData({ ...formData, project_city: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                    style={{ fontSize: '16px', WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23333\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}
                  >
                    <option value="">Select City</option>
                    {cityOptions.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
              </select>
            </div>
          </div>

              {/* Additional Details within Project Details */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Additional Details</label>
                <textarea
                  value={formData.additional_details || ''}
                  onChange={(e) => setFormData({ ...formData, additional_details: e.target.value })}
                  rows={4}
                  placeholder="Any additional information about the lead..."
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                  style={{ fontSize: '16px', WebkitAppearance: 'none' }}
                />
              </div>
        </div>

            </form>
          </div>

          {/* Sticky Footer */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-b-lg sticky bottom-0 z-10">
            <div className="flex flex-col sm:flex-row gap-3">
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
            {isEdit && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (formData.id) {
                      handleDelete(formData.id);
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Delete this lead
                </button>
              </div>
                        )}
                      </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      {/* Mobile Hero Section - Only visible on mobile */}
      <div className="lg:hidden bg-clr-secondary-medium -mx-4 sm:-mx-6 -mt-8 mb-4 sm:mb-6 px-4 py-6 text-center">
        <img 
          src="https://cdn-sleepyhug-prod.b-cdn.net/media/intellsys-logo.webp"
          alt="Intellsys" 
          className="h-8 mx-auto mb-2"
        />
        <h2 className="text-lg font-semibold txt-clr-white">CRM Dashboard</h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                      <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold txt-clr-black">Leads</h1>
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

        {/* Filters - Compact Layout */}
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            {/* Search - Takes more space on desktop */}
            <div className="flex-1 lg:max-w-md">
              <input
                type="text"
                placeholder="🔍 Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary appearance-none bg-white"
                style={{ fontSize: '16px', WebkitAppearance: 'none' }}
              />
            </div>
            
            {/* Filters Row - Mobile: 2 cols, Desktop: horizontal */}
            <div className="grid grid-cols-2 lg:flex lg:flex-row gap-2 lg:gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary appearance-none bg-white text-sm"
                style={{ fontSize: '14px', WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\' viewBox=\'0 0 10 10\'%3E%3Cpath fill=\'%23333\' d=\'M5 8L0 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '2rem' }}
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

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary appearance-none bg-white text-sm"
                style={{ fontSize: '14px', WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\' viewBox=\'0 0 10 10\'%3E%3Cpath fill=\'%23333\' d=\'M5 8L0 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '2rem' }}
              >
                <option value="All">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary appearance-none bg-white text-sm"
                style={{ fontSize: '14px', WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\' viewBox=\'0 0 10 10\'%3E%3Cpath fill=\'%23333\' d=\'M5 8L0 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '2rem' }}
              >
                <option value="All">All Sources</option>
                <option value="form">Website Form</option>
                <option value="manual">Manual Entry</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary appearance-none bg-white text-sm"
                style={{ fontSize: '14px', WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\' viewBox=\'0 0 10 10\'%3E%3Cpath fill=\'%23333\' d=\'M5 8L0 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '2rem' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
                <option value="priority">By Priority</option>
              </select>
            </div>
            
            {/* Results Counter */}
            <div className="hidden lg:flex items-center text-sm txt-clr-neutral whitespace-nowrap">
              <span className="font-semibold txt-clr-black">{filteredLeads.length}</span>
              <span className="ml-1">of {leads.length} leads</span>
            </div>
          </div>
          
          {/* Mobile Results Counter */}
          <div className="lg:hidden text-xs txt-clr-neutral text-center mt-2">
            Showing <span className="font-semibold txt-clr-black">{filteredLeads.length}</span> of {leads.length} leads
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
                      <th className="px-6 py-3 text-left text-xs font-medium txt-clr-neutral uppercase">Created</th>
                </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(currentLeads || []).map((lead) => (
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
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                    </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(lead.priority)}`}>
                            {lead.priority}
                          </span>
                    </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>

              {/* Mobile Card View - Visible only on mobile */}
              <div className="lg:hidden divide-y divide-gray-200">
                {(currentLeads || []).map((lead) => (
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
                      <div>{lead.email}</div>
                      {lead.phone && <div>{lead.phone}</div>}
                      {lead.service_type && (
                        <div className="text-xs">
                          {Array.isArray(lead.service_type) ? lead.service_type.join(', ') : lead.service_type}
          </div>
        )}
      </div>

              </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination - Always visible */}
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Per Page Selector */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="txt-clr-neutral whitespace-nowrap">Show:</span>
              <select
                value={leadsPerPage}
                onChange={(e) => setLeadsPerPage(Number(e.target.value))}
                className="px-2 py-1 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                style={{ fontSize: '14px', WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\' viewBox=\'0 0 10 10\'%3E%3Cpath fill=\'%23333\' d=\'M5 8L0 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '1.5rem' }}
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="txt-clr-neutral">per page</span>
            </div>

            {/* Center: Page Info */}
            <div className="text-xs sm:text-sm txt-clr-neutral">
              {filteredLeads.length > 0 ? (
                <>
                  Page <span className="font-semibold txt-clr-black">{currentPage}</span> of <span className="font-semibold txt-clr-black">{totalPages}</span>
                  <span className="hidden sm:inline"> · Showing {indexOfFirstLead + 1}-{Math.min(indexOfLastLead, filteredLeads.length)} of {filteredLeads.length}</span>
                </>
              ) : (
                <span>No leads to display</span>
              )}
            </div>

            {/* Right: Page Navigation */}
            <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1 || totalPages === 1}
                  className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || totalPages === 1}
                  className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                
                {/* Page Numbers - Show only on larger screens */}
                <div className="hidden md:flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === pageNum
                            ? 'bg-primary text-white'
                            : 'border hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 1}
                  className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 1}
                  className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="bg-white rounded-lg w-full max-w-3xl my-4 mx-4 flex flex-col" style={{ minHeight: 'min-content', maxHeight: 'calc(100vh - 2rem)' }}>
            {/* Sticky Header */}
            <div className="flex-shrink-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-lg sticky top-0 z-10">
              <h2 className="text-lg sm:text-xl font-bold">Lead Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
              {/* Status, Priority & Notes - Blue Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-base sm:text-lg mb-3 text-blue-900">Quick Actions</h3>
                {/* Status & Priority - Always in one row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={selectedLead.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          const response = await fetch(`/api/intellsys/contact-inquiries/${selectedLead.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: newStatus }),
                          });
                          if (response.ok) {
                            setSelectedLead({ ...selectedLead, status: newStatus });
                            setLeads((leads || []).map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l));
                          }
                        } catch (error) {
                          console.error('Error updating status:', error);
                        }
                      }}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                      style={{ fontSize: '16px', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23333\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}
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
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={selectedLead.priority}
                      onChange={async (e) => {
                        const newPriority = e.target.value;
                        try {
                          const response = await fetch(`/api/intellsys/contact-inquiries/${selectedLead.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ priority: newPriority }),
                          });
                          if (response.ok) {
                            setSelectedLead({ ...selectedLead, priority: newPriority });
                            setLeads((leads || []).map(l => l.id === selectedLead.id ? { ...l, priority: newPriority } : l));
                          }
                        } catch (error) {
                          console.error('Error updating priority:', error);
                        }
                      }}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none bg-white"
                      style={{ fontSize: '16px', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23333\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    </div>
                  </div>
                
                {/* Admin Notes */}
                  <div>
                  <label className="block text-sm font-medium mb-2">Admin Notes</label>
                  <textarea
                    value={selectedLead.admin_notes || ''}
                    onChange={(e) => {
                      setSelectedLead({ ...selectedLead, admin_notes: e.target.value });
                    }}
                    onBlur={async () => {
                      try {
                        await fetch(`/api/intellsys/contact-inquiries/${selectedLead.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ admin_notes: selectedLead.admin_notes }),
                        });
                        setLeads((leads || []).map(l => l.id === selectedLead.id ? { ...l, admin_notes: selectedLead.admin_notes } : l));
                      } catch (error) {
                        console.error('Error saving notes:', error);
                      }
                    }}
                    rows={3}
                    placeholder="Add notes about this lead..."
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary appearance-none resize-none"
                    style={{ fontSize: '16px', WebkitAppearance: 'none' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-saves when you click outside</p>
                </div>
              </div>

              {/* Contact Info - Green Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-base sm:text-lg mb-3 text-green-900">Contact Information</h3>
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

              {/* Meeting Preferences - Purple Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-base sm:text-lg mb-3 text-purple-900">Meeting Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Preferred Date:</span> {selectedLead.preferred_connect_date || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Preferred Time:</span> {selectedLead.preferred_connect_time || 'N/A'}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium">Connection Mode:</span>{' '}
                      {selectedLead.preferred_connect_mode 
                        ? (Array.isArray(selectedLead.preferred_connect_mode)
                            ? selectedLead.preferred_connect_mode.map(m => {
                                if (m === 'phone') return 'Phone';
                                if (m === 'whatsapp') return 'WhatsApp';
                                if (m === 'video_call') return 'Video Call';
                                if (m === 'in_person') return 'In-Person Meeting';
                                return m.replace('_', ' ');
                              }).join(', ')
                            : selectedLead.preferred_connect_mode)
                        : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Service & Project Details - Orange Section */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-base sm:text-lg mb-3 text-orange-900">Service & Project</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="sm:col-span-2">
                    <span className="font-medium">Services Required:</span>{' '}
                      {selectedLead.service_type 
                        ? (Array.isArray(selectedLead.service_type) 
                            ? selectedLead.service_type.join(', ') 
                          : selectedLead.service_type) 
                        : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Project Date:</span> {selectedLead.project_date ? new Date(selectedLead.project_date).toLocaleDateString() : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Audience Size:</span> {selectedLead.target_count || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Country:</span> {selectedLead.project_country || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Pincode:</span> {selectedLead.project_pincode || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">State/Region:</span> {selectedLead.project_region || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">City:</span> {selectedLead.project_city || 'N/A'}
                  </div>
                </div>
                {selectedLead.additional_details && (
                  <div className="mt-3">
                    <span className="font-medium block mb-2">Additional Details:</span>
                    <p className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{selectedLead.additional_details}</p>
                </div>
                )}
              </div>

              {/* Lead Source & UTM Parameters - Gray Section */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-500 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-base sm:text-lg mb-3 text-gray-900">Lead Source & Marketing Attribution</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Lead Source:</span> {selectedLead.lead_source || 'form'}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(selectedLead.created_at).toLocaleString()}
                  </div>
              {(selectedLead.utm_source || selectedLead.utm_medium || selectedLead.utm_campaign) && (
                    <>
                    {selectedLead.utm_source && (
                      <div>
                          <span className="font-medium">UTM Source:</span> {selectedLead.utm_source}
                      </div>
                    )}
                    {selectedLead.utm_medium && (
                      <div>
                          <span className="font-medium">UTM Medium:</span> {selectedLead.utm_medium}
                      </div>
                    )}
                    {selectedLead.utm_campaign && (
                      <div>
                          <span className="font-medium">UTM Campaign:</span> {selectedLead.utm_campaign}
                      </div>
                    )}
                    {selectedLead.utm_content && (
                      <div>
                          <span className="font-medium">UTM Content:</span> {selectedLead.utm_content}
                      </div>
                    )}
                    {selectedLead.utm_term && (
                      <div>
                          <span className="font-medium">UTM Term:</span> {selectedLead.utm_term}
                      </div>
                      )}
                    </>
                    )}
                  </div>
                </div>

              {/* Timeline - Teal Section */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-500 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-base sm:text-lg mb-3 text-teal-900">Timeline</h3>
                <div className="space-y-3">
                  {/* Lead Created */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3"></div>
                    <div className="flex-1 text-sm">
                      <span className="font-medium">Lead Created</span>
                      <div className="text-xs text-gray-600">{new Date(selectedLead.created_at).toLocaleString()}</div>
              </div>
                  </div>
                  
                  {/* Step 1 Completed */}
                  {selectedLead.step1_completed_at && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <div className="flex-1 text-sm">
                        <span className="font-medium">Step 1: Contact Info Submitted</span>
                        <div className="text-xs text-gray-600">{new Date(selectedLead.step1_completed_at).toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2 Completed */}
                  {selectedLead.step2_completed_at && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                      <div className="flex-1 text-sm">
                        <span className="font-medium">Step 2: Meeting Preferences Set</span>
                        <div className="text-xs text-gray-600">{new Date(selectedLead.step2_completed_at).toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3 Completed */}
                  {selectedLead.step3_completed_at && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                      <div className="flex-1 text-sm">
                        <span className="font-medium">Step 3: Project Details Completed</span>
                        <div className="text-xs text-gray-600">{new Date(selectedLead.step3_completed_at).toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Last Updated */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></div>
                    <div className="flex-1 text-sm">
                      <span className="font-medium">Last Updated</span>
                      <div className="text-xs text-gray-600">{new Date(selectedLead.updated_at).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Footer */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-b-lg sticky bottom-0 z-10">
                <button
                  onClick={() => {
                  setShowDetailModal(false);
                  handleEditLead(selectedLead);
                }}
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded hover:bg-primary/90 font-medium text-sm sm:text-base"
              >
                Edit Lead Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {renderFormModal()}
    </AdminLayout>
  );
}
