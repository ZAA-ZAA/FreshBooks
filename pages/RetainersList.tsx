// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Clock, FileBarChart, Handshake, ChevronDown, Plus, Filter, MoreHorizontal } from 'lucide-react';

export default function RetainersList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 relative">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-fb-navy tracking-tighter">Retainers</h1>
                    <p className="text-gray-400 font-bold mt-2">Guarantee your revenue and manage long-term client commitments</p>
                </div>
                <button 
                    onClick={() => {}}
                    className="bg-fb-green hover:brightness-110 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl shadow-fb-green/20 transition-all active:scale-95"
                >
                    New Retainer
                </button>
            </div>

            {/* Premium Onboarding Shelf */}
            <div className="bg-white border border-gray-200 rounded-[40px] p-16 text-center shadow-sm relative group hover:shadow-lg transition-all overflow-hidden border-b-8 border-b-fb-blue">
                <h2 className="text-4xl font-black text-fb-blue mb-16 tracking-tight">Scale with Stable Income</h2>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-16 relative max-w-6xl mx-auto">
                    <div className="flex flex-col items-center flex-1 z-10 group/item">
                        <div className="w-24 h-24 bg-blue-50 rounded-[30px] flex items-center justify-center mb-8 border border-blue-100 shadow-inner group-hover/item:scale-110 transition-transform">
                            <Handshake size={48} className="text-fb-blue" />
                        </div>
                        <h3 className="font-black text-fb-navy text-xl mb-3">Set Agreement</h3>
                        <p className="text-sm text-gray-500 leading-relaxed px-4">Set retainer terms and billing schedules to generate automated invoices.</p>
                    </div>

                    <div className="hidden md:block w-32 h-[2px] bg-gray-100 -mt-20"></div>

                    <div className="flex flex-col items-center flex-1 z-10 group/item">
                        <div className="w-24 h-24 bg-pink-50 rounded-[30px] flex items-center justify-center mb-8 border border-pink-100 shadow-inner group-hover/item:scale-110 transition-transform">
                            <Clock size={48} className="text-pink-400" />
                        </div>
                        <h3 className="font-black text-fb-navy text-xl mb-3">Track Against Cap</h3>
                        <p className="text-sm text-gray-500 leading-relaxed px-4">Track billable hours against your retainer and automatically invoice overages.</p>
                    </div>

                    <div className="hidden md:block w-32 h-[2px] bg-gray-100 -mt-20"></div>

                    <div className="flex flex-col items-center flex-1 z-10 group/item">
                        <div className="w-24 h-24 bg-[#fff9f1] rounded-[30px] flex items-center justify-center mb-8 border border-amber-100 shadow-inner group-hover/item:scale-110 transition-transform">
                            <FileBarChart size={48} className="text-fb-yellow" />
                        </div>
                        <h3 className="font-black text-fb-navy text-xl mb-3">Profit Insights</h3>
                        <p className="text-sm text-gray-500 leading-relaxed px-4">Identify your most profitable relationships with dedicated work summaries.</p>
                    </div>
                </div>

                <button className="bg-fb-blue hover:brightness-110 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-fb-blue/20 transition-all active:scale-95">
                    Initialize First Retainer
                </button>
                
                <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                     <Handshake size={320} />
                </div>
            </div>

            <div className="pt-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 h-16 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-fb-navy tracking-tight">Active Retainers</h2>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue transition-colors" size={20} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none w-full md:w-80 text-sm font-bold text-fb-navy shadow-sm transition-all" 
                                placeholder="Search client retainers..." 
                            />
                        </div>
                        <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} /> Advanced
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-fb-blue">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                            <tr>
                                <th className="p-8">Client Identity</th>
                                <th className="p-8">Next Cycle / Progress</th>
                                <th className="p-8">Agreed Fee / Frequency</th>
                                <th className="p-8 text-right">Lifetime Revenue / Status</th>
                                <th className="p-8 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <tr className="opacity-20 select-none grayscale cursor-not-allowed">
                                <td className="p-8 font-black text-fb-navy">Sample Global Inc</td>
                                <td className="p-8 font-bold text-gray-400 italic">No data yet</td>
                                <td className="p-8 font-bold text-gray-400 italic">No data yet</td>
                                <td className="p-8 text-right font-black text-fb-navy">₱0.00</td>
                                <td className="p-8"><MoreHorizontal className="text-gray-200" /></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="p-32 text-center bg-gray-50/30">
                        <div className="flex flex-col items-center">
                            <Handshake size={64} className="text-gray-100 mb-6" />
                            <p className="text-gray-400 font-black text-2xl italic tracking-tight">You haven't added any retainers yet</p>
                            <p className="text-gray-400 text-sm font-medium mt-2">Manage ongoing client agreements with automated billing.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}