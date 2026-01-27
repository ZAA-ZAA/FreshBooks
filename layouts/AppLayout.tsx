import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../constants';
import { Bell, Search, HelpCircle, ChevronDown, Crown, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../App';

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to determine active state including sub-routes
  const isActiveLink = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavClick = (path: string) => {
      navigate(path);
      setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen bg-[#f1f3f5] flex flex-col overflow-hidden font-sans">
       {/* Trial Banner - Fixed Height (40px) */}
       <div className="bg-white border-b border-gray-200 h-10 flex-none flex items-center justify-center text-xs relative z-50 shadow-sm">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center font-medium">
                <Crown size={14} className="mr-2 text-yellow-600 fill-current" />
                30 days left in your trial <span className="underline ml-1 cursor-pointer text-fb-blue">Upgrade Account</span>
            </div>
       </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}

        {/* Sidebar */}
        <aside 
            className={`
                w-[240px] bg-fb-blue text-white flex flex-col fixed md:relative h-full z-50 md:z-auto transition-transform duration-300 shadow-xl md:shadow-none
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
        >
            <div className="h-16 flex-none flex items-center px-4 bg-fb-darkBlue shadow-sm">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center font-bold mr-3 text-fb-blue text-xl shadow-sm">F</div>
                <div className="leading-tight flex-1">
                    <div className="font-bold text-sm truncate">Demo Company</div>
                    <div className="text-[10px] opacity-80 uppercase font-semibold tracking-wide">Owner</div>
                </div>
                <ChevronDown size={16} className="ml-2 opacity-70 cursor-pointer hover:opacity-100" />
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll py-2">
                <nav className="space-y-0.5 w-full pb-4">
                    {SIDEBAR_ITEMS.map((item) => (
                    <div key={item.path}>
                        <div 
                            onClick={() => handleNavClick(item.path)}
                            className={`flex items-center px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                                isActiveLink(item.path)
                                ? 'bg-[#005aab] border-[#3fd071]' 
                                : 'hover:bg-[#0066c0] border-transparent'
                            }`}
                        >
                            <span className="mr-3 opacity-90">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.label === 'Invoices' && isActiveLink(item.path) && (
                                <ChevronDown size={14} className="ml-auto" />
                            )}
                        </div>
                        {/* Submenu for Invoices */}
                        {item.label === 'Invoices' && isActiveLink(item.path) && (
                            <div className="bg-[#004e93] py-2 animate-in slide-in-from-top-1 duration-200">
                                <div className="px-12 py-2 text-xs hover:text-white text-blue-200 cursor-pointer">Recurring Templates</div>
                                <div className="px-12 py-2 text-xs hover:text-white text-blue-200 cursor-pointer">Retainers</div>
                            </div>
                        )}
                    </div>
                    ))}
                </nav>
            </div>
            
            {/* Sidebar Footer */}
            <div 
                onClick={logout}
                className="p-4 bg-[#004e93] text-xs text-blue-200 flex items-center justify-between cursor-pointer hover:text-white transition-colors hover:bg-[#004685]"
            >
                <span className="flex items-center"><LogOut size={14} className="mr-2" /> Log Out</span>
            </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f1f3f5]">
            {/* Top Header (64px) */}
            <header className="h-16 bg-white border-b border-gray-200 flex-none flex items-center justify-between px-4 md:px-8 z-20 shadow-sm">
                <div className="flex items-center">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="mr-4 md:hidden text-gray-500 hover:text-fb-blue transition-colors"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-fb-slate capitalize truncate">
                        {location.pathname.includes('new') ? '' : location.pathname.split('/')[1]?.replace('-', ' ') || 'Dashboard'}
                    </h1>
                </div>

                <div className="flex items-center space-x-3 md:space-x-6">
                    <Search className="text-gray-400 w-5 h-5 cursor-pointer hover:text-fb-blue transition-colors hidden md:block" />
                    <div className="relative group">
                         <Bell className="text-gray-400 w-5 h-5 cursor-pointer hover:text-fb-blue transition-colors" />
                         <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </div>
                    <HelpCircle className="text-gray-400 w-5 h-5 cursor-pointer hover:text-fb-blue transition-colors hidden md:block" />
                    <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm bg-fb-blue text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity">
                        JD
                    </div>
                </div>
            </header>

            {/* Page Content - Independent Scroll */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scroll relative w-full">
                <div className="max-w-[1200px] mx-auto h-full">
                     <Outlet />
                </div>
            </main>
        </div>
      </div>
    </div>
  );
}