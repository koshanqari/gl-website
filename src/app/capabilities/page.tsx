import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CTAButton from '@/components/ui/CTAButton'

export default function CapabilitiesPage() {
  const capabilities = [
    {
      id: 1,
      title: 'Event Strategy & Conceptualization',
      shortTitle: 'Event Strategy',
      description: 'Defining event objectives, theme, and target outcomes',
      features: [
        'Strategic event planning and objective setting',
        'Theme development and creative conceptualization',
        'Target audience analysis and engagement strategy'
      ],
      icon: '🎯'
    },
    {
      id: 2,
      title: 'Venue & Logistics Management',
      shortTitle: 'Venue & Logistics',
      description: 'Comprehensive venue selection and logistics coordination',
      features: [
        'Venue scouting, negotiation, and booking',
        'Logistics planning and coordination',
        'Space optimization and layout design'
      ],
      icon: '🏛️'
    },
    {
      id: 3,
      title: 'Audio-Visual & Technical Production',
      shortTitle: 'AV & Technical',
      description: 'Professional audio-visual setup and technical support',
      features: [
        'Audio-visual equipment setup and management',
        'Technical production and live streaming',
        'Sound, lighting, and multimedia coordination'
      ],
      icon: '🎬'
    },
    {
      id: 4,
      title: 'Vendor & Supplier Coordination',
      shortTitle: 'Vendor Management',
      description: 'End-to-end vendor sourcing and coordination',
      features: [
        'Vendor sourcing and selection',
        'Contract management and quality assurance',
        'Supplier coordination and performance monitoring'
      ],
      icon: '🤝'
    },
    {
      id: 5,
      title: 'Registration, Guest Management & Hospitality',
      shortTitle: 'Guest Management',
      description: 'Complete guest experience from registration to hospitality',
      features: [
        'Registration system setup and management',
        'Guest experience and hospitality services',
        'RSVP management and attendee coordination'
      ],
      icon: '👥'
    },
    {
      id: 6,
      title: 'Marketing, Communication & Engagement',
      shortTitle: 'Marketing & Engagement',
      description: 'Strategic marketing and audience engagement',
      features: [
        'Event marketing and promotional campaigns',
        'Communication strategy and content creation',
        'Audience engagement and interaction programs'
      ],
      icon: '📢'
    }
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
            alt="Event Management Capabilities"
            fill
            className="object-cover"
            sizes="100vw"
            quality={95}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-display-large txt-clr-white mb-6">
              Our Capabilities
            </h1>
            <p className="text-body-large txt-clr-white mb-8 drop-shadow-md">
              Comprehensive event solutions designed to deliver exceptional experiences and measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 bg-clr-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-body-large txt-clr-neutral max-w-3xl mx-auto">
              Comprehensive event management services designed to deliver exceptional experiences and measurable results.
            </p>
          </div>

          {/* Event Strategy & Conceptualization Service */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="relative h-[550px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Event Strategy & Conceptualization"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  quality={95}
                />
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <div className="p-6 txt-clr-white">
                    <h3 className="text-display-small mb-2">Defining event objectives, theme, and target outcomes</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-clr-white shadow-lg p-8 h-[550px] flex flex-col">
                <div className="mb-4">
                  <span className="bg-primary txt-clr-white px-3 py-1 text-body-medium font-semibold">
                    Event Strategy
                  </span>
                </div>
                <h3 className="text-display-small txt-clr-black mb-4">
                  Event Strategy & Conceptualization
                </h3>
                <p className="text-body-large txt-clr-neutral mb-6">
                  Our strategic approach ensures every event is built on a solid foundation of clear objectives, compelling themes, and measurable outcomes that align with your business goals.
                </p>
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Strategic event planning and objective setting</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Theme development and creative conceptualization</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Target audience analysis and engagement strategy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Venue & Logistics Management Service */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="bg-clr-white shadow-lg p-8 h-[550px] flex flex-col">
                <div className="mb-4">
                  <span className="bg-primary txt-clr-white px-3 py-1 text-body-medium font-semibold">
                    Venue & Logistics
                  </span>
                </div>
                <h3 className="text-display-small txt-clr-black mb-4">
                  Venue & Logistics Management
                </h3>
                <p className="text-body-large txt-clr-neutral mb-6">
                  We handle all aspects of venue selection and logistics coordination to ensure your event runs smoothly from planning to execution, with meticulous attention to every detail.
                </p>
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Venue scouting, negotiation, and booking</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Logistics planning and coordination</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Space optimization and layout design</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="relative h-[550px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1688269910939-4c36b34402b0?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
                  alt="Venue & Logistics Management"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  quality={95}
                />
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <div className="p-6 txt-clr-white">
                    <h3 className="text-display-small mb-2">Comprehensive venue selection and logistics coordination</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio-Visual & Technical Production Service */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="relative h-[550px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1595020738512-66672a9d72a9?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
                  alt="Audio-Visual & Technical Production"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  quality={95}
                />
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <div className="p-6 txt-clr-white">
                    <h3 className="text-display-small mb-2">Professional audio-visual setup and technical support</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-clr-white shadow-lg p-8 h-[550px] flex flex-col">
                <div className="mb-4">
                  <span className="bg-primary txt-clr-white px-3 py-1 text-body-medium font-semibold">
                    AV & Technical
                  </span>
                </div>
                <h3 className="text-display-small txt-clr-black mb-4">
                  Audio-Visual & Technical Production
                </h3>
                <p className="text-body-large txt-clr-neutral mb-6">
                  Our technical expertise ensures flawless audio-visual experiences with cutting-edge equipment, professional setup, and seamless execution for all your event needs.
                </p>
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Audio-visual equipment setup and management</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Technical production and live streaming</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Sound, lighting, and multimedia coordination</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor & Supplier Coordination Service */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="bg-clr-white shadow-lg p-8 h-[550px] flex flex-col">
                <div className="mb-4">
                  <span className="bg-primary txt-clr-white px-3 py-1 text-body-medium font-semibold">
                    Vendor Management
                  </span>
                </div>
                <h3 className="text-display-small txt-clr-black mb-4">
                  Vendor & Supplier Coordination
                </h3>
                <p className="text-body-large txt-clr-neutral mb-6">
                  We manage your entire vendor ecosystem with strategic sourcing, quality assurance, and seamless coordination to ensure every element of your event meets the highest standards.
                </p>
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Vendor sourcing and selection</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Contract management and quality assurance</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Supplier coordination and performance monitoring</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="relative h-[550px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
                  alt="Vendor & Supplier Coordination"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  quality={95}
                />
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <div className="p-6 txt-clr-white">
                    <h3 className="text-display-small mb-2">End-to-end vendor sourcing and coordination</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration, Guest Management & Hospitality Service */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="relative h-[550px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
                  alt="Registration, Guest Management & Hospitality"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  quality={95}
                />
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <div className="p-6 txt-clr-white">
                    <h3 className="text-display-small mb-2">Complete guest experience from registration to hospitality</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-clr-white shadow-lg p-8 h-[550px] flex flex-col">
                <div className="mb-4">
                  <span className="bg-primary txt-clr-white px-3 py-1 text-body-medium font-semibold">
                    Guest Management
                  </span>
                </div>
                <h3 className="text-display-small txt-clr-black mb-4">
                  Registration, Guest Management & Hospitality
                </h3>
                <p className="text-body-large txt-clr-neutral mb-6">
                  We create exceptional guest experiences from the moment they register through the entire event journey, ensuring every interaction reflects your brand&apos;s commitment to excellence.
                </p>
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Registration system setup and management</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Guest experience and hospitality services</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">RSVP management and attendee coordination</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marketing, Communication & Engagement Service */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="bg-clr-white shadow-lg p-8 h-[550px] flex flex-col">
                <div className="mb-4">
                  <span className="bg-primary txt-clr-white px-3 py-1 text-body-medium font-semibold">
                    Marketing & Engagement
                  </span>
                </div>
                <h3 className="text-display-small txt-clr-black mb-4">
                  Marketing, Communication & Engagement
                </h3>
                <p className="text-body-large txt-clr-neutral mb-6">
                  We develop comprehensive marketing strategies and engagement programs that build anticipation, drive attendance, and create lasting connections with your target audience.
                </p>
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Event marketing and promotional campaigns</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Communication strategy and content creation</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary mt-2 mr-3"></div>
                    <span className="text-body-medium txt-clr-neutral">Audience engagement and interaction programs</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="relative h-[550px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
                  alt="Marketing, Communication & Engagement"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  quality={95}
                />
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <div className="p-6 txt-clr-white">
                    <h3 className="text-display-small mb-2">Strategic marketing and audience engagement</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 txt-clr-white bg-clr-secondary-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-medium txt-clr-white mb-6">
            Ready to Plan Your Next Event?
          </h2>
          <p className="text-body-large txt-clr-white/90 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how we can bring your vision to life with our comprehensive event management capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton variant="white-primary" size="lg">
              Get Started Today
            </CTAButton>
            <CTAButton variant="white-secondary" size="lg">
              View Our Portfolio
            </CTAButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}