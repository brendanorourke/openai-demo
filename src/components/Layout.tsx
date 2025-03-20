
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">RetailNext</h3>
              <p className="text-sm text-gray-600 mb-4">
                AI-powered shopping assistant revolutionizing how you discover and match clothing.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Men</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Women</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Collections</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Press</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Cookies</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm text-center text-gray-600">
              © {new Date().getFullYear()} RetailNext. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
