// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronDown, Calendar, RotateCcw, Filter, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function RecurringTemplatesList() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('fb_templates');
        if (stored) setTemplates(JSON.parse(stored));
    }, []);

    const filtered = templates.filter(t => 
        t.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 relative">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-fb-navy tracking-tighter">Recurring</h1>
                    <p className="text-gray-400 font-bold mt-2">Automate your repeat billing and subscription cycles</p>
                </div>
                <button 
                    onClick={() => navigate('/invoices/new?type=template')}
                    className="bg-fb-green hover:brightness-110 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl shadow-fb-green/20 transition-all active:scale-95"
                >
                    New Template
                </button>
            </div>

            <div className="pt-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 h-16 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-fb-navy tracking-tight">Active Automations</h2>
                        <div className="bg-fb-blue/10 text-fb-blue px-3 py-1 rounded-lg text-xs font-black">{templates.length} Total</div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue transition-colors" size={20} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none w-full md:w-80 text-sm font-bold text-fb-navy shadow-sm transition-all" 
                                placeholder="Search by client or template #" 
                            />
                        </div>
                        <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} /> Filters
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-fb-blue">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                            <tr>
                                <th className="p-8">Client / Template Sequence</th>
                                <th className="p-8">Last Execution</th>
                                <th className="p-8 text-center">Frequency Interval</th>
                                <th className="p-8 text-right">Cycle Amount</th>
                                <th className="p-8 w-32"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(t => (
                                <tr key={t.id} className="transition-all duration-300 group cursor-pointer hover:bg-fb-gray" onClick={() => navigate(`/invoices/${t.id}`)}>
                                    <td className="p-8 border-l-8 border-transparent group-hover:border-fb-blue transition-all">
                                        <div className="font-black text-fb-navy group-hover:text-fb-blue text-lg leading-tight mb-1">{t.client}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TPL-#{t.number}</div>
                                    </td>
                                    <td className="p-8">
                                        <div className="font-black text-fb-navy text-xs mb-1">{t.lastIssued || 'Never triggered'}</div>
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Next: Automatic</div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <div className="inline-flex items-center gap-2 bg-blue-50 text-fb-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                            <RotateCcw size={12} /> Monthly Cycle
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="font-black text-fb-navy text-xl mb-1">₱{t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                        <div className="text-[9px] font-black text-fb-green uppercase tracking-[0.2em]">Active Link</div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-x-2">
                                            <button className="w-10 h-10 bg-fb-blue/5 text-fb-blue rounded-xl flex items-center justify-center hover:bg-fb-blue hover:text-white transition-all shadow-sm"><Pencil size={18} /></button>
                                            <button className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-32 text-center bg-gray-50/30">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                                                <RotateCcw size={40} />
                                            </div>
                                            <p className="text-gray-400 font-black text-2xl italic tracking-tight">No recurring templates to show</p>
                                            <button onClick={() => navigate('/invoices/new?type=template')} className="bg-fb-blue text-white px-8 py-3 rounded-xl font-black mt-6 shadow-xl active:scale-95 transition-all">Create Your First Template</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col items-center mt-16">
                    <button className="px-10 py-3.5 border-2 border-fb-blue/10 rounded-2xl text-sm font-black text-fb-blue hover:bg-fb-blue hover:text-white transition-all shadow-sm active:scale-95">
                        View Archived Templates
                    </button>
                    <button className="text-xs text-gray-300 font-bold mt-4 hover:text-fb-navy transition-colors">or recently deleted</button>
                </div>
            </div>
        </div>
    );
}