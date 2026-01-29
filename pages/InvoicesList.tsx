// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, ChevronDown, Filter, MoreHorizontal, Pencil, Archive, 
    Trash2, Mail, Phone, Plus, X, UserPlus, Info, CheckCircle2,
    Users, DollarSign, List, History, FileText, Play, CreditCard, Bell, RotateCcw, Loader2, AlertCircle
} from 'lucide-react';
import { invoicesApi, InvoiceData } from '../api';

const StatBox = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col items-center flex-1">
        <div className="text-4xl font-black text-[#0075dd] mb-2">₱{value}</div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</div>
    </div>
);

export default function InvoicesList() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [activeToggle, setActiveToggle] = useState('From Me');
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const refreshData = async () => {
        setIsLoading(true);
        const response = await invoicesApi.getAll();
        if (response.success && response.data) {
            setInvoices(response.data);
        } else {
            showNotification(response.error || 'Failed to load invoices', 'error');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const filteredInvoices = invoices.filter(inv => 
        (inv.client || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (inv.number || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredInvoices.length) setSelectedIds([]);
        else setSelectedIds(filteredInvoices.map(i => i.id!));
    };

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            const response = await invoicesApi.delete(id);
            if (response.success) {
                setInvoices(invoices.filter(i => i.id !== id));
                setSelectedIds(prev => prev.filter(i => i !== id));
                showNotification('Invoice deleted successfully');
            } else {
                showNotification(response.error || 'Failed to delete invoice', 'error');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected invoices?`)) {
            let successCount = 0;
            for (const id of selectedIds) {
                const response = await invoicesApi.delete(id);
                if (response.success) successCount++;
            }
            await refreshData();
            showNotification(`${successCount} invoices deleted`);
            setSelectedIds([]);
        }
    };

    const handleRecordPayment = (inv: InvoiceData, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate('/payments', { state: { quickAdd: true, invoiceNumber: inv.number, client: inv.client, amount: inv.amount, invoiceId: inv.id } });
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#0075dd]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 font-sans">
            {toast && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-black/10 ${toast.type === 'error' ? 'bg-red-500 text-white ring-red-600/30' : 'bg-fb-slate text-white ring-fb-green/30'}`}>
                    {toast.type === 'error' ? <AlertCircle size={22} /> : <CheckCircle2 className="text-fb-green" size={22} />}
                    <span className="font-bold text-sm">{toast.message}</span>
                </div>
            )}

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
                
                <div className="flex bg-white border border-gray-200 rounded-full p-1 w-fit shadow-sm mt-2">
                    <button onClick={() => setActiveToggle('From Me')} className={`px-8 py-1.5 rounded-full text-sm font-bold transition-all ${activeToggle === 'From Me' ? 'bg-[#0075dd] text-white shadow-md' : 'text-gray-500'}`}>From Me</button>
                    <button onClick={() => setActiveToggle('To Me')} className={`px-8 py-1.5 rounded-full text-sm font-bold transition-all ${activeToggle === 'To Me' ? 'bg-[#0075dd] text-white shadow-md' : 'text-gray-500'}`}>To Me</button>
                </div>
            </div>

            <div className="flex items-center justify-center py-6 px-4">
                 <StatBox label="overdue" value={overdue.toLocaleString()} />
                 <div className="h-10 w-[1px] bg-gray-100"></div>
                 <StatBox label="total outstanding" value={outstanding.toLocaleString()} />
                 <div className="h-10 w-[1px] bg-gray-100"></div>
                 <StatBox label="in draft" value={draft.toLocaleString()} />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {selectedIds.length > 0 && (
                    <div className="bg-[#f0f9ff] px-6 py-3 border-b border-blue-100 flex items-center gap-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-1 text-[#0075dd] font-black text-xl">
                            <span>Selected</span>
                            <span className="ml-2 bg-[#0075dd] text-white text-xs px-2 py-0.5 rounded-full">{selectedIds.length}</span>
                        </div>
                        <button onClick={handleBulkDelete} className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded font-bold text-xs hover:bg-red-100">Delete selected</button>
                    </div>
                )}

                <div className="p-4 border-b border-gray-100 flex justify-end items-center bg-gray-50/20">
                    <div className="flex items-center gap-4">
                        <div className="relative">
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
                            <th className="p-4">Issued Date / Due Date</th>
                            <th className="p-4 text-right">Amount / Status</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredInvoices.map(inv => (
                            <tr key={inv.id} className={`hover:bg-[#f0f9ff]/50 cursor-pointer group transition-colors ${selectedIds.includes(inv.id!) ? 'bg-[#f0f9ff]' : ''}`} onClick={() => navigate(`/invoices/${inv.id}`)}>
                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-gray-300 text-[#0075dd] focus:ring-[#0075dd] w-4 h-4 cursor-pointer" checked={selectedIds.includes(inv.id!)} onChange={() => toggleSelect(inv.id!)} />
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-[#0075dd] text-[13px]">{inv.client}</div>
                                    <div className="text-xs text-gray-400 font-mono tracking-tighter">{inv.number}</div>
                                </td>
                                <td className="p-4">
                                    <span className="text-xs text-gray-500 line-clamp-1">{inv.notes || 'No description provided'}</span>
                                </td>
                                <td className="p-4">
                                    <div className="text-xs font-medium text-gray-600">{inv.date}</div>
                                    <div className="text-[10px] text-gray-300">{inv.date_due || '—'}</div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="font-bold text-[#2d3a4b] text-[13px]">₱{(inv.amount || 0).toLocaleString()}</div>
                                    <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border inline-block mt-1 ${getStatusStyle(inv.status || 'Draft')}`}>{inv.status}</div>
                                </td>
                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-lg border border-gray-100 shadow-sm">
                                        <button onClick={() => navigate(`/invoices/${inv.id}/edit`)} className="p-1 text-gray-400 hover:text-[#0075dd]" title="Edit"><Pencil size={14} /></button>
                                        <button onClick={(e) => handleRecordPayment(inv, e)} className="p-1 text-gray-400 hover:text-green-500" title="Record Payment"><CreditCard size={14} /></button>
                                        <button onClick={(e) => handleDelete(inv.id!, e)} className="p-1 text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredInvoices.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-16 text-center">
                                    <FileText size={48} className="text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold">No invoices found</p>
                                    <button onClick={() => navigate('/invoices/new')} className="text-[#0075dd] font-bold text-sm mt-2 hover:underline">Create your first invoice</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
