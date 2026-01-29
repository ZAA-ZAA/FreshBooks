// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, ChevronDown, Filter, MoreHorizontal, Pencil, Archive, 
    Trash2, Mail, Phone, Plus, X, UserPlus, Info, CheckCircle2,
    Users, DollarSign, List, History, FileText, Play, CreditCard, Bell, RotateCcw
} from 'lucide-react';

const StatBox = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col items-center flex-1">
        <div className="text-4xl font-black text-[#0075dd] mb-2">₱{value}</div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</div>
    </div>
);

export default function InvoicesList() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [activeToggle, setActiveToggle] = useState('From Me');

    useEffect(() => {
        const storedInvoices = localStorage.getItem('fb_invoices');
        if (storedInvoices) setInvoices(JSON.parse(storedInvoices));
    }, []);

    const filteredInvoices = invoices.filter(inv => 
        inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        inv.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredInvoices.length) setSelectedIds([]);
        else setSelectedIds(filteredInvoices.map(i => i.id));
    };

    const overdue = invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const outstanding = invoices.filter(i => i.status !== 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const draft = invoices.filter(i => i.status === 'Draft').reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-[#e0f5e0] text-[#008541] border-[#c1e8c1]';
            case 'Draft': return 'bg-gray-100 text-gray-500 border-gray-200';
            case 'Overdue': return 'bg-red-50 text-red-500 border-red-100';
            default: return 'bg-blue-50 text-[#0075dd] border-blue-100';
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 font-sans">
            {/* Header Area */}
            <div className="flex flex-col items-center">
                <div className="w-full flex justify-between items-end mb-4">
                    <h1 className="text-4xl font-bold text-[#2d3a4b]">Invoices</h1>
                    <button 
                        onClick={() => navigate('/invoices/new')}
                        className="bg-[#00a651] hover:bg-[#008541] text-white px-8 py-2.5 rounded font-black text-lg shadow-md transition-all active:scale-95"
                    >
                        New Invoice
                    </button>
                </div>
                
                {/* Toggle Switch */}
                <div className="flex bg-white border border-gray-200 rounded-full p-1 w-fit shadow-sm mt-2">
                    <button 
                        onClick={() => setActiveToggle('From Me')}
                        className={`px-8 py-1.5 rounded-full text-sm font-bold transition-all ${activeToggle === 'From Me' ? 'bg-[#0075dd] text-white shadow-md' : 'text-gray-500 hover:text-[#0075dd]'}`}
                    >
                        From Me
                    </button>
                    <button 
                        onClick={() => setActiveToggle('To Me')}
                        className={`px-8 py-1.5 rounded-full text-sm font-bold transition-all ${activeToggle === 'To Me' ? 'bg-[#0075dd] text-white shadow-md' : 'text-gray-500 hover:text-[#0075dd]'}`}
                    >
                        To Me
                    </button>
                </div>
            </div>

            {/* Onboarding Banner */}
            {showOnboarding && (
                <div className="bg-white border border-gray-200 rounded-lg p-10 relative shadow-sm animate-in zoom-in-95 duration-500 overflow-hidden">
                    <button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-[#0075dd] text-center mb-10 tracking-tight">Make the Most Payable Invoice Ever</h2>
                    <div className="grid grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-4 border border-[#e0f2fe] relative">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <FileText size={24} />
                                </div>
                                <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full border border-gray-100 flex items-center justify-center text-[#0075dd] shadow-sm">
                                    <Play size={10} className="fill-current ml-0.5" />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Invoice like a Pro</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">See how to create invoices quickly and get paid even faster. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn more</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-gray-100">
                            <div className="w-20 h-20 bg-[#f1fcf1] rounded-full flex items-center justify-center mb-4 border border-[#e0f5e0]">
                                <div className="w-12 h-12 bg-[#5cb85c] rounded-lg rotate-3 flex items-center justify-center text-white shadow-sm">
                                    <CreditCard size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Accept Credit Cards</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Get paid twice as fast with online payments. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Enable now</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#fff9f1] rounded-full flex items-center justify-center mb-4 border border-[#fff2e0] relative">
                                <div className="w-12 h-12 bg-[#f9c80e] rounded-lg -rotate-3 flex items-center justify-center text-white shadow-sm">
                                    <Bell size={24} />
                                </div>
                                <div className="absolute top-0 right-0 w-6 h-6 bg-[#ff6b6b] rounded-full flex items-center justify-center text-white font-bold text-[8px] shadow-sm">$</div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Send Payment Reminders</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Let FreshBooks do the awkward nudging of late-paying clients. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn more</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats area */}
            <div className="flex items-center justify-center py-6 px-4">
                 <StatBox label="overdue" value={overdue.toLocaleString()} />
                 <div className="h-10 w-[1px] bg-gray-100"></div>
                 <div className="flex flex-col items-center flex-1 relative group">
                    <div className="text-4xl font-black text-[#0075dd] mb-2">₱{outstanding.toLocaleString()}</div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">total outstanding</div>
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mt-4">
                        <div className="relative">
                            <div className="text-[#0075dd] font-handwriting text-lg leading-none transform -rotate-6">See everything you're<br/>owed at a glance</div>
                            <div className="absolute -top-10 -left-6 transform rotate-180">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-[#0075dd]">
                                    <path d="M5 5C5 5 15 35 35 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M30 30L35 35L30 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                 </div>
                 <div className="h-10 w-[1px] bg-gray-100"></div>
                 <StatBox label="in draft" value={draft.toLocaleString()} />
            </div>

            {/* Recently Updated Shelf */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#2d3a4b]">Recently Updated</h3>
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {/* New Invoice Card */}
                    <div 
                        onClick={() => navigate('/invoices/new')}
                        className="flex-none w-48 h-56 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#0075dd] transition-all group"
                    >
                        <Plus size={32} className="text-[#00a651] mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[#002a63]">New Invoice</span>
                    </div>
                    {/* Invoice Cards */}
                    {invoices.map(inv => (
                        <div 
                            key={inv.id}
                            onClick={() => navigate(`/invoices/${inv.id}`)}
                            className="flex-none w-44 h-56 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col group relative"
                        >
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="text-[10px] font-mono text-gray-400 mb-1">{inv.number}</div>
                                <div className="font-bold text-[#2d3a4b] text-[13px] truncate">{inv.client}</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">{inv.date}</div>
                                
                                <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col items-end">
                                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">₱{inv.amount}</div>
                                    <div className="text-fb-blue group-hover:scale-110 transition-transform">
                                         {inv.status === 'Paid' ? <CheckCircle2 size={16} className="text-[#00a651]" /> : <History size={16} />}
                                    </div>
                                </div>
                            </div>
                            <div className={`py-2 text-center text-[10px] font-black uppercase tracking-widest rounded-b-lg border-t ${getStatusStyle(inv.status)}`}>
                                {inv.status}
                            </div>
                            {inv.status === 'Paid' && (
                                <div className="absolute top-1/2 left-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity ml-4 z-10 w-48">
                                    <div className="text-[#0075dd] font-handwriting text-sm leading-tight">Know the second your invoices<br/>are sent, viewed, or paid</div>
                                    <svg width="30" height="20" viewBox="0 0 30 20" fill="none" className="text-[#0075dd] transform -translate-x-6">
                                        <path d="M5 10H25M5 10L10 5M5 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* All Invoices Table */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-[#2d3a4b]">All Invoices</h3>
                    <button onClick={() => navigate('/invoices/new')} className="text-[#00a651] hover:scale-110 transition-transform">
                        <div className="bg-[#00a651] text-white p-0.5 rounded shadow-sm">
                            <Plus size={16} strokeWidth={4} />
                        </div>
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-end items-center bg-gray-50/20">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0075dd] outline-none transition-all w-64 bg-white shadow-inner" 
                                    placeholder="Search" 
                                />
                            </div>
                            <button className="flex items-center gap-1 px-4 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 shadow-sm transition-all active:translate-y-px">
                                <Filter size={14} /> Advanced Search <ChevronDown size={14} className="ml-1 opacity-50" />
                            </button>
                        </div>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <tr>
                                <th className="p-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-[#0075dd] focus:ring-[#0075dd] w-4 h-4 cursor-pointer" 
                                        checked={filteredInvoices.length > 0 && selectedIds.length === filteredInvoices.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4">Client / Invoice Number</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Issued Date <ChevronDown size={10} className="inline ml-1" /> / Due Date</th>
                                <th className="p-4 text-right">Amount / Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredInvoices.map(inv => (
                                <tr 
                                    key={inv.id} 
                                    className={`hover:bg-[#f0f9ff]/50 cursor-pointer group transition-colors ${selectedIds.includes(inv.id) ? 'bg-[#f0f9ff]' : ''}`}
                                    onClick={() => navigate(`/invoices/${inv.id}`)}
                                >
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-[#0075dd] focus:ring-[#0075dd] w-4 h-4 cursor-pointer" 
                                            checked={selectedIds.includes(inv.id)}
                                            onChange={() => toggleSelect(inv.id)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-[#0075dd] text-[13px]">{inv.client}</div>
                                        <div className="text-xs text-gray-400 font-mono tracking-tighter">{inv.number}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs text-gray-500 line-clamp-1">{inv.description || 'No description provided'}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs font-medium text-gray-600">{inv.date}</div>
                                        <div className="text-[10px] text-gray-300">—</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-bold text-[#2d3a4b] text-[13px]">₱{inv.amount.toFixed(2)}</div>
                                        <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border inline-block mt-1 ${getStatusStyle(inv.status)}`}>
                                            {inv.status}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-lg border border-gray-100 shadow-sm">
                                            <button onClick={() => navigate(`/invoices/${inv.id}/edit`)} className="p-1 text-gray-400 hover:text-[#0075dd] transition-colors"><Pencil size={14} /></button>
                                            <button className="p-1 text-gray-400 hover:text-[#0075dd] transition-colors"><Archive size={14} /></button>
                                            <button className="p-1 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                            <button className="p-1 text-gray-400 hover:text-[#0075dd] transition-colors"><MoreHorizontal size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50/30">
                            <tr>
                                <td colSpan={6} className="p-4 text-right">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Grand Total:</span>
                                    <span className="text-sm font-black text-[#2d3a4b]">₱{invoices.reduce((a,b)=>a+b.amount,0).toFixed(2)} PHP</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/20 text-xs font-bold text-gray-400">
                        <div>1-{filteredInvoices.length} of {filteredInvoices.length}</div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <button className="text-[#0075dd] hover:underline px-4 py-1.5 border border-[#0075dd]/20 rounded bg-white">View Archived Invoices</button>
                                <span className="text-gray-300">or</span>
                                <span className="text-[#0075dd] hover:underline cursor-pointer">deleted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Items per page:</span>
                                <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer text-gray-600">
                                    30 <ChevronDown size={14} className="opacity-40" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
