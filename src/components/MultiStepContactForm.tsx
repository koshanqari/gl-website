'use client';

import { useState, useEffect } from 'react';
import CTAButton from '@/components/ui/CTAButton';

interface FormData {
  // Step 1
  name: string;
  email: string;
  phone: string;
  company: string;
  
  // Step 2
  preferredConnectDate: string;
  preferredConnectTime: string;
  preferredConnectMode: string[]; // Array for multiple selections
  
  // Step 3
  serviceType: string[]; // Array for multiple capability tags
  projectDate: string;
  projectCountry: string;
  projectPincode: string;
  projectRegion: string;
  projectCity: string;
  targetCount: string;
  additionalDetails: string;
}

export default function MultiStepContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [capabilityTags, setCapabilityTags] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    preferredConnectDate: '',
    preferredConnectTime: '',
    preferredConnectMode: [],
    serviceType: [],
    projectDate: '',
    projectCountry: 'India',
    projectPincode: '',
    projectRegion: '',
    projectCity: '',
    targetCount: '',
    additionalDetails: ''
  });

  // Extract UTM parameters from URL
  const [utmParams, setUtmParams] = useState<any>(null);

  // Fetch capability tags on component mount
  useEffect(() => {
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

    fetchCapabilityTags();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const utm = {
        source: params.get('utm_source'),
        medium: params.get('utm_medium'),
        campaign: params.get('utm_campaign'),
        content: params.get('utm_content'),
        term: params.get('utm_term')
      };
      
      // Only set if at least one UTM parameter exists
      if (Object.values(utm).some(val => val !== null)) {
        setUtmParams(utm);
      }
    }
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-populate region and city when pincode is entered (Step 3)
      if (name === 'projectPincode' && currentStep === 3) {
        if (value.length === 6) {
          setTimeout(async () => {
            setIsLoadingPincode(true);
            const { region, city } = await autofillFromPincode(value);
            setFormData(current => ({
              ...current,
              projectRegion: region,
              projectCity: city
            }));
            setIsLoadingPincode(false);
          }, 300);
        } else if (value.length === 0) {
          newData.projectRegion = '';
          newData.projectCity = '';
        }
      }
      
      return newData;
    });
  };

  const handleCheckboxChange = (field: 'preferredConnectMode' | 'serviceType', value: string) => {
    setFormData(prev => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value) // Remove if already selected
        : [...currentValues, value]; // Add if not selected
      
      return { ...prev, [field]: newValues };
    });
  };

  // Auto-fill region and city from pincode
  const autofillFromPincode = async (pin: string): Promise<{ region: string; city: string }> => {
    try {
      if (!/^\d{6}$/.test(pin)) {
        return { region: '', city: '' };
      }

      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await response.json();
      
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0].PostOffice?.length > 0) {
        const office = data[0].PostOffice[0];
        return {
          region: office.State || '',
          city: office.District || office.Name || ''
        };
      }
      
      return { region: '', city: '' };
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      return { region: '', city: '' };
    }
  };

  const handleStepSubmit = async (e: React.FormEvent, step: number) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let payload: any = { step };
      
      // Include leadId if it exists (for updates)
      if (leadId) {
        payload.leadId = leadId;
      }

      // Include UTM parameters on step 1
      if (step === 1 && utmParams) {
        payload.utm = utmParams;
      }

      // Add step-specific data
      if (step === 1) {
        payload = { ...payload,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company
        };
      } else if (step === 2) {
        payload = { ...payload,
          preferredConnectDate: formData.preferredConnectDate,
          preferredConnectTime: formData.preferredConnectTime,
          preferredConnectMode: formData.preferredConnectMode // Send as JSON array
        };
      } else if (step === 3) {
        payload = { ...payload,
          serviceType: formData.serviceType,
          projectDate: formData.projectDate,
          projectCountry: formData.projectCountry,
          projectPincode: formData.projectPincode,
          projectRegion: formData.projectRegion,
          projectCity: formData.projectCity,
          targetCount: formData.targetCount,
          additionalDetails: formData.additionalDetails
        };
      }

      const response = await fetch('/api/contact-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Save leadId for subsequent updates
        if (data.leadId && !leadId) {
          setLeadId(data.leadId);
        }

        if (step < 3) {
          // Move to next step
          setCurrentStep(step + 1);
        } else {
          // Final step - show success message
          alert('Thank you! Your inquiry has been submitted successfully. We\'ll get back to you within 24 hours.');
          
          // Reset form
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            preferredConnectDate: '',
            preferredConnectTime: '',
            preferredConnectMode: [],
            serviceType: [],
            projectDate: '',
            projectCountry: 'India',
            projectPincode: '',
            projectRegion: '',
            projectCity: '',
            targetCount: '',
            additionalDetails: ''
          });
          setLeadId(null);
          setCurrentStep(1);
        }
      } else {
        alert(data.error || 'There was an error submitting your information. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-clr-white shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 relative">
              <div className={`h-2 ${step < currentStep ? 'bg-primary' : step === currentStep ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step < currentStep ? 'bg-primary txt-clr-white' : 
                step === currentStep ? 'bg-primary txt-clr-white' : 
                'bg-gray-200 txt-clr-neutral'
              }`}>
                {step < currentStep ? '✓' : step}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs sm:text-sm txt-clr-neutral mt-6">
          <span className={currentStep >= 1 ? 'font-semibold txt-clr-black' : ''}>Contact Info</span>
          <span className={currentStep >= 2 ? 'font-semibold txt-clr-black' : ''}>Meeting Preferences</span>
          <span className={currentStep >= 3 ? 'font-semibold txt-clr-black' : ''}>Event Details</span>
        </div>
      </div>

      {/* Step 1: Basic Contact Info */}
      {currentStep === 1 && (
        <form onSubmit={(e) => handleStepSubmit(e, 1)} className="space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-display-small sm:text-display-medium section-heading section-heading-onwhite mb-2 sm:mb-3 text-center">
              Let&apos;s Get Started
            </h2>
            <p className="text-body-medium sm:text-body-large txt-clr-black text-center">
              First, tell us a bit about yourself
            </p>
          </div>

          <div>
            <label htmlFor="name" className="block text-body-medium font-semibold topic-heading mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-body-medium font-semibold topic-heading mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-body-medium font-semibold topic-heading mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-body-medium font-semibold topic-heading mb-2">
              Company/Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              placeholder="Your company name"
            />
          </div>

          <CTAButton
            type="submit"
            variant="accent-primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </CTAButton>
        </form>
      )}

      {/* Step 2: Meeting Preferences */}
      {currentStep === 2 && (
        <form onSubmit={(e) => handleStepSubmit(e, 2)} className="space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-display-small sm:text-display-medium section-heading section-heading-onwhite mb-2 sm:mb-3 text-center">
              Schedule a Meeting
            </h2>
            <p className="text-body-medium sm:text-body-large txt-clr-black text-center">
              Let us know when and how you&apos;d like to connect
            </p>
          </div>

          <div>
            <label htmlFor="preferredConnectDate" className="block text-body-medium font-semibold topic-heading mb-2">
              Preferred Date to Connect
            </label>
            <input
              type="date"
              id="preferredConnectDate"
              name="preferredConnectDate"
              value={formData.preferredConnectDate}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label htmlFor="preferredConnectTime" className="block text-body-medium font-semibold topic-heading mb-2">
              Preferred Time Slot
            </label>
            <select
              id="preferredConnectTime"
              name="preferredConnectTime"
              value={formData.preferredConnectTime}
              onChange={handleInputChange}
              className="w-full appearance-none bg-white px-3 sm:px-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-base"
            >
              <option value="">Select a time slot</option>
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
              <option value="evening">Evening (4 PM - 7 PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-body-medium font-semibold topic-heading mb-3">
              Preferred Mode of Connection
            </label>
            <div className="space-y-3">
              {[
                { value: 'video_call', label: 'Video Call' },
                { value: 'phone_call', label: 'Phone Call' },
                { value: 'in_person', label: 'In-Person Meeting' },
                { value: 'email', label: 'Email' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferredConnectMode.includes(option.value)}
                    onChange={() => handleCheckboxChange('preferredConnectMode', option.value)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-body-medium txt-clr-black">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <CTAButton
              type="button"
              variant="accent-secondary"
              size="lg"
              className="flex-1"
              onClick={() => setCurrentStep(1)}
            >
              Back
            </CTAButton>
            <CTAButton
              type="submit"
              variant="accent-primary"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </CTAButton>
          </div>
        </form>
      )}

      {/* Step 3: Event Details */}
      {currentStep === 3 && (
        <form onSubmit={(e) => handleStepSubmit(e, 3)} className="space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-display-small sm:text-display-medium section-heading section-heading-onwhite mb-2 sm:mb-3 text-center">
              Tell Us About Your Event
            </h2>
            <p className="text-body-medium sm:text-body-large txt-clr-black text-center">
              Help us understand your event requirements
            </p>
          </div>

          <div>
            <label className="block text-body-medium font-semibold topic-heading mb-3">
              Service Required *
            </label>
            {capabilityTags.length === 0 ? (
              <div className="text-body-small txt-clr-neutral">Loading services...</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {capabilityTags.map((tag) => (
                  <label key={tag} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.serviceType.includes(tag)}
                      onChange={() => handleCheckboxChange('serviceType', tag)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-body-medium txt-clr-black">{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="projectCountry" className="block text-body-medium font-semibold topic-heading mb-2">
                Country
              </label>
              <select
                id="projectCountry"
                name="projectCountry"
                value={formData.projectCountry}
                onChange={handleInputChange}
                className="w-full appearance-none bg-white px-3 sm:px-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="UAE">UAE</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="projectPincode" className="block text-body-medium font-semibold topic-heading mb-2">
                Pincode/ZIP
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="projectPincode"
                  name="projectPincode"
                  value={formData.projectPincode}
                  onChange={handleInputChange}
                  maxLength={6}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="Enter pincode"
                />
                {isLoadingPincode && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="projectRegion" className="block text-body-medium font-semibold topic-heading mb-2">
                State/Region
              </label>
              <input
                type="text"
                id="projectRegion"
                name="projectRegion"
                value={formData.projectRegion}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                placeholder="State/Region"
              />
            </div>
            <div>
              <label htmlFor="projectCity" className="block text-body-medium font-semibold topic-heading mb-2">
                City
              </label>
              <input
                type="text"
                id="projectCity"
                name="projectCity"
                value={formData.projectCity}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                placeholder="City"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="projectDate" className="block text-body-medium font-semibold topic-heading mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                id="projectDate"
                name="projectDate"
                value={formData.projectDate}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label htmlFor="targetCount" className="block text-body-medium font-semibold topic-heading mb-2">
                Audience Size
              </label>
              <input
                type="number"
                id="targetCount"
                name="targetCount"
                value={formData.targetCount}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                placeholder="Number of people"
              />
            </div>
          </div>

          <div>
            <label htmlFor="additionalDetails" className="block text-body-medium font-semibold topic-heading mb-2">
              Tell Us More About Your Requirement
            </label>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Describe your vision, special requirements, preferences, or any other details..."
            />
          </div>

          <div className="flex gap-3 sm:gap-4">
            <CTAButton
              type="button"
              variant="accent-secondary"
              size="lg"
              className="flex-1"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </CTAButton>
            <CTAButton
              type="submit"
              variant="accent-primary"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </CTAButton>
          </div>
        </form>
      )}
    </div>
  );
}