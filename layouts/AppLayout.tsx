// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS, SIDEBAR_BOTTOM_ITEMS } from '../constants';
import { Bell, Search, ChevronDown, Menu, LogOut, User, HelpCircle } from 'lucide-react';
import { useAuth } from '../App';

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isActiveLink = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen bg-[#f5f7f9] flex flex-col overflow-hidden font-sans select-none">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - EXACT FB BLUE DESIGN FROM SCREENSHOT */}
        <aside className={`w-[220px] bg-fb-blue text-white flex flex-col fixed md:relative h-full z-[60] md:z-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            {/* Top Identity Block */}
            <div className="bg-[#002a63]/40 p-4 border-b border-white/5 cursor-pointer">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest text-white/95 leading-tight">Demo</div>
                        <div className="text-[10px] font-bold text-white/70">Owner</div>
                    </div>
                    <ChevronDown size={14} className="text-white/40" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll py-4">
                <nav className="space-y-0.5">
                    {SIDEBAR_ITEMS.map((item) => (
                        <div 
                            key={item.path}
                            onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                            className={`flex items-center px-4 py-2.5 cursor-pointer transition-colors relative group ${
                                isActiveLink(item.path)
                                ? 'bg-[#002a63] text-white font-bold' 
                                : 'text-white/90 hover:bg-white/10'
                            }`}
                        >
                            {isActiveLink(item.path) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-fb-yellow"></div>}
                            <span className={`mr-3 ${isActiveLink(item.path) ? 'opacity-100' : 'opacity-60'}`}>{item.icon}</span>
                            <span className="text-[13px]">{item.label}</span>
                            {item.hasChevron && <ChevronDown size={12} className="ml-auto opacity-40 group-hover:opacity-60 transition-opacity" />}
                        </div>
                    ))}
                </nav>

                <div className="mt-8 px-4 border-t border-white/10 pt-6 space-y-4">
                    {SIDEBAR_BOTTOM_ITEMS.map((item) => (
                        <div 
                          key={item.path} 
                          onClick={() => navigate(item.path)}
                          className="text-white/70 hover:text-white text-[12px] font-medium cursor-pointer transition-colors"
                        >
                          {item.label}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Sidebar Bottom Branding */}
            <div className="p-6 mt-auto">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-fb-blue font-black text-2xl leading-none">f</div>
            </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header className="h-16 bg-white border-b border-gray-200 flex-none flex items-center justify-end px-8 z-50">
                <button className="md:hidden text-fb-navy p-2 mr-auto" onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu size={24} />
                </button>
                
                <div className="flex items-center gap-6">
                    <Search size={18} className="text-gray-400 cursor-pointer hover:text-fb-navy" />
                    <Bell size={18} className="text-gray-400 cursor-pointer hover:text-fb-navy" />
                    <HelpCircle size={18} className="text-gray-400 cursor-pointer hover:text-fb-navy" />
                    <div className="flex items-center gap-2 cursor-pointer" ref={profileRef} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                        <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-fb-blue text-[11px]">JD</div>
                    </div>

                    {isProfileOpen && (
                        <div className="absolute right-8 top-[56px] w-56 bg-white border border-gray-200 rounded shadow-xl z-[100] py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                             <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                <p className="text-xs font-bold text-fb-navy">John Doe</p>
                                <p className="text-[10px] text-gray-400">john.doe@demo.com</p>
                             </div>
                             <div onClick={() => {navigate('/settings'); setIsProfileOpen(false);}} className="px-4 py-2 hover:bg-fb-gray text-sm cursor-pointer flex items-center gap-2 text-fb-navy font-bold">
                                <User size={14} className="text-gray-400" /> My Profile
                             </div>
                             <div onClick={logout} className="px-4 py-2 hover:bg-fb-gray text-sm cursor-pointer text-red-500 font-bold flex items-center gap-2 border-t border-gray-50 mt-1">
                                <LogOut size={14} /> Log Out
                             </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scroll p-10 bg-[#f5f7f9]">
                <div className="max-w-[1200px] mx-auto">
                     <Outlet />
                </div>
            </main>
        </div>
      </div>

      {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-fb-navy/50 z-[55] md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
}
