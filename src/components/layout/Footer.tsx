import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Capabilities', href: '/capabilities' },
    { name: 'Work', href: '/our-work' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact Us', href: '/contact-us' },
  ]

  const socialLinks = [
    { name: 'LinkedIn', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'Facebook', href: '#' },
  ]

  return (
    <footer className="txt-clr-white primary-section-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Golden Lotus Column */}
          <div>
            <h3 className="text-body-large font-semibold mb-4 footer-heading">Golden Lotus</h3>
            <p className="text-body-medium/90 mb-4">
              India&apos;s leading MICE and Experience Marketing Agency, delivering events with measurable impact.
            </p>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-body-large font-semibold mb-4 footer-heading">Services</h3>
            <ul className="space-y-2">
              <li><span className="text-body-medium/90">MICE Events</span></li>
              <li><span className="text-body-medium/90">Experiential Marketing</span></li>
              <li><span className="text-body-medium/90">Corporate Events</span></li>
              <li><span className="text-body-medium/90">Event Management</span></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-body-large font-semibold mb-4 footer-heading">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about-us"
                  className="text-body-medium/90 hover:txt-clr-white transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/our-work"
                  className="text-body-medium/90 hover:txt-clr-white transition-colors duration-200"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-body-medium/90 hover:txt-clr-white transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
              <li><span className="text-body-medium/90">Careers</span></li>
            </ul>
          </div>

          {/* Get In Touch Column */}
          <div>
            <h3 className="text-body-large font-semibold mb-4 footer-heading">Get In Touch</h3>
            <div className="space-y-2 text-body-medium/90">
              <p>Email: info@goldenlotus.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Address: Mumbai, India</p>
            </div>
          </div>
        </div>

        {/* Middle Section - Partner Logos */}
        <div className="border-t border-white/20 pt-6 pb-6">
          <div className="w-full py-16 sm:py-8 grid grid-flow-col gap-4 place-items-center place-content-between">
            <div className="w-[80px] sm:w-[184px]">
              <div className="!text-[10px] sm:!text-[16px] font-medium leading-[8px] text-[#FFF] text-left mb-1">Powered by</div>
              <a href="https://www.intellsys.ai/" target="_blank">
                <img alt="" className="w-full" src="https://cdn-sleepyhug-prod.b-cdn.net/media/intellsys-logo.webp" />
              </a>
            </div>
            <div className="w-[80px] sm:w-[184px]">
              <div className="!text-[10px] sm:!text-[16px] font-medium leading-[8px] text-[#FFF] text-left mb-1">Build with</div>
              <a href="https://www.growthjockey.com/" target="_blank">
                <img 
                  alt="" 
                  className="w-full" 
                  src="https://golden-lotus-prod.b-cdn.net/components/ottocloud.webp" 
                  style={{
                    backgroundColor: 'transparent',
                    mixBlendMode: 'screen'
                  }}
                />
              </a>
            </div>
            <div className="w-[80px] sm:w-[184px]">
              <div className="!text-[10px] sm:!text-[16px] font-medium leading-[8px] text-[#FFF] text-left mb-1">Ventured by</div>
              <a href="https://www.growthjockey.com/" target="_blank">
                <img alt="" className="w-full" src="https://cdn-sleepyhug-prod.b-cdn.net/media/growth-jockey-logo.webp" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Logo, Social Media & Copyright */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-clr-primary">
                <span className="txt-clr-white font-bold text-sm">GL</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-body-medium/90">
              © {currentYear} Golden Lotus. All rights reserved.
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="txt-clr-white/90 hover:txt-clr-white transition-colors duration-200"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {social.name === 'LinkedIn' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )}
                    {social.name === 'Instagram' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                      </svg>
                    )}
                    {social.name === 'Facebook' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
