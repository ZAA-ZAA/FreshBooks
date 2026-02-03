// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Search, ChevronDown, Plus, X, Eye, BarChart3, CreditCard, 
    Filter, MoreHorizontal, Pencil, Archive, Trash2, Info, Check, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';
import { paymentsApi, invoicesApi, PaymentData, InvoiceData } from '../api';

export default function PaymentsList() {
    const navigate = useNavigate();
    const location = useLocation();
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [activeTab, setActiveTab] = useState('Invoice Payments');
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const recommendationsRef = useRef(null);

    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const [quickAddData, setQuickAddData] = useState({
        invoice: '', client: '', date: new Date().toISOString().split('T')[0],
        method: 'Cash', amount: '', notes: '', invoice_id: ''
    });
    const [showRecommendations, setShowRecommendations] = useState(false);

    const TOAST_DURATION_MS = 4000;

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    };

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), TOAST_DURATION_MS);
        return () => clearTimeout(t);
    }, [toast]);

    const refreshData = async () => {
        setIsLoading(true);
        
        const [paymentsResponse, invoicesResponse] = await Promise.all([
            paymentsApi.getAll(),
            invoicesApi.getAll()
        ]);
        
        if (paymentsResponse.success && paymentsResponse.data) {
            setPayments(paymentsResponse.data);
        }
        if (invoicesResponse.success && invoicesResponse.data) {
            setInvoices(invoicesResponse.data);
        }
        
        setIsLoading(false);
    };

    useEffect(() => {
        refreshData();
        
        if (location.state?.quickAdd) {
            setIsQuickAddOpen(true);
            setQuickAddData(prev => ({
                ...prev,
                invoice: location.state.invoiceNumber || '',
                client: location.state.client || '',
                amount: location.state.amount?.toString() || '',
                invoice_id: location.state.invoiceId || ''
            }));
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (recommendationsRef.current && !recommendationsRef.current.contains(event.target)) {
                setShowRecommendations(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [location.state]);

    const filteredPayments = payments.filter(p => 
        (p.client || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.invoice || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const recommendations = invoices.filter(inv => {
        const matchesStatus = inv.status !== 'Paid';
        const searchStr = quickAddData.invoice.toLowerCase();
        const matchesInvoiceNum = String(inv.number).toLowerCase().includes(searchStr);
        const matchesClient = (inv.client || '').toLowerCase().includes(searchStr);
        return matchesStatus && (matchesInvoiceNum || matchesClient);
    }).slice(0, 8);

    const handleSelectInvoice = (inv: InvoiceData) => {
        setQuickAddData({
            ...quickAddData,
            invoice: inv.number || '',
            client: inv.client || '',
            amount: (inv.amount || 0).toString(),
            invoice_id: inv.id || ''
        });
        setShowRecommendations(false);
    };

    const handleSaveQuickAdd = async () => {
        if (!quickAddData.invoice_id) {
            showNotification('Please select an invoice from the list.', 'error');
            return;
        }

        if (!quickAddData.amount || parseFloat(quickAddData.amount) <= 0) {
            showNotification('Please enter a valid payment amount.', 'error');
            return;
        }

        setIsSaving(true);

        const response = await paymentsApi.create({
            invoice_id: quickAddData.invoice_id,
            date: quickAddData.date,
            amount: parseFloat(quickAddData.amount),
            method: quickAddData.method,
            notes: quickAddData.notes
        });

        if (response.success) {
            await refreshData();
            setIsQuickAddOpen(false);
            setQuickAddData({ invoice: '', client: '', date: new Date().toISOString().split('T')[0], method: 'Cash', amount: '', notes: '', invoice_id: '' });
            showNotification('Payment recorded successfully!');
        } else {
            showNotification(response.error || 'Failed to record payment', 'error');
        }

        setIsSaving(false);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this payment record?')) {
            const response = await paymentsApi.delete(id);
            if (response.success) {
                await refreshData();
                showNotification('Payment record deleted.');
            } else {
                showNotification(response.error || 'Failed to delete payment', 'error');
            }
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
        <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-sans relative">
            {toast && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-black/10 ${toast.type === 'error' ? 'bg-red-500 text-white ring-red-600/30' : 'bg-fb-slate text-white ring-fb-green/30'}`}>
                    {toast.type === 'error' ? <AlertCircle size={22} /> : <CheckCircle2 className="text-fb-green" size={22} />}
                    <span className="font-bold text-sm">{toast.message}</span>
                </div>
            )}

            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Payments</h1>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => {
                            refreshData();
                            setIsQuickAddOpen(true);
                        }}
                        className="bg-[#00a651] hover:bg-[#008541] text-white px-8 py-2.5 rounded font-black text-lg shadow-md transition-all active:scale-95"
                    >
                        Record Payment
                    </button>
                </div>
            </div>

            {showOnboarding && (
                <div className="bg-white border border-gray-200 rounded-lg p-10 relative shadow-sm overflow-hidden mb-10">
                    <button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"><X size={20} /></button>
                    <h2 className="text-2xl font-black text-[#0075dd] text-center mb-12 tracking-tight">Track and Manage All Invoice Payments</h2>
                    <div className="grid grid-cols-3 gap-10 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-fb-blue mb-4">
                                <Eye size={28} />
                            </div>
                            <h4 className="font-bold text-fb-navy text-xs uppercase tracking-wider">Invoice Visibility</h4>
                        </div>
                        <div className="flex flex-col items-center border-x border-gray-100 px-10">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-fb-green mb-4">
                                <BarChart3 size={28} />
                            </div>
                            <h4 className="font-bold text-fb-navy text-xs uppercase tracking-wider">Revenue Analysis</h4>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-fb-yellow mb-4">
                                <CreditCard size={28} />
                            </div>
                            <h4 className="font-bold text-fb-navy text-xs uppercase tracking-wider">Fast Settlement</h4>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center border-b border-gray-100 mb-6">
                <div className={`px-8 py-3.5 text-sm font-bold cursor-pointer transition-all ${activeTab === 'Invoice Payments' ? 'bg-white border border-gray-200 border-b-white rounded-t-lg text-[#0075dd]' : 'text-gray-400'}`} onClick={() => setActiveTab('Invoice Payments')}>Invoice Payments</div>
                <div className="px-8 py-3.5 text-sm font-bold text-gray-400 cursor-not-allowed">Checkout Links</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-end items-center bg-gray-50/20">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-1.5 border border-gray-300 rounded text-xs outline-none w-64 bg-white" 
                            placeholder="Search payments..." 
                        />
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="p-4">Client / Invoice Number</th>
                            <th className="p-4">Payment Date</th>
                            <th className="p-4">Method / Notes</th>
                            <th className="p-4 text-right">Amount / Status</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isQuickAddOpen && (
                            <tr className="bg-blue-50/30 animate-in slide-in-from-top-2 duration-200">
                                <td className="p-4 relative" ref={recommendationsRef}>
                                    <div className="space-y-1">
                                        <input 
                                            value={quickAddData.invoice} 
                                            onFocus={() => {
                                                refreshData();
                                                setShowRecommendations(true);
                                            }}
                                            onChange={e => {
                                                setQuickAddData({...quickAddData, invoice: e.target.value, invoice_id: ''});
                                                setShowRecommendations(true);
                                            }} 
                                            placeholder="Find Invoice #..." 
                                            className="w-full border border-blue-400 rounded px-2 py-1.5 text-xs outline-none focus:ring-1 ring-blue-500 mb-1" 
                                        />
                                        {quickAddData.client && <div className="text-[10px] font-black text-fb-blue uppercase tracking-tighter">Selected: {quickAddData.client}</div>}
                                        
                                        {showRecommendations && (
                                            <div className="absolute top-full left-0 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-[120] py-2 animate-in fade-in duration-150 mt-1 max-h-[300px] overflow-y-auto">
                                                <div className="px-3 py-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                                                    Unpaid Invoices
                                                </div>
                                                {recommendations.length > 0 ? recommendations.map(inv => (
                                                    <div 
                                                        key={inv.id}
                                                        onClick={() => handleSelectInvoice(inv)}
                                                        className="px-4 py-2.5 hover:bg-fb-gray cursor-pointer group flex justify-between items-center transition-colors"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-black text-fb-navy group-hover:text-fb-blue">#{inv.number}</div>
                                                            <div className="text-[10px] font-bold text-gray-400 uppercase">{inv.client}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-black text-fb-navy">₱{(inv.amount || 0).toLocaleString()}</div>
                                                            <div className="text-[9px] text-gray-300 font-bold uppercase tracking-tighter">Balance Due</div>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="px-4 py-6 text-center text-xs text-gray-400 italic">No unpaid invoices found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <input type="date" value={quickAddData.date} onChange={e => setQuickAddData({...quickAddData, date: e.target.value})} className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none" />
                                </td>
                                <td className="p-4">
                                    <select value={quickAddData.method} onChange={e => setQuickAddData({...quickAddData, method: e.target.value})} className="border border-gray-300 rounded px-2 py-1.5 text-xs bg-white mb-1 w-full font-bold">
                                        <option>Cash</option><option>Bank Transfer</option><option>Credit Card</option><option>Check</option>
                                    </select>
                                    <input value={quickAddData.notes} onChange={e => setQuickAddData({...quickAddData, notes: e.target.value})} placeholder="Internal Notes" className="border border-gray-300 rounded px-2 py-1.5 text-xs w-full outline-none" />
                                </td>
                                <td className="p-4 text-right">
                                    <div className="relative mb-1">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₱</span>
                                        <input value={quickAddData.amount} onChange={e => setQuickAddData({...quickAddData, amount: e.target.value})} placeholder="0.00" className="border border-gray-300 rounded pl-5 pr-2 py-1.5 text-xs w-24 text-right font-black outline-none focus:border-fb-blue" />
                                    </div>
                                </td>
                                <td className="p-4 flex flex-col gap-2">
                                    <button onClick={handleSaveQuickAdd} disabled={isSaving} className="bg-[#00a651] text-white p-2 rounded hover:bg-[#008541] shadow-sm transition-all disabled:opacity-50"><Check size={18} strokeWidth={3} /></button>
                                    <button onClick={() => setIsQuickAddOpen(false)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><X size={18} /></button>
                                </td>
                            </tr>
                        )}
                        {filteredPayments.map(pay => (
                            <tr key={pay.id} className="hover:bg-[#f0f9ff]/50 transition-colors group">
                                <td className="p-4 border-l-4 border-l-[#5cb85c]">
                                    <div className="font-bold text-[#0075dd] text-[13px]">{pay.client}</div>
                                    <div className="text-[11px] text-[#0075dd] font-mono tracking-tighter">#{pay.invoice}</div>
                                </td>
                                <td className="p-4 text-gray-600 font-medium">{pay.date}</td>
                                <td className="p-4">
                                    <div className="text-[13px] font-bold text-fb-navy">{pay.method}</div>
                                    <div className="text-[11px] text-gray-400 italic">"{pay.notes || 'Transaction recorded'}"</div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="font-black text-[#2d3a4b]">₱{(pay.amount || 0).toLocaleString()} PHP</div>
                                    <div className="bg-[#e0f5e0] text-[#008541] text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#c1e8c1] inline-block mt-1">Confirmed</div>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={(e) => handleDelete(pay.id!, e)} className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {filteredPayments.length === 0 && !isQuickAddOpen && (
                            <tr>
                                <td colSpan={5} className="p-32 text-center">
                                    <div className="flex flex-col items-center">
                                        <CreditCard size={48} className="text-gray-100 mb-4" />
                                        <p className="text-gray-400 font-black text-xl italic">No payment history found</p>
                                        <button onClick={() => setIsQuickAddOpen(true)} className="text-fb-blue font-bold text-sm mt-4 hover:underline">Record your first payment</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
