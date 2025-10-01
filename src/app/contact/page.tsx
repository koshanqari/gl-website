'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTAButton from '@/components/ui/CTAButton';

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

  // Pincode to State/City mapping for major Indian cities
  const pincodeMapping: { [key: string]: { state: string; city: string } } = {
    '110001': { state: 'Delhi', city: 'New Delhi' },
    '110002': { state: 'Delhi', city: 'New Delhi' },
    '110003': { state: 'Delhi', city: 'New Delhi' },
    '400001': { state: 'Maharashtra', city: 'Mumbai' },
    '400002': { state: 'Maharashtra', city: 'Mumbai' },
    '400003': { state: 'Maharashtra', city: 'Mumbai' },
    '560001': { state: 'Karnataka', city: 'Bangalore' },
    '560002': { state: 'Karnataka', city: 'Bangalore' },
    '560003': { state: 'Karnataka', city: 'Bangalore' },
    '600001': { state: 'Tamil Nadu', city: 'Chennai' },
    '600002': { state: 'Tamil Nadu', city: 'Chennai' },
    '600003': { state: 'Tamil Nadu', city: 'Chennai' },
    '700001': { state: 'West Bengal', city: 'Kolkata' },
    '700002': { state: 'West Bengal', city: 'Kolkata' },
    '700003': { state: 'West Bengal', city: 'Kolkata' },
    '380001': { state: 'Gujarat', city: 'Ahmedabad' },
    '380002': { state: 'Gujarat', city: 'Ahmedabad' },
    '380003': { state: 'Gujarat', city: 'Ahmedabad' },
    '500001': { state: 'Telangana', city: 'Hyderabad' },
    '500002': { state: 'Telangana', city: 'Hyderabad' },
    '500003': { state: 'Telangana', city: 'Hyderabad' },
    '110017': { state: 'Delhi', city: 'New Delhi' },
    '110018': { state: 'Delhi', city: 'New Delhi' },
    '110019': { state: 'Delhi', city: 'New Delhi' },
    '400004': { state: 'Maharashtra', city: 'Mumbai' },
    '400005': { state: 'Maharashtra', city: 'Mumbai' },
    '400006': { state: 'Maharashtra', city: 'Mumbai' },
    '560004': { state: 'Karnataka', city: 'Bangalore' },
    '560005': { state: 'Karnataka', city: 'Bangalore' },
    '560006': { state: 'Karnataka', city: 'Bangalore' },
    '600004': { state: 'Tamil Nadu', city: 'Chennai' },
    '600005': { state: 'Tamil Nadu', city: 'Chennai' },
    '600006': { state: 'Tamil Nadu', city: 'Chennai' },
    '700004': { state: 'West Bengal', city: 'Kolkata' },
    '700005': { state: 'West Bengal', city: 'Kolkata' },
    '700006': { state: 'West Bengal', city: 'Kolkata' },
    '380004': { state: 'Gujarat', city: 'Ahmedabad' },
    '380005': { state: 'Gujarat', city: 'Ahmedabad' },
    '380006': { state: 'Gujarat', city: 'Ahmedabad' },
    '500004': { state: 'Telangana', city: 'Hyderabad' },
    '500005': { state: 'Telangana', city: 'Hyderabad' },
    '500006': { state: 'Telangana', city: 'Hyderabad' },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-populate state and city when pincode is entered
      if (name === 'pincode' && value.length === 6) {
        const location = pincodeMapping[value];
        if (location) {
          newData.state = location.state;
          newData.city = location.city;
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
          <h1 className="text-display-medium sm:text-display-large txt-clr-white mb-4 sm:mb-6 px-4">
            Let&apos;s Plan Your Perfect Event
          </h1>
          <p className="text-body-medium sm:text-body-large txt-clr-white mb-6 sm:mb-8 max-w-3xl mx-auto px-4" style={{opacity: 0.9}}>
            Ready to create unforgettable experiences? Get in touch with our expert team and let&apos;s bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-clr-white shadow-lg p-4 sm:p-6 md:p-8">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-display-small sm:text-display-medium txt-clr-black mb-3 sm:mb-4">
                  Tell Us About Your Event
                </h2>
                <p className="text-body-medium sm:text-body-large txt-clr-black">
                  Fill out the form below and we&apos;ll get back to you with a customized proposal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="country" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
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
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      Pincode/ZIP Code
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter pincode"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="state" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      State/Province
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="">Select state</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Assam">Assam</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="Goa">Goa</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="">Select city</option>
                      <option value="New Delhi">New Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Lucknow">Lucknow</option>
                      <option value="Kanpur">Kanpur</option>
                      <option value="Nagpur">Nagpur</option>
                      <option value="Indore">Indore</option>
                      <option value="Thane">Thane</option>
                      <option value="Bhopal">Bhopal</option>
                      <option value="Visakhapatnam">Visakhapatnam</option>
                      <option value="Pimpri-Chinchwad">Pimpri-Chinchwad</option>
                      <option value="Patna">Patna</option>
                      <option value="Vadodara">Vadodara</option>
                      <option value="Ghaziabad">Ghaziabad</option>
                      <option value="Ludhiana">Ludhiana</option>
                      <option value="Agra">Agra</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Faridabad">Faridabad</option>
                      <option value="Meerut">Meerut</option>
                      <option value="Rajkot">Rajkot</option>
                      <option value="Kalyan-Dombivali">Kalyan-Dombivali</option>
                      <option value="Vasai-Virar">Vasai-Virar</option>
                      <option value="Varanasi">Varanasi</option>
                      <option value="Srinagar">Srinagar</option>
                      <option value="Aurangabad">Aurangabad</option>
                      <option value="Navi Mumbai">Navi Mumbai</option>
                      <option value="Solapur">Solapur</option>
                      <option value="Vadodara">Vadodara</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="eventType" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      Event Type *
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
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
                  </div>
                  <div>
                    <label htmlFor="eventDate" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      Preferred Event Date
                    </label>
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="budget" className="block text-body-medium font-semibold txt-clr-black mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="over-100k">Over $100,000</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="guestCount" className="block text-body-medium font-semibold txt-clr-black mb-2">
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
                  <label htmlFor="message" className="block text-body-medium font-semibold txt-clr-black mb-2">
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
                  variant="golden-primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </CTAButton>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              <div className="bg-clr-white shadow-lg p-4 sm:p-6 md:p-8">
                <h3 className="text-headline-small sm:text-display-small txt-clr-black mb-4 sm:mb-6">
                  Get In Touch
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary mt-1 mr-4"></div>
                    <div>
                      <h4 className="text-body-large font-semibold txt-clr-black mb-1">
                        Phone
                      </h4>
                      <p className="text-body-medium txt-clr-black">
                        (555) 123-4567
                      </p>
                      <p className="text-body-small text-muted-on-light">
                        Mon-Fri 9AM-6PM EST
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary mt-1 mr-4"></div>
                    <div>
                      <h4 className="text-body-large font-semibold txt-clr-black mb-1">
                        Email
                      </h4>
                      <p className="text-body-medium txt-clr-black">
                        hello@goldenlotusevents.com
                      </p>
                      <p className="text-body-small text-muted-on-light">
                        We respond within 24 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary mt-1 mr-4"></div>
                    <div>
                      <h4 className="text-body-large font-semibold txt-clr-black mb-1">
                        Office
                      </h4>
                      <p className="text-body-medium txt-clr-black">
                        123 Event Planning Ave<br />
                        Suite 100<br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-clr-white shadow-lg p-8">
                <h3 className="text-display-small txt-clr-black mb-6">
                  Why Choose Golden Lotus?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-black">
                      Over 500 successful events delivered
                    </span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-black">
                      Full-service event management
                    </span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-black">
                      Custom solutions for every budget
                    </span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-black">
                      24/7 support throughout your event
                    </span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-black">
                      Award-winning creative team
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Heading */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-clr-neutral-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-headline-large sm:text-display-small md:text-display-medium lg:text-display-large txt-clr-white text-center">
            Frequently Asked Questions
          </h2>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 sm:py-12 md:py-16 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-body-medium sm:text-body-large txt-clr-black max-w-2xl mx-auto px-4">
              Get answers to common questions about our event planning services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-display-small txt-clr-black mb-4">
                How far in advance should I book?
              </h3>
              <p className="text-body-medium txt-clr-black">
                We recommend booking at least 3-6 months in advance for large events, though we can accommodate shorter timelines for smaller gatherings. Popular dates and venues book quickly, so early planning ensures the best options.
              </p>
            </div>

            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-display-small txt-clr-black mb-4">
                What&apos;s included in your services?
              </h3>
              <p className="text-body-medium txt-clr-black">
                Our full-service approach includes venue selection, vendor coordination, design and décor, catering management, entertainment booking, day-of coordination, and post-event follow-up. We tailor our services to your specific needs.
              </p>
            </div>

            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-display-small txt-clr-black mb-4">
                Do you work with any budget?
              </h3>
              <p className="text-body-medium txt-clr-black">
                Yes! We work with clients across all budget ranges, from intimate gatherings to large-scale corporate events. We&apos;ll help you maximize your budget while creating an unforgettable experience.
              </p>
            </div>

            <div className="bg-clr-white shadow-lg p-8">
              <h3 className="text-display-small txt-clr-black mb-4">
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
      <section className="py-8 sm:py-12 md:py-16 txt-clr-white bg-clr-secondary-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-small sm:text-display-medium txt-clr-white mb-4 sm:mb-6 px-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-body-medium sm:text-body-large txt-clr-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Let&apos;s discuss your event vision and turn it into reality. Our team is ready to bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <CTAButton 
              variant="white-secondary"
              size="lg"
            >
              Start Planning Today
            </CTAButton>
            <CTAButton 
              variant="white-secondary"
              size="lg"
            >
              View Our Portfolio
            </CTAButton>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
