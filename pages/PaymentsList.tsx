// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Plus, Search, ChevronDown, Eye, BarChart3, Zap, X, 
    CheckCircle2, SlidersHorizontal, MoreHorizontal, Pencil,
    Archive, Trash2, Calendar, CreditCard, Settings, FileText,
    Check, DollarSign, Filter
} from 'lucide-react';

export default function PaymentsList() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // UI State
    const [showPromo, setShowPromo] = useState(true);
    const [activeTab, setActiveTab] = useState('Invoice Payments');
    const [moreActionsOpen, setMoreActionsOpen] = useState(false);
    const [showInlineForm, setShowInlineForm] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const moreActionsRef = useRef(null);

    // Data State
    const [payments, setPayments] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        invoice: '',
        date: new Date().toISOString().split('T')[0],
        method: 'Cash',
        amount: '',
        notes: ''
    });

    useEffect(() => {
        const storedPayments = JSON.parse(localStorage.getItem('fb_payments') || '[]');
        const storedInvoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
        setPayments(storedPayments);
        setInvoices(storedInvoices);

        if (location.state?.prefill) {
            setFormData({
                invoice: location.state.invoiceNumber || '',
                amount: (location.state.amount || '').toString(),
                date: new Date().toISOString().split('T')[0],
                method: 'Cash',
                notes: `Payment for Invoice #${location.state.invoiceNumber}`
            });
            setShowInlineForm(true);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
                setMoreActionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [location.state]);

    const filteredPayments = payments.filter(pay => 
        pay.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        pay.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pay.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSavePayment = () => {
        const selectedInvoice = invoices.find(inv => inv.number === formData.invoice);
        const amount = parseFloat(formData.amount) || 0;
        
        const newPayment = {
            id: Date.now().toString(),
            client: selectedInvoice ? selectedInvoice.client : 'Unknown Client',
            invoice: formData.invoice || 'N/A',
            date: formData.date,
            method: formData.method,
            notes: formData.notes,
            amount: amount,
            status: 'Paid'
        };

        const updatedPayments = [newPayment, ...payments];
        setPayments(updatedPayments);
        localStorage.setItem('fb_payments', JSON.stringify(updatedPayments));

        // CRITICAL LOGIC: Update corresponding invoice status
        const updatedInvoices = invoices.map(inv => {
            if (inv.number === formData.invoice) {
                return { ...inv, status: 'Paid' };
            }
            return inv;
        });
        setInvoices(updatedInvoices);
        localStorage.setItem('fb_invoices', JSON.stringify(updatedInvoices));

        setShowInlineForm(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setFormData({ invoice: '', date: new Date().toISOString().split('T')[0], method: 'Cash', amount: '', notes: '' });
    };

    const selectInvoiceSuggestion = (inv) => {
        setFormData({
            ...formData,
            invoice: inv.number,
            amount: inv.amount.toString()
        });
        setShowInvoiceDropdown(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-20 relative">
            {showToast && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-fb-navy text-white px-8 py-4 rounded-xl shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300 min-w-[320px] justify-between border border-white/10">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-fb-green" size={24} />
                        <span className="font-bold">Manual Payment Authenticated</span>
                    </div>
                    <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-white transition-colors ml-4"><X size={20} /></button>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-fb-navy">Payments</h1>
                <div className="relative" ref={moreActionsRef}>
                    <button 
                        onClick={() => setMoreActionsOpen(!moreActionsOpen)} 
                        className={`flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 rounded-lg font-bold text-fb-navy hover:bg-gray-50 transition-all ${moreActionsOpen ? 'ring-2 ring-fb-blue/20' : ''}`}
                    >
                        More Actions <ChevronDown size={20} className={moreActionsOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </button>
                    {moreActionsOpen && (
                        <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white border border-gray-200 rounded-lg shadow-2xl z-[70] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div onClick={() => navigate('/reports')} className="px-5 py-3 hover:bg-fb-gray flex items-center gap-4 cursor-pointer group">
                                <BarChart3 size={20} className="text-gray-400 group-hover:text-fb-blue" />
                                <span className="text-[15px] font-medium text-fb-navy">View Payments Reports</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showPromo && (
                <div className="bg-white border border-gray-200 rounded-[32px] p-12 text-center relative shadow-sm animate-in zoom-in-95 duration-300 group hover:shadow-lg transition-all border-b-8 border-b-fb-blue">
                    <button onClick={() => setShowPromo(false)} className="absolute top-6 right-6 text-gray-300 hover:text-fb-navy"><X size={24} /></button>
                    <h2 className="text-4xl font-black text-fb-blue mb-8 tracking-tight">Precision Bookkeeping</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-lg">Log payments manually when you get a check or cash, and FreshBooks will automatically balance your ledger and mark invoices as paid.</p>
                    <button onClick={() => setShowInlineForm(true)} className="bg-fb-green hover:brightness-110 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-fb-green/20 transition-all active:scale-95">Record Manual Entry</button>
                </div>
            )}

            <div className="pt-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 h-16 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-fb-navy tracking-tight">Invoice Settlements</h2>
                        <button onClick={() => setShowInlineForm(true)} className="bg-fb-green text-white p-2 rounded-xl shadow-lg transition-all hover:brightness-110 active:scale-95">
                            <Plus size={24} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue transition-colors" size={20} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none w-full md:w-80 text-sm font-bold text-fb-navy shadow-sm transition-all" 
                                placeholder="Search client or invoice #..." 
                            />
                        </div>
                        <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} /> Filters
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-fb-green min-h-[400px]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                            <tr>
                                <th className="p-8">Client / Invoice Sequence</th>
                                <th className="p-8">Settlement Date</th>
                                <th className="p-8">Method / Transaction Notes</th>
                                <th className="p-8 text-right">Settled Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {showInlineForm && (
                                <tr className="bg-green-50 border-b-2 border-fb-green animate-in slide-in-from-top-2 duration-300 relative z-20">
                                    <td className="p-8 align-top relative">
                                        <label className="text-[10px] font-black text-fb-blue uppercase tracking-widest block mb-2">Target Invoice</label>
                                        <input 
                                            autoFocus
                                            value={formData.invoice}
                                            onFocus={() => setShowInvoiceDropdown(true)}
                                            onChange={e => setFormData({...formData, invoice: e.target.value})}
                                            placeholder="Invoice Number"
                                            className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy shadow-sm"
                                        />
                                        {showInvoiceDropdown && (
                                            <div className="absolute top-[calc(100%-12px)] left-8 right-8 bg-white border-2 border-fb-blue rounded-2xl shadow-2xl z-[80] py-2 max-h-64 overflow-y-auto">
                                                {invoices.filter(i => i.status !== 'Paid').length > 0 ? (
                                                    invoices.filter(i => i.status !== 'Paid').map(inv => (
                                                        <div key={inv.id} onClick={() => selectInvoiceSuggestion(inv)} className="px-5 py-4 hover:bg-fb-gray cursor-pointer border-b border-gray-50 last:border-0 transition-colors">
                                                            <span className="font-black text-fb-navy block text-lg">{inv.number}</span>
                                                            <div className="flex justify-between items-center mt-1">
                                                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{inv.client}</span>
                                                                <span className="text-sm font-black text-fb-blue">₱{inv.amount.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-10 text-center flex flex-col items-center">
                                                        <FileText size={32} className="text-gray-100 mb-4" />
                                                        <p className="text-xs text-gray-400 font-bold italic">No unpaid invoices found</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-8 align-top">
                                        <label className="text-[10px] font-black text-fb-blue uppercase tracking-widest block mb-2">Logged Date</label>
                                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue font-black text-fb-navy shadow-sm" />
                                    </td>
                                    <td className="p-8 align-top">
                                        <label className="text-[10px] font-black text-fb-blue uppercase tracking-widest block mb-2">Instrument</label>
                                        <select value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none mb-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue font-black text-fb-navy shadow-sm cursor-pointer">
                                            <option>Cash</option><option>Check</option><option>Credit Card</option><option>Bank Transfer</option>
                                        </select>
                                        <input placeholder="Internal payment notes..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue text-xs font-bold shadow-sm" />
                                    </td>
                                    <td className="p-8 align-top">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-black text-fb-blue uppercase tracking-widest block mb-2 text-right">Amount Settled (PHP)</label>
                                                <input value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-4 text-right font-black focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue text-2xl text-fb-navy shadow-sm" />
                                            </div>
                                            <div className="flex flex-col gap-4 pt-6">
                                                <button onClick={handleSavePayment} className="w-14 h-14 bg-fb-green text-white rounded-2xl flex items-center justify-center hover:brightness-110 shadow-xl shadow-fb-green/20 transform active:scale-90 transition-all">
                                                    <Check size={32} strokeWidth={3} />
                                                </button>
                                                <button onClick={() => setShowInlineForm(false)} className="w-14 h-14 bg-white border-2 border-gray-100 text-gray-300 rounded-2xl flex items-center justify-center hover:bg-fb-gray hover:text-fb-navy transition-all">
                                                    <X size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {filteredPayments.map(pay => (
                                <tr key={pay.id} className="hover:bg-fb-gray cursor-default group transition-all">
                                    <td className="p-8 border-l-8 border-transparent group-hover:border-fb-green transition-all">
                                        <div className="font-black text-fb-navy group-hover:text-fb-blue text-lg leading-tight mb-1">{pay.client}</div>
                                        <div className="text-fb-blue text-[10px] font-black uppercase tracking-widest font-mono">SEQ-#{pay.invoice}</div>
                                    </td>
                                    <td className="p-8">
                                        <div className="font-black text-fb-navy text-xs mb-1">{pay.date}</div>
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Entry Verified</div>
                                    </td>
                                    <td className="p-8">
                                        <div className="font-black text-fb-navy text-sm mb-1">{pay.method}</div>
                                        <div className="text-gray-400 text-xs italic font-bold max-w-xs line-clamp-1 group-hover:line-clamp-none transition-all">"{pay.notes || 'No accompanying notes'}"</div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="font-black text-fb-navy text-2xl leading-none mb-1">₱{pay.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                        <div className="bg-fb-green/10 text-fb-green text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block tracking-widest border border-fb-green/20">
                                            SETTLED
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPayments.length === 0 && !showInlineForm && (
                                <tr>
                                    <td colSpan={4} className="p-32 text-center bg-gray-50/20">
                                        <div className="flex flex-col items-center">
                                            <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8 text-gray-100 shadow-inner">
                                                <DollarSign size={48} />
                                            </div>
                                            <p className="text-gray-400 font-black text-2xl italic tracking-tight">No settlement history found</p>
                                            <button onClick={() => setSearchTerm('')} className="text-fb-blue font-bold text-sm mt-4 hover:underline">Clear Search Filter</button>
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