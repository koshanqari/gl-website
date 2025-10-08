'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch('/api/intellsys/logout', { method: 'POST' });
    router.push('/intellsys/login');
    router.refresh();
  };

  const navItems = [
    { name: 'CRM', href: '/intellsys/crm', alwaysVisible: true },
    { name: 'Media', href: '/intellsys/media', alwaysVisible: false },
    { name: 'Work', href: '/intellsys/our-work', alwaysVisible: false },
    { name: 'Testimonials', href: '/intellsys/testimonials', alwaysVisible: false },
    { name: 'Blogs', href: '/intellsys/blogs', alwaysVisible: false },
    { name: 'Capabilities', href: '/intellsys/capabilities', alwaysVisible: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-clr-secondary-medium border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a 
                href="https://www.intellsys.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center mr-2 sm:mr-3"
              >
                <img 
                  alt="Intellsys" 
                  className="h-6 sm:h-8 w-auto" 
                  src="https://cdn-sleepyhug-prod.b-cdn.net/media/intellsys-logo.webp" 
                />
              </a>
              <Link href="/intellsys/crm" className="text-xs sm:text-body-medium txt-clr-white px-2 sm:px-3 py-1 bg-primary rounded">
                Admin
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              {/* Desktop: Show all links */}
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`hidden md:block px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm md:text-body-medium transition-colors ${
                      isActive
                        ? 'bg-accent txt-clr-white'
                        : 'txt-clr-white hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile: Show only CRM */}
              <Link
                href="/intellsys/crm"
                className={`md:hidden px-3 py-2 rounded-md text-sm transition-colors ${
                  pathname?.startsWith('/intellsys/crm')
                    ? 'bg-accent txt-clr-white'
                    : 'txt-clr-white hover:bg-gray-700'
                }`}
              >
                CRM
              </Link>

              {/* Mobile: Burger Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden px-3 py-2 txt-clr-white hover:bg-gray-700 rounded-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm md:text-body-medium txt-clr-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-700 py-2">
              {navItems.filter(item => !item.alwaysVisible).map((item) => {
                const isActive = pathname?.startsWith(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-accent txt-clr-white'
                        : 'txt-clr-white hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

