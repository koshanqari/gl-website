'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import CTAButton from '@/components/ui/CTAButton'

type NavbarProps = {
  transparent?: boolean
}

const Navbar = ({ transparent = false }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Work', href: '/our-work' },
    { name: 'Capabilities', href: '/capabilities' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'About Us', href: '/about-us' },
  ]

  return (
    <nav className={`${transparent ? 'bg-transparent absolute top-0 left-0 right-0 z-50 pt-3 sm:pt-4' : 'bg-white shadow-sm sticky top-0 z-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className={`text-2xl ${transparent ? 'text-white' : 'logo-text'}`}>
              Golden Lotus
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-body-medium ${transparent ? 'text-white/90 hover:text-white' : 'nav-link'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Link href="/contact">
              <CTAButton variant={transparent ? 'white-secondary' : 'accent-primary'} size="lg">
                Plan My Event
              </CTAButton>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 sm:space-x-4">
            <Link href="/contact">
              <CTAButton variant={transparent ? 'white-secondary' : 'accent-primary'} size="md">
                Plan My Event
              </CTAButton>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${transparent ? 'text-white' : 'nav-menu-button'} focus:outline-none`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${transparent ? 'bg-black/60 backdrop-blur border-t border-white/10' : 'bg-white border-t'}`}>
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-3 text-body-medium ${transparent ? 'text-white/90 hover:text-white' : 'nav-link'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
