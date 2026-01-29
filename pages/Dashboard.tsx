// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Users, FileText, ChevronDown, Receipt, Calculator, Pencil, X, Landmark, Gift, MailOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [createNewOpen, setCreateNewOpen] = useState(false);
  const createNewRef = useRef(null);
  
  const [stats, setStats] = useState({ received: 0, outstanding: 0, spent: 0, overdue: 0 });

  useEffect(() => {
    const invoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
    const expenses = JSON.parse(localStorage.getItem('fb_expenses') || '[]');
    const payments = JSON.parse(localStorage.getItem('fb_payments') || '[]');

    const received = payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
    const outstanding = invoices.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0);
    const overdue = invoices.filter(i => i.status === 'Overdue').reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0);
    const spent = expenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);

    setStats({ received, outstanding, spent, overdue });

    const handleClickOutside = (event: MouseEvent) => {
        if (createNewRef.current && !createNewRef.current.contains(event.target)) {
            setCreateNewOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const revenueData = [
    { name: '0', val: 0, type: 'outstanding' },
    { name: '2k', val: 1500, type: 'outstanding' },
    { name: '4k', val: 3200, type: 'overdue' },
    { name: '6k', val: 4500, type: 'outstanding' },
    { name: '8k', val: 6200, type: 'outstanding' },
    { name: '10k', val: 8100, type: 'outstanding' },
  ];

  const createMenuItems = [
    { label: 'Client', icon: <Users size={16} />, path: '/clients/new' },
    { label: 'Invoice', icon: <FileText size={16} />, path: '/invoices/new' },
    { label: 'Expense', icon: <Receipt size={16} />, path: '/expenses/new' },
    { label: 'Estimate', icon: <Calculator size={16} />, path: '/estimates/new' },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-10 font-sans">
      {/* 50% Off Ribbon from screenshot */}
      <div className="bg-white border border-blue-100 rounded-lg p-3 flex items-center justify-center gap-4 mb-10 shadow-sm relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0075dd]"></div>
          <div className="text-gray-400 text-xs italic flex items-center gap-2">
             <span className="text-fb-blue opacity-50">✨</span> 50% Off For 3 Months
          </div>
          <button className="bg-[#0075dd] text-white px-4 py-1.5 rounded font-black text-xs hover:bg-[#005aab] transition-all">Upgrade Now</button>
          <div className="ml-4 opacity-30 group-hover:opacity-50 transition-opacity">
             <MailOpen size={24} className="text-fb-blue" />
          </div>
      </div>

      <div className="flex justify-between items-end mb-10">
          <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-[#2d3a4b]">Dashboard</h1>
              <Pencil size={18} className="text-gray-300 cursor-pointer hover:text-[#0075dd] mt-1" />
          </div>
          
          <div className="flex items-center gap-8">
              <button className="text-[15px] font-bold text-[#556d82] hover:text-[#0075dd]">Add Team Member</button>
              <div className="relative" ref={createNewRef}>
                  <button 
                    onClick={() => setCreateNewOpen(!createNewOpen)}
                    className="bg-[#00a651] hover:bg-[#008541] text-white px-6 py-2.5 rounded font-black text-lg flex items-center shadow-md transition-all"
                  >
                    Create New... <ChevronDown size={22} className={`ml-2 transition-transform ${createNewOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {createNewOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded shadow-xl z-[100] py-1">
                             {createMenuItems.map((item) => (
                                 <div 
                                    key={item.label} 
                                    className="px-4 py-2.5 hover:bg-gray-50 flex items-center space-x-3 cursor-pointer" 
                                    onClick={() => { setCreateNewOpen(false); navigate(item.path); }}
                                 >
                                     <div className="text-gray-400">{item.icon}</div>
                                     <span className="text-sm font-bold text-[#002a63]">{item.label}</span>
                                 </div>
                             ))}
                      </div>
                  )}
              </div>
          </div>
      </div>

      <div className="mb-10">
          <h2 className="text-xl font-bold text-[#2d3a4b] mb-8">Welcome, John! Here's how to get the most out of FreshBooks.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Promo Card 1 - A Faster Way... */}
              <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col relative group">
                  <div className="h-44 bg-[#fff9f1] flex items-center justify-center relative">
                      <button className="absolute top-3 right-3 text-gray-300 hover:text-gray-500"><X size={16} /></button>
                      <div className="flex items-center">
                          <div className="w-24 h-24 bg-[#0075dd] rounded-full border-[6px] border-white shadow-xl flex items-center justify-center z-10">
                              <Landmark className="text-white" size={40} />
                          </div>
                          <div className="w-24 h-24 bg-white border border-gray-100 rounded-full shadow-md -ml-12 opacity-80"></div>
                      </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col items-center text-center">
                      <h3 className="font-bold text-[#2d3a4b] text-lg mb-3 leading-tight">A Faster Way to Pull in Your Expense Data</h3>
                      <p className="text-[#556d82] text-sm leading-relaxed mb-10 max-w-xs">See all your business expenses at a glance by connecting FreshBooks with your bank to automatically track your transactions.</p>
                      <button className="w-full max-w-[280px] py-2.5 border-2 border-[#002a63] text-[#002a63] rounded font-black text-sm hover:bg-[#002a63] hover:text-white transition-all">Connect Your Bank</button>
                  </div>
              </div>

              {/* Promo Card 2 - Spread the word... */}
              <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col relative group">
                  <div className="h-44 bg-[#e6f4ff] flex items-center justify-center relative">
                      <button className="absolute top-3 right-3 text-gray-300 hover:text-gray-500"><X size={16} /></button>
                      <div className="flex items-center">
                          <div className="w-16 h-16 bg-[#002a63] rounded-full border-[4px] border-white shadow-xl flex items-center justify-center z-10">
                              <Gift className="text-white" size={24} />
                          </div>
                          <div className="w-16 h-16 bg-[#0075dd] rounded-full border-[4px] border-white shadow-xl flex items-center justify-center -ml-4 z-20 font-black text-xl text-white">f</div>
                      </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col items-center text-center">
                      <h3 className="font-bold text-[#2d3a4b] text-lg mb-3 leading-tight">Spread the word. Get $100!</h3>
                      <p className="text-[#556d82] text-sm leading-relaxed mb-10 max-w-xs">Know business owners or freelancers who want better accounting tools? Refer them to FreshBooks, and you'll get a $100 credit on your account once they've been a paying subscriber for at least 60 days.</p>
                      <button className="w-full max-w-[280px] py-2.5 border-2 border-[#002a63] text-[#002a63] rounded font-black text-sm hover:bg-[#002a63] hover:text-white transition-all">Share and Save</button>
                  </div>
              </div>
          </div>

          {/* Outstanding Invoices Section */}
          <div className="bg-white border border-gray-200 rounded p-8 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-[#2d3a4b]">Outstanding Invoices</h3>
                      <button className="flex items-center gap-1.5 text-xs font-bold text-[#556d82] bg-white px-2 py-1 rounded border shadow-sm">PHP <ChevronDown size={12} /></button>
                  </div>
                  <button onClick={() => navigate('/invoices')} className="text-xs font-bold text-[#0075dd] hover:underline uppercase tracking-wide">View Accounts Aging Report</button>
              </div>
              
              <div className="h-[260px] border-b border-gray-100 mb-6 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                            <YAxis hide />
                            <Bar dataKey="val" barSize={100} radius={[2,2,0,0]}>
                                {revenueData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.type === 'overdue' ? '#ff6b6b' : '#0075dd'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="absolute top-0 right-0 text-right">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Outstanding</div>
                        <div className="text-2xl font-black text-[#0075dd]">₱{stats.outstanding.toLocaleString()}</div>
                    </div>
              </div>

              <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-8">
                       <div className="flex items-center gap-2">
                           <div className="w-3 h-3 bg-[#ff6b6b] rounded-sm"></div>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Overdue</span>
                       </div>
                       <div className="flex items-center gap-2">
                           <div className="w-3 h-3 bg-[#0075dd] rounded-sm"></div>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Outstanding</span>
                       </div>
                  </div>
                  <div className="flex gap-10">
                      <div className="text-right border-r border-gray-100 pr-10">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">0-30 Days</span>
                          <span className="text-sm font-bold text-[#0075dd]">₱{stats.outstanding.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">31-60 Days</span>
                          <span className="text-sm font-bold text-gray-300">₱0.00</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
