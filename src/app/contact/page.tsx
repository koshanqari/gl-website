'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTAButton from '@/components/ui/CTAButton';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    country: 'India',
    pincode: '',
    state: '',
    city: '',
    eventType: '',
    eventDate: '',
    budget: '',
    guestCount: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [eventDateInputType, setEventDateInputType] = useState<'text' | 'date'>('text');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Auto-fill state and city from pincode using API
  const autofillFromPincode = async (pin: string): Promise<{ state: string; city: string }> => {
    try {
      // Only make API call for 6-digit numeric pincodes
      if (!/^\d{6}$/.test(pin)) {
        return { state: '', city: '' };
      }

      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await response.json();
      
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0].PostOffice?.length > 0) {
        const office = data[0].PostOffice[0];
        
        return {
          state: office.State || '',
          city: office.District || office.Name || ''
        };
      }
      
      return { state: '', city: '' };
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      return { state: '', city: '' };
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-populate state and city when pincode is entered
      if (name === 'pincode') {
        if (value.length === 6) {
          // Debounce the API call to avoid rapid requests
          setTimeout(async () => {
            setIsLoadingPincode(true);
            const { state, city } = await autofillFromPincode(value);
            setFormData(current => ({
              ...current,
              state,
              city
            }));
            setIsLoadingPincode(false);
          }, 300);
        } else if (value.length === 0) {
          // Clear state and city when pincode is cleared
          newData.state = '';
          newData.city = '';
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          country: 'India',
          pincode: '',
          state: '',
          city: '',
          eventType: '',
          eventDate: '',
          budget: '',
          guestCount: '',
          message: ''
        });
        
        alert('Thank you for your inquiry! We\'ll get back to you within 24 hours.');
      } else {
        alert('There was an error submitting your inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-clr-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 h-[50vh] sm:h-[55vh] md:h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
            alt="Event Planning Hero"
            fill
            className="object-cover"
            sizes="100vw"
            quality={95}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-headline-large sm:text-display-small section-heading-onColor mb-4 sm:mb-6 px-4">
            Let&apos;s Plan Your Perfect Event
          </h1>
          <p className="text-body-small sm:text-body-medium txt-clr-white mb-6 sm:mb-8 max-w-3xl mx-auto px-4" style={{opacity: 0.9}}>
            Ready to create unforgettable experiences? Get in touch with our expert team and let&apos;s bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-clr-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            {/* Contact Form */}
            {hasMounted && (
            <div className="bg-clr-white shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-display-small sm:text-display-medium section-heading section-heading-onwhite mb-3 sm:mb-4 text-center">
                  Tell Us About Your Event
                </h2>
                <p className="text-body-medium sm:text-body-large txt-clr-black">
                  Fill out the form below and we&apos;ll get back to you with a customized proposal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" suppressHydrationWarning>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="min-w-0">
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
                  <div className="min-w-0">
                    <label htmlFor="email" className="block text-body-medium font-semibold topic-heading mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                  <div>
                    <label htmlFor="phone" className="block text-body-medium font-semibold topic-heading mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="country" className="block text-body-medium font-semibold topic-heading mb-2">
                      Country
                    </label>
                    <div className="relative">
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full appearance-none bg-white px-3 sm:px-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="UAE">UAE</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 7L10 12L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-body-medium font-semibold topic-heading mb-2">
                      Pincode/ZIP Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                        placeholder="Enter pincode"
                        maxLength={6}
                      />
                      {isLoadingPincode && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        </div>
                      )}
                    </div>
                    
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="min-w-0">
                    <label htmlFor="state" className="block text-body-medium font-semibold topic-heading mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full max-w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      placeholder="State/Province"
                    />
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="city" className="block text-body-medium font-semibold topic-heading mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full max-w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="eventType" className="block text-body-medium font-semibold topic-heading mb-2">
                      Event Type *
                    </label>
                    <div className="relative">
                      <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        required
                        className="w-full appearance-none bg-white px-3 sm:px-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      >
                        <option value="">Select event type</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="conference">Conference</option>
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="product-launch">Product Launch</option>
                        <option value="gala">Gala Dinner</option>
                        <option value="virtual">Virtual Event</option>
                        <option value="other">Other</option>
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 7L10 12L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="eventDate" className="block text-body-medium font-semibold topic-heading mb-2">
                      Preferred Event Date
                    </label>
                    {hasMounted ? (
                      <div className="relative">
                        <input
                          type={eventDateInputType}
                          id="eventDate"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          className="w-full max-w-full appearance-none bg-white px-3 sm:px-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus-border-transparent text-base"
                          placeholder={eventDateInputType === 'text' ? 'Select date' : undefined}
                          onFocus={() => setEventDateInputType('date')}
                          onBlur={(e) => {
                            if (!e.currentTarget.value) {
                              setEventDateInputType('text');
                            }
                          }}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 11H17M7 15H13M7 3V5M17 3V5M4 7H20C21.1046 7 22 7.89543 22 9V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V9C2 7.89543 2.89543 7 4 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          id="eventDate"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          readOnly
                          className="w-full max-w-full appearance-none bg-white px-3 sm:px-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-md text-base"
                          placeholder="YYYY-MM-DD"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 11H17M7 15H13M7 3V5M17 3V5M4 7H20C21.1046 7 22 7.89543 22 9V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V9C2 7.89543 2.89543 7 4 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="budget" className="block text-body-medium font-semibold topic-heading mb-2">
                      Budget Range
                    </label>
                    <div className="relative">
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full appearance-none bg-white px-3 sm:px-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-5k">Under $5,000</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-25k">$10,000 - $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="over-100k">Over $100,000</option>
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 7L10 12L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="guestCount" className="block text-body-medium font-semibold topic-heading mb-2">
                      Expected Guest Count
                    </label>
                    <input
                      type="number"
                      id="guestCount"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                      placeholder="Number of guests"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-body-medium font-semibold topic-heading mb-2">
                    Tell Us More About Your Event *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe your event vision, special requirements, venue preferences, or any other details..."
                  />
                </div>

                <CTAButton
                  type="submit"
                  variant="accent-primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </CTAButton>
              </form>
            </div>
            )}
            
            
          </div>
        </div>
      </section>

      {/* FAQ Heading */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 primary-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large section-heading section-heading-onColor text-center">
            Frequently Asked Questions
          </h2>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 sm:py-12 md:py-16 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-body-medium sm:text-body-large max-w-2xl mx-auto px-4">
              Get answers to common questions about our event planning services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-headline-small topic-heading mb-4">
                How far in advance should I book?
              </h3>
              <p className="text-body-medium txt-clr-black">
                We recommend booking at least 3-6 months in advance for large events, though we can accommodate shorter timelines for smaller gatherings. Popular dates and venues book quickly, so early planning ensures the best options.
              </p>
            </div>

            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-headline-small topic-heading mb-4">
                What&apos;s included in your services?
              </h3>
              <p className="text-body-medium txt-clr-black">
                Our full-service approach includes venue selection, vendor coordination, design and décor, catering management, entertainment booking, day-of coordination, and post-event follow-up. We tailor our services to your specific needs.
              </p>
            </div>

            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-headline-small topic-heading mb-4">
                Do you work with any budget?
              </h3>
              <p className="text-body-medium txt-clr-black">
                Yes! We work with clients across all budget ranges, from intimate gatherings to large-scale corporate events. We&apos;ll help you maximize your budget while creating an unforgettable experience.
              </p>
            </div>

            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-headline-small topic-heading mb-4">
                Can you handle virtual events?
              </h3>
              <p className="text-body-medium txt-clr-black">
                Absolutely! We specialize in both in-person and virtual events, including hybrid experiences that combine both formats. Our team has extensive experience with virtual platforms and engagement strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline-medium sm:text-headline-large section-heading-onColor mb-4 sm:mb-6 px-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-body-small sm:text-body-medium mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Let&apos;s discuss your event vision and turn it into reality. Our team is ready to bring your ideas to life.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:flex sm:flex-row sm:justify-center px-4">
            <Link href="/blogs">
              <CTAButton 
                variant="white-secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Blogs
              </CTAButton>
            </Link>
            <Link href="/our-work">
              <CTAButton 
                variant="white-secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Works
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
