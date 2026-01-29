// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Plus, Search, SlidersHorizontal, ChevronDown, Calendar, User, 
    MoreHorizontal, Copy, Trash2, Send, CheckCircle2, X, ChevronRight,
    Pencil, Archive, DollarSign, Filter, FileText
} from 'lucide-react';

const Stat = ({ value, sub }: { value: string, sub: string }) => (
    <div className="flex-1 px-8 py-6 border-r border-gray-100 last:border-0">
        <div className="text-3xl font-bold text-fb-blue mb-1">{value}</div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{sub}</div>
    </div>
);

export default function InvoicesList() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        const storedInv = localStorage.getItem('fb_invoices');
        if (storedInv) setInvoices(JSON.parse(storedInv));
    }, []);

    const filteredInvoices = invoices.filter(inv => 
        inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        inv.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const outstanding = invoices.filter(i => i.status !== 'Paid').reduce((acc, inv) => acc + (inv.amount || 0), 0);
    const overdue = invoices.filter(i => i.status === 'Overdue').reduce((acc, inv) => acc + (inv.amount || 0), 0);
    const draft = invoices.filter(i => i.status === 'Draft').reduce((acc, inv) => acc + (inv.amount || 0), 0);

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredInvoices.length) setSelectedIds([]);
        else setSelectedIds(filteredInvoices.map(i => i.id));
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-fb-green/10 text-fb-green border-fb-green/20';
            case 'Draft': return 'bg-gray-100 text-gray-500 border-gray-200';
            case 'Overdue': return 'bg-red-50 text-red-500 border-red-100';
            case 'Sent': return 'bg-fb-blue/10 text-fb-blue border-fb-blue/20';
            default: return 'bg-fb-gray text-gray-400 border-gray-100';
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header matches Dashboard Style */}
            <div className="flex justify-between items-end mb-10">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Invoices</h1>
                <div className="flex items-center gap-6">
                    <button className="text-[15px] font-bold text-[#556d82] hover:text-fb-blue">Import Invoices</button>
                    <button 
                        onClick={() => navigate('/invoices/new')}
                        className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-2.5 rounded font-bold text-lg shadow-md transition-all"
                    >
                        New Invoice
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border border-gray-200 rounded shadow-sm flex mb-10">
                 <Stat value={`₱${overdue.toLocaleString()}`} sub="Overdue" />
                 <Stat value={`₱${outstanding.toLocaleString()}`} sub="Total Outstanding" />
                 <Stat value={`₱${draft.toLocaleString()}`} sub="Drafts" />
            </div>

            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-fb-blue outline-none transition-all w-64" 
                                placeholder="Search by client or #" 
                            />
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-600 bg-white">
                            <Filter size={12} /> Filter
                        </button>
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="p-4 w-10">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-fb-blue" 
                                    checked={filteredInvoices.length > 0 && selectedIds.length === filteredInvoices.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Invoice #</th>
                            <th className="p-4">Date Issued</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-right">Status</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredInvoices.map(inv => (
                            <tr 
                                key={inv.id} 
                                className="hover:bg-fb-gray cursor-pointer transition-colors group"
                                onClick={() => navigate(`/invoices/${inv.id}`)}
                            >
                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-fb-blue" 
                                        checked={selectedIds.includes(inv.id)}
                                        onChange={() => toggleSelect(inv.id)}
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-fb-navy">{inv.client}</div>
                                </td>
                                <td className="p-4 font-mono text-xs text-gray-500">{inv.number}</td>
                                <td className="p-4 text-gray-500">{inv.date}</td>
                                <td className="p-4 text-right font-bold text-fb-navy">₱{inv.amount.toLocaleString()}</td>
                                <td className="p-4 text-right">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${getStatusColor(inv.status)}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <button className="text-gray-300 hover:text-fb-navy"><MoreHorizontal size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
