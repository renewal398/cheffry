
import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-12">
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center gap-3">
              <img
                src="https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreigiwlkpkd5z3ge2o7m2lv4pykgvxd2toowpazhyo4iohc5u3prrae"
                alt="Cheffry Logo"
                className="h-8 md:h-10 w-auto object-contain"
              />
              <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[#111111]">Cheffry</span>
            </div>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Empowering home cooks with AI and community intelligence. Discover, cook, and share the flavors of the world.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#FF7A18] hover:bg-orange-50 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#FF7A18] hover:bg-orange-50 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#FF7A18] hover:bg-orange-50 transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-gray-400 text-xs md:text-sm">© 2025 Cheffry Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Built with Passion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
