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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch('/api/intellsys/logout', { method: 'POST' });
    router.push('/intellsys/login');
    router.refresh();
  };

  const navItems = [
    { name: 'CRM', href: '/intellsys/crm' },
    { name: 'Blogs', href: '/intellsys/blogs' },
    { name: 'Work', href: '/intellsys/our-work' },
    { name: 'Testimonials', href: '/intellsys/testimonials' },
    { name: 'Capabilities', href: '/intellsys/capabilities' },
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
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm md:text-body-medium transition-colors ${
                      isActive
                        ? 'bg-accent txt-clr-white'
                        : 'txt-clr-white hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

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
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

