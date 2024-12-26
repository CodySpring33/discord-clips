'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2D2F3E] dark:bg-[#1A1B26] text-[#606060] dark:text-[#AAAAAA]">
      <div className="max-w-[1280px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[#0F0F0F] dark:text-white font-bold text-lg mb-4">Discord Clips</h3>
            <p className="text-sm">
              The best platform for sharing and discovering gaming moments from Discord. Save, share, and relive your favorite gaming memories.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-[#0F0F0F] dark:text-white font-bold text-lg mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/upload" className="hover:text-[#5865F2] transition-colors">
                  Upload Clips
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-[#5865F2] transition-colors">
                  Browse Videos
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#5865F2] transition-colors">
                  Your Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[#0F0F0F] dark:text-white font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-[#5865F2] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#5865F2] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-[#5865F2] transition-colors">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-[#5D7290]/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {currentYear} Discord Clips. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="https://discord.gg/discordclips" className="text-sm hover:text-[#5865F2] transition-colors">
                Join our Discord
              </Link>
              <Link href="https://twitter.com/discordclips" className="text-sm hover:text-[#5865F2] transition-colors">
                Twitter
              </Link>
              <Link href="https://github.com/discordclips" className="text-sm hover:text-[#5865F2] transition-colors">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 