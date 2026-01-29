// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, ChevronDown, Plus, X, Eye, BarChart3, CreditCard, 
    Filter, MoreHorizontal, Pencil, Archive, Trash2, Info
} from 'lucide-react';

export default function PaymentsList() {
    const navigate = useNavigate();
    const [payments, setPayments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [activeTab, setActiveTab] = useState('Invoice Payments');
    const [moreActionsOpen, setMoreActionsOpen] = useState(false);
    const moreActionsRef = useRef(null);

    useEffect(() => {
        const storedPayments = JSON.parse(localStorage.getItem('fb_payments') || '[]');
        // If no payments, seed one to match screenshot data
        if (storedPayments.length === 0) {
            const seed = [{
                id: 'p1',
                client: 'asdas',
                invoice: '0000001',
                date: '2026-01-29',
                method: 'Cash',
                notes: 'paid',
                amount: 29.24,
                status: 'Paid'
            }];
            setPayments(seed);
            localStorage.setItem('fb_payments', JSON.stringify(seed));
        } else {
            setPayments(storedPayments);
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
                setMoreActionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredPayments = payments.filter(p => 
        p.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.invoice.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-sans">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Payments</h1>
                <div className="flex items-center gap-4">
                    <div className="relative" ref={moreActionsRef}>
                        <button 
                            onClick={() => setMoreActionsOpen(!moreActionsOpen)}
                            className="flex items-center gap-2 text-[15px] font-bold text-[#556d82] hover:text-[#0075dd] transition-colors"
                        >
                            More Actions <ChevronDown size={20} className={`transition-transform ${moreActionsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {moreActionsOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded shadow-xl z-[100] py-1">
                                <div className="px-4 py-2 hover:bg-gray-50 text-sm font-bold text-[#002a63] cursor-pointer">Export All Payments</div>
                                <div className="px-4 py-2 hover:bg-gray-50 text-sm font-bold text-[#002a63] cursor-pointer">Payment Settings</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Onboarding Banner */}
            {showOnboarding && (
                <div className="bg-white border border-gray-200 rounded-lg p-10 relative shadow-sm overflow-hidden mb-10">
                    <button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-[#0075dd] text-center mb-12 tracking-tight">Track and Manage All Invoice Payments</h2>
                    <div className="grid grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#fff9f1] rounded-full flex items-center justify-center mb-4 border border-[#fff2e0]">
                                <div className="w-12 h-12 bg-[#f9c80e] rounded-lg flex items-center justify-center text-white shadow-sm relative overflow-hidden">
                                     <div className="absolute inset-0 bg-white/20 transform rotate-45 translate-y-4"></div>
                                     <Eye size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">See Your Invoice Income</h3>
                            <p className="text-[11px] text-gray-500 leading-relaxed px-4">View all the invoice payments you've received in a single place.</p>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-gray-100">
                            <div className="w-20 h-20 bg-[#f1fcf1] rounded-full flex items-center justify-center mb-4 border border-[#e0f5e0]">
                                <div className="w-12 h-12 bg-[#5cb85c] rounded-lg flex items-center justify-center text-white shadow-sm relative">
                                    <BarChart3 size={24} />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-gray-100 flex items-center justify-center text-[#5cb85c] shadow-sm text-[10px] font-black">$</div>
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Get the Bigger Picture</h3>
                            <p className="text-[11px] text-gray-500 leading-relaxed px-4">See which payments make up Invoice Income on your P&L report. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">View Report</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-4 border border-[#e0f2fe]">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg flex items-center justify-center text-white shadow-sm relative">
                                    <div className="absolute top-1 left-1 flex gap-0.5">
                                        <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                                        <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center">
                                        <span className="text-sm font-black">$</span>
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Manage Payments Quickly</h3>
                            <p className="text-[11px] text-gray-500 leading-relaxed px-4">Add, edit, and delete invoice payments right from here.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center border-b border-gray-100 mb-6">
                <div 
                    onClick={() => setActiveTab('Invoice Payments')}
                    className={`px-8 py-3.5 text-sm font-bold cursor-pointer transition-all border-x border-t rounded-t-lg -mb-px ${activeTab === 'Invoice Payments' ? 'bg-white border-gray-200 text-[#0075dd]' : 'bg-gray-50/50 border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Invoice Payments
                </div>
                <div 
                    onClick={() => setActiveTab('Checkout Link Payments')}
                    className={`px-8 py-3.5 text-sm font-bold cursor-pointer transition-all -mb-px border-b-2 border-transparent ${activeTab === 'Checkout Link Payments' ? 'text-[#0075dd] border-[#0075dd]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Checkout Link Payments
                </div>
                <div 
                    onClick={() => setActiveTab('Other Income')}
                    className={`px-8 py-3.5 text-sm font-bold cursor-pointer transition-all -mb-px border-b-2 border-transparent ${activeTab === 'Other Income' ? 'text-[#0075dd] border-[#0075dd]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Other Income
                </div>
            </div>

            {/* List and Actions */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-[#2d3a4b]">All Invoice Payments</h3>
                    <button onClick={() => navigate('/payments/new')} className="text-[#00a651] hover:scale-110 transition-transform">
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
                                    className="pl-10 pr-4 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0075dd] outline-none transition-all w-64 bg-white" 
                                    placeholder="Search" 
                                />
                            </div>
                            <button className="flex items-center gap-1 px-4 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-600 bg-white hover:bg-gray-50">
                                <Filter size={14} /> Advanced Search <ChevronDown size={14} className="ml-1 opacity-50" />
                            </button>
                        </div>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <tr>
                                <th className="p-4">Client / Invoice Number</th>
                                <th className="p-4">Payment Date <ChevronDown size={10} className="inline ml-1" /></th>
                                <th className="p-4">Payment Method / Internal Notes</th>
                                <th className="p-4 text-right">Amount / Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPayments.map(pay => (
                                <tr key={pay.id} className="hover:bg-[#f0f9ff]/50 cursor-pointer group transition-colors">
                                    <td className="p-4 border-l-4 border-l-[#5cb85c]">
                                        <div className="font-bold text-[#0075dd] text-[13px]">{pay.client}</div>
                                        <div className="text-[11px] text-[#0075dd] font-mono tracking-tight">{pay.invoice}</div>
                                    </td>
                                    <td className="p-4 text-[13px] text-gray-600">
                                        {pay.date}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-[13px] font-medium text-gray-700">{pay.method}</div>
                                        <div className="text-[11px] text-gray-400 italic">"{pay.notes || 'No notes'}"</div>
                                    </td>
                                    <td className="p-4 text-right relative">
                                        <div className="font-bold text-[#2d3a4b] text-[13px]">₱{pay.amount.toFixed(2)} PHP</div>
                                        <div className="bg-[#e0f5e0] text-[#008541] text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#c1e8c1] inline-block mt-1">
                                            {pay.status}
                                        </div>
                                        <button className="absolute -top-1 -right-2 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:text-[#0075dd] opacity-0 group-hover:opacity-100 transition-all">
                                            <Pencil size={12} />
                                        </button>
                                    </td>
                                    <td className="p-4"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="p-4 border-t border-gray-100 bg-gray-50/20 text-xs font-bold text-gray-400">
                        1-{filteredPayments.length} of {filteredPayments.length}
                    </div>
                </div>
            </div>
        </div>
    );
}
