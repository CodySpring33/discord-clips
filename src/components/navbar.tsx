'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold gradient-text">Discord Clips</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`nav-link ${pathname === '/' ? 'text-white' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/videos" 
              className={`nav-link ${pathname === '/videos' ? 'text-white' : ''}`}
            >
              Videos
            </Link>
            <Link 
              href="/upload" 
              className="button-primary"
            >
              Upload Video
            </Link>
          </div>

          <div className="md:hidden">
            <Link 
              href="/upload" 
              className="button-primary"
            >
              Upload
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 