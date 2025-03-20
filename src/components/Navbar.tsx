
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Menu, X, ShoppingBag, Search, Settings as SettingsIcon } from 'lucide-react';
import Settings from './Settings';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Products', href: '#products' },
  { label: 'Collections', href: '#collections' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <h1 className="text-xl font-semibold text-primary">RetailNext</h1>
            </a>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-900 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="p-2 rounded-full text-gray-700 hover:bg-secondary transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-full text-gray-700 hover:bg-secondary transition-colors"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-full text-gray-700 hover:bg-secondary transition-colors"
              aria-label="Settings"
              onClick={() => setIsSettingsOpen(true)}
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-secondary focus:outline-none transition-colors"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">
                {isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              </span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out z-40',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none -translate-y-4'
        )}
      >
        <div className="pt-24 pb-6 px-6 h-full flex flex-col">
          <nav className="flex flex-col space-y-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base font-medium text-gray-900 hover:text-primary"
                onClick={toggleMobileMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 flex flex-col space-y-4">
            <Button variant="ghost" fullWidth>
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
            <Button variant="ghost" fullWidth>
              <ShoppingBag className="h-5 w-5 mr-2" />
              Cart
            </Button>
            <Button variant="ghost" fullWidth onClick={() => {
              setIsSettingsOpen(true);
              setIsMobileMenuOpen(false);
            }}>
              <SettingsIcon className="h-5 w-5 mr-2" />
              Settings
            </Button>
            <Button variant="primary" fullWidth>
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Settings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </header>
  );
};

export default Navbar;
