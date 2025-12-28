
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3 glass shadow-sm' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src="https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreigiwlkpkd5z3ge2o7m2lv4pykgvxd2toowpazhyo4iohc5u3prrae"
            alt="Cheffry Logo"
            className="h-8 md:h-10 w-auto object-contain"
          />
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[#111111]">Cheffry</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-4 border-l border-gray-100 pl-8">
            <Link href="/login">
              <button className="text-sm font-semibold text-[#111111] hover:text-[#FF7A18] transition-colors px-4 py-2">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-[#FF7A18] hover:bg-[#e66e15] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-[60] transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <img
                src="https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreigiwlkpkd5z3ge2o7m2lv4pykgvxd2toowpazhyo4iohc5u3prrae"
                alt="Cheffry Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-extrabold text-[#111111]">Cheffry</span>
            </div>
            <button
  onClick={closeMenu}
  aria-label="Close menu"
  className="fixed top-6 right-6 z-[70] p-2 rounded-full bg-white shadow-md text-[#111111]"
>
  <X size={24} />
</button>
          </div>
          <div className="mt-auto flex flex-col gap-4">
            <Link href="/login">
              <button className="w-full py-4 text-center font-bold text-[#111111] border border-gray-200 rounded-2xl">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="w-full py-4 text-center font-bold text-white bg-[#FF7A18] rounded-2xl shadow-lg">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
