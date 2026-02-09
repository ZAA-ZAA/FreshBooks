// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ChevronLeft, ChevronDown, Download, X, 
    Filter, FileText, ChevronRight, Home, Briefcase, Receipt, Smile, Loader2, Send
} from 'lucide-react';
import { expensesApi, reportsApi, ExpenseData } from '../api';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getEmailError } from '../utils/validation';
import { addImageToPdfMultiPage } from '../utils/pdfHelpers';

const CATEGORY_ICONS = {
    'Personal': <Smile size={16} className="text-emerald-500" />,
    'Professional Services': <Briefcase size={16} className="text-fb-blue" />,
    'Rent or Lease': <Home size={16} className="text-amber-500" />,
    'Operating Expenses': <Receipt size={16} className="text-pink-500" />,
    'Default': <Receipt size={16} className="text-gray-400" />
};

export default function ExpenseReport() {
    const navigate = useNavigate();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [expenses, setExpenses] = useState<ExpenseData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showActions, setShowActions] = useState(false);
    const [showSendModal, setShowSendModal] = useState(false);
    const [sendToEmail, setSendToEmail] = useState('');
    const [attachPdf, setAttachPdf] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    
    const [dateRange, setDateRange] = useState('This Year');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const reportContentRef = useRef(null);
    const actionsRef = useRef(null);

    useEffect(() => {
        loadExpenses();
        const handleClickOutside = (e) => {
            if (actionsRef.current && !actionsRef.current.contains(e.target)) setShowActions(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadExpenses = async () => {
        setIsLoading(true);
        const response = await expensesApi.getAll();
        if (response.success && response.data) {
            setExpenses(response.data);
        }
        setIsLoading(false);
    };

    const reportData = useMemo(() => {
        let filtered = expenses;
        if (categoryFilter !== 'All Categories') {
            filtered = filtered.filter(e => e.category === categoryFilter);
        }

        const grouped = filtered.reduce((acc, exp) => {
            const cat = exp.category || 'Uncategorized';
            if (!acc[cat]) acc[cat] = { name: cat, items: [], total: 0 };
            acc[cat].items.push(exp);
            acc[cat].total += parseFloat(exp.amount as any) || 0;
            return acc;
        }, {});

        const totalExpenses = filtered.reduce((acc, curr) => acc + (parseFloat(curr.amount as any) || 0), 0);
        return { groups: Object.values(grouped), totalExpenses };
    }, [expenses, categoryFilter]);

    const handleSavePdf = async () => {
        setShowActions(false);
        if (!reportContentRef.current) return;
        try {
            const canvas = await html2canvas(reportContentRef.current, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            addImageToPdfMultiPage(pdf, imgData, canvas.width, canvas.height);
            pdf.save(`expense-report-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (_) {}
    };

    const handleExportExcel = () => {
        setShowActions(false);
        const headers = ['Category', 'Merchant', 'Date', 'Description', 'Amount (PHP)'];
        const rows = [headers];
        (reportData.groups as any[]).forEach(group => {
            group.items.forEach((exp: any) => {
                rows.push([
                    group.name,
                    exp.merchant || '',
                    exp.date || '',
                    exp.description || '',
                    (exp.amount != null ? exp.amount : 0).toFixed(2)
                ]);
            });
        });
        // RFC 4180 CSV: comma delimiter, fields in quotes, " escaped as ""
        const escapeCsv = (v) => {
            const s = v == null ? '' : String(v);
            const safe = s.replace(/\r?\n/g, ' ').replace(/\t/g, ' ');
            return '"' + safe.replace(/"/g, '""') + '"';
        };
        const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\r\n');
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSendReport = async () => {
        const to = sendToEmail.trim();
        if (!to) { setSendError('Enter recipient email.'); return; }
        const err = getEmailError(to);
        if (err) { setSendError(err); return; }
        setIsSendingEmail(true);
        setSendError(null);
        let pdfBase64 = '';
        if (attachPdf && reportContentRef.current) {
            try {
                const canvas = await html2canvas(reportContentRef.current, { scale: 2, useCORS: true, logging: false });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                addImageToPdfMultiPage(pdf, imgData, canvas.width, canvas.height);
                const dataUrl = pdf.output('dataurlstring') || pdf.output('datauristring') || '';
                pdfBase64 = (dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl) || '';
            } catch (_) {}
        }
        const res = await reportsApi.sendEmail(to, { attachPdf: !!pdfBase64, pdfBase64, pdfFilename: 'expense-report.pdf' });
        if (res?.success) {
            setShowSendModal(false);
            setSendToEmail('');
        } else {
            setSendError(res?.error || 'Failed to send email.');
        }
        setIsSendingEmail(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#0075dd]" size={32} />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-500 font-sans">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-[60] print:hidden">
                <div className="flex flex-col">
                    <Link to="/reports" className="flex items-center gap-1 text-xs font-bold text-fb-blue hover:underline mb-2">
                        <ChevronLeft size={14} /> Reports
                    </Link>
                    <h1 className="text-4xl font-black text-[#002a63] tracking-tighter">Expense Report</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative" ref={actionsRef}>
                        <button type="button" onClick={() => setShowActions(!showActions)} className="flex items-center gap-2 border border-gray-200 px-5 py-2.5 rounded-lg text-sm font-bold text-[#002a63] hover:bg-gray-50">
                            More Actions <ChevronDown size={14} className={showActions ? 'rotate-180' : ''} />
                        </button>
                        {showActions && (
                            <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-[70]">
                                <button type="button" onClick={handleSavePdf} className="w-full text-left px-5 py-2.5 hover:bg-gray-50 text-xs font-bold text-gray-600 flex items-center gap-3"><Download size={16} className="text-gray-400" /> Save as PDF</button>
                                <button type="button" onClick={handleExportExcel} className="w-full text-left px-5 py-2.5 hover:bg-gray-50 text-xs font-bold text-gray-600 flex items-center gap-3"><Download size={16} className="text-gray-400" /> Export to Excel</button>
                            </div>
                        )}
                    </div>
                    <button type="button" onClick={() => { setShowSendModal(true); setSendToEmail(''); setSendError(null); }} className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-2.5 rounded-lg font-black shadow-md flex items-center gap-2">
                        <Send size={18} /> Send...
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto custom-scroll p-12 bg-[#f5f7f9] print:bg-white print:p-0">
                    <div ref={reportContentRef} className="max-w-[900px] mx-auto bg-white rounded-sm border border-gray-200 shadow-sm p-16 print:border-none print:shadow-none min-h-[1000px]">
                        <div className="mb-12 border-b-4 border-[#0075dd] pb-8">
                            <h2 className="text-4xl font-black text-[#0075dd] mb-4 tracking-tighter">Expense Report</h2>
                            <div className="space-y-1 text-xs text-gray-500 font-bold">
                                <p>Demo</p>
                                <p>Grouped by Category (PHP)</p>
                                <p>For Jan 1, 2026 - Dec 31, 2026</p>
                                <button className="text-fb-blue mt-6 hover:underline font-black uppercase text-[10px] tracking-widest print:hidden">Summary</button>
                            </div>
                        </div>

                        <div className="mb-16">
                            <table className="w-full text-xs font-bold text-gray-600">
                                <tbody>
                                    <tr className="border-t border-gray-100">
                                        <td className="py-2.5 px-1 uppercase tracking-widest text-[9px] text-gray-400">Summary</td>
                                        <td></td>
                                    </tr>
                                    <tr className="text-fb-navy font-black">
                                        <td className="py-4 px-1 text-sm">Total Expenses (PHP)</td>
                                        <td className="py-4 text-right">
                                            <div className="text-lg">₱{reportData.totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                            <div className="text-[9px] font-black text-gray-400">PHP</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {(reportData.groups as any[]).length > 0 ? (reportData.groups as any[]).map(group => (
                            <div key={group.name} className="mb-16">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1 bg-gray-50 rounded">
                                        {CATEGORY_ICONS[group.name] || CATEGORY_ICONS['Default']}
                                    </div>
                                    <span className="text-sm font-black text-fb-blue hover:underline cursor-pointer">{group.name}</span>
                                </div>
                                <table className="w-full text-[11px] text-gray-600 border-t border-blue-50">
                                    <thead>
                                        <tr className="text-fb-navy font-black uppercase tracking-tighter text-[9px] bg-gray-50/30">
                                            <th className="py-4 text-left pl-2">Merchant/Source/Client</th>
                                            <th className="py-4 text-left">Date/Description</th>
                                            <th className="py-4 text-right">Tax 1</th>
                                            <th className="py-4 text-right">Tax 2</th>
                                            <th className="py-4 text-right pr-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 border-b border-gray-100">
                                        {group.items.map(exp => (
                                            <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 pl-10">
                                                    <div className="font-bold text-fb-navy">{exp.merchant}</div>
                                                    <div className="text-gray-400 text-[10px]">{exp.client_name || '—'}</div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="font-medium text-gray-600">{exp.date}</div>
                                                    <div className="text-gray-400 text-[10px] italic">{exp.description || '—'}</div>
                                                </td>
                                                <td className="py-4 text-right">0.00</td>
                                                <td className="py-4 text-right">0.00</td>
                                                <td className="py-4 text-right pr-2 font-black text-fb-navy">₱{parseFloat(exp.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="text-fb-navy font-black">
                                            <td colSpan={2} className="py-4 text-[10px] uppercase tracking-widest text-gray-400">Total for {group.name}</td>
                                            <td colSpan={3} className="py-4 text-right pr-2">
                                                <div className="text-sm">₱{group.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                                <div className="text-[9px] text-gray-400 uppercase">PHP</div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )) : (
                            <div className="py-32 text-center">
                                <FileText size={64} className="text-gray-100 mx-auto mb-6" />
                                <p className="text-xl font-black text-gray-300 italic tracking-tighter">No expenses found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <aside className="w-[340px] border-l border-gray-200 bg-white p-10 flex flex-col gap-10 sticky top-0 h-screen shadow-sm z-40 print:hidden">
                    <div>
                        <h3 className="text-2xl font-black text-[#002a63] mb-6 tracking-tighter">Settings</h3>
                        <div onClick={() => setIsFiltersOpen(true)} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer group transition-all">
                            <div className="flex items-center gap-4">
                                <Filter size={18} className="text-gray-400 group-hover:text-fb-blue" />
                                <div>
                                    <div className="text-sm font-bold text-[#002a63]">Filters</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">No filters applied</div>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-gray-300" />
                        </div>
                    </div>
                </aside>

                <aside className={`fixed top-0 right-0 h-full w-[340px] border-l border-gray-200 bg-white p-10 flex flex-col gap-10 shadow-2xl z-[100] transition-transform duration-300 ease-in-out ${isFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-2xl font-black text-[#002a63] tracking-tighter">Filters</h3>
                             <button onClick={() => setIsFiltersOpen(false)} className="text-gray-300 hover:text-fb-blue"><X size={24} /></button>
                        </div>
                        <button className="text-xs font-black text-fb-blue hover:underline mb-10 block uppercase tracking-widest">Reset all</button>
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date Range</label>
                                <div className="relative group">
                                    <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold text-[#002a63] appearance-none outline-none focus:ring-4 ring-blue-50 bg-none pr-12">
                                        <option>This Year</option><option>Last Year</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</label>
                                <div className="relative group">
                                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold text-[#002a63] appearance-none outline-none focus:ring-4 ring-blue-50 bg-none pr-12">
                                        <option>All Categories</option>
                                        <option>Rent or Lease</option><option>Professional Services</option><option>Operating Expenses</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto flex items-center gap-6 pt-10 border-t border-gray-100">
                        <button onClick={() => setIsFiltersOpen(false)} className="flex-1 text-sm font-black text-[#002a63] hover:underline uppercase">Close</button>
                        <button onClick={() => setIsFiltersOpen(false)} className="flex-1 bg-fb-green text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl">Apply</button>
                    </div>
                </aside>
                {isFiltersOpen && <div className="fixed inset-0 bg-[#002a63]/20 backdrop-blur-[2px] z-[90]" onClick={() => setIsFiltersOpen(false)} />}

                {showSendModal && (
                    <div className="fixed inset-0 z-[305] flex items-center justify-center bg-fb-navy/70 backdrop-blur-md p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black text-fb-navy">Send Report</h2>
                                    <button type="button" onClick={() => { setShowSendModal(false); setSendError(null); }} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-600 mb-2">To (email)</label>
                                    <input type="email" value={sendToEmail} onChange={e => setSendToEmail(e.target.value)} placeholder="recipient@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 ring-fb-blue outline-none" />
                                </div>
                                <div className="mb-6 flex items-center gap-3">
                                    <input type="checkbox" id="exp-report-attach-pdf" checked={attachPdf} onChange={e => setAttachPdf(e.target.checked)} className="rounded border-gray-300 text-fb-blue focus:ring-fb-blue" />
                                    <label htmlFor="exp-report-attach-pdf" className="text-sm font-medium text-gray-700">Attach PDF to email</label>
                                </div>
                                {sendError && <p className="text-red-600 text-sm font-medium mb-4">{sendError}</p>}
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => { setShowSendModal(false); setSendError(null); }} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="button" onClick={handleSendReport} disabled={isSendingEmail} className="px-6 py-2 bg-fb-green text-white font-black rounded-lg hover:brightness-110 disabled:opacity-50 flex items-center gap-2">
                                        {isSendingEmail ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
