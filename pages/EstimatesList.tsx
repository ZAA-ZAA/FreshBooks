// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, ChevronDown, X, MoreHorizontal, Pencil, 
    Archive, Trash2, ChevronRight, Calculator, FileCheck, Copy, Filter
} from 'lucide-react';

export default function EstimatesList() {
    const navigate = useNavigate();
    const [estimates, setEstimates] = useState<any[]>([]);
    const [showPromo, setShowPromo] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
    const bulkActionsRef = useRef(null);

    useEffect(() => {
        const stored = localStorage.getItem('fb_estimates');
        if (stored) setEstimates(JSON.parse(stored));

        const handleClickOutside = (event: MouseEvent) => {
            if (bulkActionsRef.current && !bulkActionsRef.current.contains(event.target)) {
                setBulkActionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredEstimates = estimates.filter(est => 
        est.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        est.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (est.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const convertToInvoice = (e, est) => {
        e.stopPropagation();
        const invoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
        const newInvoice = {
            id: Date.now().toString(),
            number: (invoices.length + 1).toString().padStart(7, '0'),
            client: est.client,
            date: new Date().toISOString().split('T')[0],
            amount: est.amount,
            status: 'Draft',
            description: `Converted from Estimate ${est.number}`,
            items: est.items || []
        };
        localStorage.setItem('fb_invoices', JSON.stringify([newInvoice, ...invoices]));
        navigate('/invoices');
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Delete this estimate?')) {
            const updated = estimates.filter(est => est.id !== id);
            setEstimates(updated);
            localStorage.setItem('fb_estimates', JSON.stringify(updated));
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-fb-navy tracking-tighter">Estimates</h1>
                    <p className="text-gray-400 font-bold mt-2">Draft proposals and win new client business</p>
                </div>
                <button 
                    onClick={() => navigate('/estimates/new')}
                    className="bg-fb-green hover:brightness-110 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl shadow-fb-green/20 transition-all active:scale-95"
                >
                    New Estimate
                </button>
            </div>

            {showPromo && (
                <div className="bg-white border border-gray-200 rounded-[32px] p-12 relative shadow-sm text-center group hover:shadow-lg transition-all animate-in zoom-in-95 duration-500">
                    <button onClick={() => setShowPromo(false)} className="absolute top-6 right-6 text-gray-300 hover:text-fb-navy transition-colors">
                        <X size={24} />
                    </button>
                    <h2 className="text-4xl font-black text-fb-blue mb-12 tracking-tight">Win More Work with Professional Estimates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100 group-hover:scale-110 transition-transform">
                                <Calculator className="text-fb-yellow" size={32} strokeWidth={3} />
                            </div>
                            <h3 className="font-black text-fb-navy text-lg mb-3">Detailed Quotes</h3>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed px-4">Send accurate quotes that clients can approve with a single click.</p>
                            <a href="#" className="text-fb-blue font-black text-sm hover:underline decoration-2">Learn more</a>
                        </div>
                        <div className="flex flex-col items-center border-x border-gray-100 px-8">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 transition-transform">
                                <FileCheck className="text-fb-blue" size={32} strokeWidth={3} />
                            </div>
                            <h3 className="font-black text-fb-navy text-lg mb-3">Convert Instantly</h3>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed px-4">Once approved, turn any estimate into a professional invoice in seconds.</p>
                            <a href="#" className="text-fb-blue font-black text-sm hover:underline decoration-2">See how it works</a>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 border border-pink-100 group-hover:scale-110 transition-transform">
                                <Copy className="text-pink-400" size={32} strokeWidth={3} />
                            </div>
                            <h3 className="font-black text-fb-navy text-lg mb-3">Clone Proposals</h3>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed px-4">Save time on similar projects by duplicating your best existing proposals.</p>
                            <a href="#" className="text-fb-blue font-black text-sm hover:underline decoration-2">Start templates</a>
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 h-16 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-fb-navy tracking-tight">Active Proposals</h2>
                        <div className="bg-fb-blue/10 text-fb-blue px-3 py-1 rounded-lg text-xs font-black">{estimates.length} Total</div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue transition-colors" size={20} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none w-full md:w-80 text-sm font-bold text-fb-navy shadow-sm transition-all" 
                                placeholder="Search estimates by client or #" 
                            />
                        </div>
                        <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} /> Filters
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-fb-yellow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <tr>
                                <th className="p-6">Client / Document Number</th>
                                <th className="p-6">Issue Date</th>
                                <th className="p-6">Project Description</th>
                                <th className="p-6 text-right">Total Quote</th>
                                <th className="p-6 w-48"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredEstimates.map(est => (
                                <tr 
                                    key={est.id} 
                                    onClick={() => navigate(`/estimates/${est.id}`)}
                                    className="transition-all duration-300 group cursor-pointer hover:bg-fb-gray"
                                >
                                    <td className="p-6 border-l-8 border-transparent group-hover:border-fb-yellow transition-all">
                                        <div className="font-black text-fb-navy group-hover:text-fb-blue text-base leading-tight mb-1">{est.client}</div>
                                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest font-mono">EST-#{est.number}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-black text-fb-navy text-xs mb-1">{est.date}</div>
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Valid for 30 days</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-gray-600 font-medium line-clamp-1 italic">"{est.description || 'Consulting Services'}"</div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="font-black text-fb-navy text-lg leading-none mb-1">₱{est.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                        <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block tracking-widest border ${est.status === 'Accepted' ? 'bg-fb-green/10 text-fb-green border-fb-green/20' : 'bg-fb-gray text-gray-400 border-gray-100'}`}>
                                            {est.status}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-x-2">
                                            <button 
                                                onClick={(e) => convertToInvoice(e, est)}
                                                className="text-[10px] font-black bg-fb-blue/10 text-fb-blue px-4 py-2 rounded-xl hover:bg-fb-blue hover:text-white transition-all uppercase tracking-widest shadow-sm"
                                            >
                                                Invoice
                                            </button>
                                            <button onClick={() => navigate(`/estimates/${est.id}`)} className="w-10 h-10 bg-fb-blue/5 text-fb-blue rounded-xl flex items-center justify-center hover:bg-fb-blue hover:text-white transition-all shadow-sm">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={(e) => handleDelete(e, est.id)} className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredEstimates.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-32 text-center bg-gray-50/30">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                                                <Calculator size={40} />
                                            </div>
                                            <p className="text-gray-400 font-black text-2xl italic tracking-tight">No estimates found</p>
                                            <button onClick={() => setSearchTerm('')} className="text-fb-blue font-bold text-sm mt-4 hover:underline">Clear Search</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}