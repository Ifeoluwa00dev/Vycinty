import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Send, Star } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A2E] text-white pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 decoration-none">
              <span className="w-8 h-8 bg-linear-to-tr from-[#FF5722] to-orange-400 rounded flex items-center justify-center text-white font-bold text-sm">
                V
              </span>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Vycinty<span className="text-[#FF5722]">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Discover local businesses in Ile-Ife and across other Nigerian cities. Supporting OAU students, residents, and local business owners with community reviews, instant directions, and claimable profiles.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF5722] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF5722] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF5722] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 font-mono">Platform</h3>
            <ul className="mt-4 space-y-2 text-xs text-gray-400 list-none pl-0">
              <li>
                <Link to="/" className="hover:text-white transition-colors decoration-none">Explore Cities</Link>
              </li>
              <li>
                <Link to="/register-business" className="hover:text-white transition-colors decoration-none">Add Your Business</Link>
              </li>
              <li>
                <Link to="/auth/signup" className="hover:text-white transition-colors decoration-none">Create Account</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors decoration-none">Owner Portal</Link>
              </li>
            </ul>
          </div>

          {/* Support / Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 font-mono">Ife Launch Team</h3>
            <p className="mt-4 text-xs text-gray-400 leading-relaxed">
              Based around OAU Campus Campus gate, Ede Road, Ile-Ife, Osun State, Nigeria.
            </p>
            <p className="mt-2 text-xs text-gray-300 font-medium">
              Email: support@vycinty.ng
            </p>
            <div className="mt-4 bg-gray-800/40 border border-gray-700/50 rounded-lg p-3 text-[11px] text-gray-400">
              <span className="text-[#FF5722] font-semibold flex items-center mb-1">
                <Star className="w-3.5 h-3.5 mr-1 fill-current" /> Seeding Live
              </span>
              Ile-Ife is fully seeded with 10 prime businesses for our launch phase.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2026 Vycinty. Built for Nigerian cities.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-white transition-colors cursor-pointer">About Ife</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
