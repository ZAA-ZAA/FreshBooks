// @ts-nocheck
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Menu, X, ChevronDown, Facebook, Twitter, Instagram, Youtube, HelpCircle, Globe } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-[80px] flex items-center justify-between">
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
             <div className="bg-fb-blue p-1.5 rounded-md shadow-sm">
                <div className="w-5 h-5 flex items-center justify-center text-white font-black text-xl leading-none">f</div>
             </div>
             <span className="text-2xl font-black text-fb-blue tracking-tight font-display">BookFlow</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="group relative flex items-center gap-1 cursor-pointer font-bold text-gray-700 hover:text-fb-blue text-sm transition-colors font-display">
                {item.label}
                {item.subItems && <ChevronDown size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />}
                
                {item.subItems && (
                  <div className="absolute top-[40px] left-0 bg-white shadow-xl border border-gray-100 p-6 hidden group-hover:block w-64 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="space-y-4">
                      {item.subItems.map(sub => (
                        <li key={sub} className="text-gray-600 hover:text-fb-blue cursor-pointer text-sm font-semibold">{sub}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <Link to="/pricing" className="font-bold text-gray-700 hover:text-fb-blue text-sm font-display">Pricing</Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* LOGIN - Always visible on mobile and desktop now */}
          <Link to="/login" className="text-sm font-bold text-fb-blue hover:text-fb-darkBlue hover:bg-blue-50 px-3 py-2 rounded-md transition-all whitespace-nowrap">
            Login
          </Link>
          
          {/* Buy/Try buttons - hidden on smallest mobile, visible from sm/md up */}
          <div className="hidden sm:flex items-center gap-3 md:gap-6">
            <button 
                onClick={() => navigate('/pricing')}
                className="bg-fb-green hover:brightness-110 text-white px-4 md:px-5 py-2.5 rounded font-bold text-sm transition-all shadow-sm"
            >
                Buy Now & Save
            </button>
            <button 
                onClick={() => navigate('/signup')}
                className="hidden md:block border-2 border-gray-900 text-gray-900 px-5 py-2 rounded font-bold text-sm hover:bg-gray-50 transition-all"
            >
                Try It Free
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-gray-600 p-1 hover:bg-gray-100 rounded-md" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 absolute w-full shadow-2xl animate-in slide-in-from-top duration-300 z-50">
          <nav className="flex flex-col p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            {/* Nav Categories */}
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="py-4 border-b border-gray-50 flex justify-between items-center group cursor-pointer">
                <span className="font-bold text-lg text-fb-navy group-hover:text-fb-blue">{item.label}</span>
                <ChevronDown size={18} className="text-gray-300" />
              </div>
            ))}
            <Link to="/pricing" onClick={() => setMobileOpen(false)} className="py-4 border-b border-gray-50 font-bold text-lg text-fb-navy">Pricing</Link>
            
            {/* Mobile CTAs */}
            <div className="flex flex-col gap-4 pt-8">
                <button onClick={() => { navigate('/pricing'); setMobileOpen(false); }} className="w-full bg-fb-green text-white py-4 rounded-md font-black text-lg shadow-md">Buy Now & Save</button>
                <button onClick={() => { navigate('/signup'); setMobileOpen(false); }} className="w-full border-2 border-fb-navy text-fb-navy py-4 rounded-md font-black text-lg">Try It Free</button>
                <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="w-full text-fb-blue py-4 rounded-md font-bold text-xl text-center hover:bg-blue-50 transition-colors">Login</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
                    <div className="flex items-center gap-2">
                         <div className="bg-fb-blue p-1.5 rounded-md">
                            <div className="w-5 h-5 flex items-center justify-center text-white font-black text-xl leading-none">f</div>
                         </div>
                         <span className="text-2xl font-black text-fb-navy tracking-tight font-display">BookFlow</span>
                    </div>
                    <div className="relative">
                        <button className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-bold text-gray-500 min-w-[180px] justify-between hover:bg-gray-50">
                            <span className="flex items-center gap-2"><Globe size={16} /> United States</span>
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-24">
                    {[
                        { title: 'Company', links: ['About', 'Customer Experience', 'Careers', 'Diversity and Inclusivity', 'Press Center', 'Contact', 'Blog'] },
                        { title: 'Product', links: ['Invoice Software', 'Expenses and Receipts', 'Accounting Software', 'Time Tracking', 'Managing Projects', 'Estimating Software', 'Online Payments', 'Financial Reports'] },
                        { title: 'Who It\'s For', links: ['Freelancers', 'Businesses With Contractors', 'Businesses With Employees', 'Self-Employed Professionals', 'Small Businesses', 'Accountants', 'Construction', 'Consultants'] },
                        { title: 'Partners', links: ['Integrations', 'Referral Program', 'Affiliate Program', 'Reseller Program', 'Developers'] },
                        { title: 'Helpful Links', links: ['Login', 'Support', 'Sitemap', 'QuickBooks Alternative', 'Support Webinars', 'Invoice Template', 'Accounting Templates', 'Tools'] },
                        { title: 'Policies', links: ['Accessibility', 'Privacy', 'Terms of Service', 'Security Safeguards'] },
                    ].map((section) => (
                        <div key={section.title}>
                            <h4 className="font-black text-sm text-fb-navy mb-6 uppercase tracking-wider font-display">{section.title}</h4>
                            <ul className="space-y-4 text-sm font-bold text-fb-blue">
                                {section.links.map(link => (
                                    <li key={link}><a href="#" className="hover:underline">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-12 border-t border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col lg:flex-row items-center gap-8 text-xs font-bold text-gray-400">
                        <p>© 2026 BookFlow</p>
                        <p className="flex items-center gap-1"><HelpCircle size={14} /> Call Toll Free: 1-888-674-3175</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex gap-4">
                             <div className="bg-gray-100 w-32 h-10 rounded-md flex items-center justify-center text-[10px] font-black text-gray-400 cursor-pointer">APP STORE</div>
                             <div className="bg-gray-100 w-32 h-10 rounded-md flex items-center justify-center text-[10px] font-black text-gray-400 cursor-pointer">GOOGLE PLAY</div>
                        </div>
                        <div className="flex gap-5 text-fb-navy">
                            <Facebook size={20} className="cursor-pointer hover:text-fb-blue transition-colors" />
                            <Twitter size={20} className="cursor-pointer hover:text-fb-blue transition-colors" />
                            <Youtube size={20} className="cursor-pointer hover:text-fb-blue transition-colors" />
                            <Instagram size={20} className="cursor-pointer hover:text-fb-blue transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-fb-slate bg-white">
      <Navbar />
      <main className="flex-grow mt-[80px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}