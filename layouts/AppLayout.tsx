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
        {/* Sidebar - VIBRANT FB BLUE DESIGN FROM SCREENSHOT */}
        <aside className={`w-[220px] bg-[#0075dd] text-white flex flex-col fixed md:relative h-full z-[60] md:z-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            {/* Top Identity Block */}
            <div className="bg-[#002a63]/20 p-4 border-b border-white/5 cursor-pointer hover:bg-[#002a63]/30 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest text-white/95 leading-tight">Demo</div>
                        <div className="text-[10px] font-bold text-white/60 uppercase tracking-tight">Owner</div>
                    </div>
                    <ChevronDown size={14} className="text-white/40" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll py-2">
                <nav className="space-y-0">
                    {SIDEBAR_ITEMS.map((item) => (
                        <div 
                            key={item.path}
                            onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                            className={`flex items-center px-4 py-3 cursor-pointer transition-colors relative group ${
                                isActiveLink(item.path)
                                ? 'bg-[#002a63] text-white font-bold' 
                                : 'text-white/80 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {isActiveLink(item.path) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f9c80e]"></div>}
                            <span className={`mr-3 ${isActiveLink(item.path) ? 'opacity-100' : 'opacity-60'}`}>{item.icon}</span>
                            <span className="text-[13px]">{item.label}</span>
                            {item.hasChevron && <ChevronDown size={12} className="ml-auto opacity-40 group-hover:opacity-60 transition-opacity" />}
                        </div>
                    ))}
                </nav>

                <div className="mt-4 px-4 border-t border-white/10 pt-4 space-y-4 pb-8">
                    {SIDEBAR_BOTTOM_ITEMS.map((item) => (
                        <div 
                          key={item.path} 
                          onClick={() => navigate(item.path)}
                          className="text-white/60 hover:text-white text-[12px] font-bold cursor-pointer transition-colors"
                        >
                          {item.label}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Sidebar Bottom branding */}
            <div className="p-6">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#0075dd] font-black text-2xl leading-none shadow-sm">f</div>
            </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
            <header className="h-16 bg-white border-b border-gray-100 flex-none flex items-center justify-end px-8 z-50">
                <button className="md:hidden text-[#002a63] p-2 mr-auto" onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu size={24} />
                </button>
                
                <div className="flex items-center gap-6 relative" ref={profileRef}>
                    <Search size={18} className="text-gray-400 cursor-pointer hover:text-[#002a63]" />
                    <Bell size={18} className="text-gray-400 cursor-pointer hover:text-[#002a63]" />
                    <HelpCircle size={18} className="text-gray-400 cursor-pointer hover:text-[#002a63]" />
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                        <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-[#0075dd] text-[11px]">JD</div>
                    </div>

                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded shadow-xl z-[100] py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                             <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                <p className="text-xs font-bold text-[#002a63]">John Doe</p>
                                <p className="text-[10px] text-gray-400">john.doe@demo.com</p>
                             </div>
                             <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsProfileOpen(false); navigate('/settings'); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer flex items-center gap-2 text-[#002a63] font-bold border-0 bg-transparent">
                                <User size={14} className="text-gray-400" /> My Profile
                             </button>
                             <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsProfileOpen(false); logout(); navigate('/login'); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer text-red-500 font-bold flex items-center gap-2 border-t border-gray-50 mt-1 border-0 bg-transparent">
                                <LogOut size={14} /> Log Out
                             </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scroll p-10 bg-white">
                <div className="max-w-[1100px] mx-auto">
                     <Outlet />
                </div>
            </main>
        </div>
      </div>

      {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[#002a63]/50 z-[55] md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
}
