import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Menu, X, ChevronDown, CheckCircle2 } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
        {/* Logo & Desktop Nav */}
        <div className="flex items-center h-full">
          <Link to="/" className="flex items-center mr-8">
             {/* Simple SVG Logo approximation */}
             <div className="w-8 h-8 bg-fb-blue rounded-full mr-2 flex items-center justify-center text-white font-bold text-lg">f</div>
             <span className="text-xl font-bold text-fb-slate tracking-tight">freshbooks</span>
          </Link>

          <nav className="hidden lg:flex h-full">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="group relative h-full flex items-center px-4 cursor-pointer text-sm font-medium text-gray-600 hover:text-fb-blue transition-colors">
                <span className="flex items-center">
                  {item.label}
                  {item.subItems && <ChevronDown size={14} className="ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />}
                </span>
                
                {/* Mega Menu Dropdown */}
                {item.subItems && (
                  <div className="absolute top-[72px] left-0 bg-white shadow-xl border-t border-gray-100 p-6 hidden group-hover:block w-64 rounded-b-lg animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="space-y-3">
                      {item.subItems.map(sub => (
                        <li key={sub} className="text-gray-600 hover:text-fb-blue cursor-pointer text-sm">{sub}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <button 
            onClick={() => navigate('/signup')} 
            className="text-sm font-semibold text-fb-blue hover:underline"
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-fb-green hover:bg-fb-darkGreen text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md"
          >
            Try It Free
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 absolute w-full shadow-lg">
          <nav className="flex flex-col space-y-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="py-2 border-b border-gray-100 last:border-0">
                <span className="font-semibold text-gray-700">{item.label}</span>
              </div>
            ))}
            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-fb-blue text-white py-3 rounded-md font-bold mt-4"
            >
              Try It Free
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-fb-slate text-white pt-16 pb-8">
    <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((col) => (
        <div key={col} className="space-y-4">
          <h4 className="font-bold text-lg mb-4">Section {col}</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {['Invoicing', 'Expenses', 'Time Tracking', 'Projects', 'Payments'].map((link) => (
              <li key={link}><a href="#" className="hover:text-white hover:underline">{link}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
      <p>© 2024 FreshBooks. All rights reserved.</p>
      <div className="flex space-x-6 mt-4 md:mt-0">
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
      </div>
    </div>
  </footer>
);

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-fb-slate bg-white">
      <Navbar />
      <main className="flex-grow mt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}