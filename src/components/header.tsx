'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse' }
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#5D7290]/10 bg-[#FFFFFF] dark:bg-[#0F0F0F] backdrop-blur-sm">
      <div className="max-w-[1280px] mx-auto px-4 flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90">
          <div className="rounded-lg bg-[#5865F2] p-1.5">
            <svg
              className="h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
            </svg>
          </div>
          <span className="hidden font-bold sm:inline-block text-[#0F0F0F] dark:text-white">
            Discord Clips
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#F9F9F9] dark:hover:bg-[#1A1B26] ${
                  pathname === link.href 
                    ? 'text-[#5865F2] bg-[#F9F9F9] dark:bg-[#1A1B26]' 
                    : 'text-[#606060] dark:text-[#AAAAAA] hover:text-[#0F0F0F] dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <select 
              onChange={(e) => window.location.href = e.target.value}
              value={pathname}
              className="input-field py-1 px-2 text-sm"
              suppressHydrationWarning
            >
              {navLinks.map((link) => (
                <option key={link.href} value={link.href}>
                  {link.label}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Button */}
          <div className="ml-4">
            <Link
              href="/upload"
              className="btn-primary hidden md:inline-flex items-center"
            >
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Upload
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
} 