// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ChevronLeft, ChevronDown, Printer, Download, Search, X, 
    Calendar, Filter, FileText, MoreHorizontal, Send, ChevronRight, Loader2
} from 'lucide-react';
import { invoicesApi, clientsApi, InvoiceData, ClientData } from '../api';

export default function InvoiceDetailsReport() {
    const navigate = useNavigate();
    
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [showActions, setShowActions] = useState(false);
    
    const [dateRange, setDateRange] = useState('This Year');
    const [dateType, setDateType] = useState('Issue Date');
    const [clientFilter, setClientFilter] = useState('All Clients');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [clients, setClients] = useState<ClientData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const actionsRef = useRef(null);

    useEffect(() => {
        loadData();

        const handleClickOutside = (event) => {
            if (actionsRef.current && !actionsRef.current.contains(event.target)) {
                setShowActions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const [invoicesRes, clientsRes] = await Promise.all([
            invoicesApi.getAll(),
            clientsApi.getAll()
        ]);
        if (invoicesRes.success && invoicesRes.data) setInvoices(invoicesRes.data);
        if (clientsRes.success && clientsRes.data) setClients(clientsRes.data);
        setIsLoading(false);
    };

    const resetFilters = () => {
        setDateRange('This Year');
        setDateType('Issue Date');
        setClientFilter('All Clients');
        setStatusFilter('All Statuses');
    };

    const reportData = useMemo(() => {
        let filtered = invoices;

        if (statusFilter !== 'All Statuses') {
            filtered = filtered.filter(i => i.status === statusFilter);
        }

        if (clientFilter !== 'All Clients') {
            filtered = filtered.filter(i => i.client === clientFilter);
        }

        const grouped = filtered.reduce((acc, inv) => {
            const clientName = inv.client || 'Unknown Client';
            if (!acc[clientName]) {
                acc[clientName] = {
                    name: clientName,
                    invoices: [],
                    totalInvoiced: 0,
                    amountPaid: 0
                };
            }
            acc[clientName].invoices.push(inv);
            acc[clientName].totalInvoiced += parseFloat(inv.total as any) || 0;
            if (inv.status === 'Paid') {
                acc[clientName].amountPaid += parseFloat(inv.total as any) || 0;
            }
            return acc;
        }, {});

        const grandTotal = filtered.reduce((acc, curr) => acc + (parseFloat(curr.total as any) || 0), 0);
        const grandPaid = filtered.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + (parseFloat(curr.total as any) || 0), 0);

        return {
            clients: Object.values(grouped),
            grandTotal,
            grandPaid,
            grandDue: grandTotal - grandPaid
        };
    }, [invoices, clientFilter, statusFilter]);

    const handlePrint = () => {
        window.print();
        setShowActions(false);
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
                    <h1 className="text-4xl font-black text-[#002a63] tracking-tighter">Invoice Details</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative" ref={actionsRef}>
                         <button 
                            onClick={() => setShowActions(!showActions)}
                            className="flex items-center gap-2 border border-gray-200 px-5 py-2.5 rounded-lg text-sm font-bold text-[#002a63] hover:bg-gray-50 transition-all shadow-sm"
                         >
                            More Actions <ChevronDown size={14} className={`transition-transform ${showActions ? 'rotate-180' : ''}`} />
                         </button>
                         {showActions && (
                             <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-[70] animate-in fade-in slide-in-from-top-1 duration-200">
                                 <button className="w-full text-left px-5 py-2.5 hover:bg-gray-50 text-xs font-bold text-gray-600 flex items-center gap-3"><Download size={16} className="text-gray-400" /> Export for Excel</button>
                                 <button onClick={handlePrint} className="w-full text-left px-5 py-2.5 hover:bg-gray-50 text-xs font-bold text-gray-600 flex items-center gap-3"><Printer size={16} className="text-gray-400" /> Print</button>
                             </div>
                         )}
                    </div>
                    <button className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-2.5 rounded-lg font-black shadow-md transition-all">Send...</button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto custom-scroll p-12 bg-[#f5f7f9] print:bg-white print:p-0">
                    <div className="max-w-[900px] mx-auto bg-white rounded-sm border border-gray-200 shadow-sm p-16 print:border-none print:shadow-none min-h-[1000px]">
                        
                        <div className="mb-12 border-b-4 border-[#0075dd] pb-8">
                            <h2 className="text-4xl font-black text-[#0075dd] mb-4 tracking-tighter">Invoice Details</h2>
                            <div className="space-y-1 text-xs text-gray-500 font-bold">
                                <p>Demo</p>
                                <p>Total Invoiced: {reportData.grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})} (PHP)</p>
                                <p>For Jan 1, 2026 - Dec 31, 2026</p>
                                <button className="text-fb-blue mt-6 hover:underline font-black uppercase text-[10px] tracking-widest print:hidden">All Clients</button>
                            </div>
                        </div>

                        <div className="mb-16">
                            <table className="w-full text-xs font-bold text-gray-600">
                                <tbody>
                                    <tr className="border-t border-gray-100">
                                        <td className="py-2.5 px-1 uppercase tracking-widest text-[9px] text-gray-400">Summary</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-10">Total Invoiced</td>
                                        <td className="py-2 text-right">{reportData.grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-10 border-b border-gray-50">Amount Paid</td>
                                        <td className="py-2 text-right border-b border-gray-50">{reportData.grandPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    </tr>
                                    <tr className="text-fb-navy font-black">
                                        <td className="py-4 px-1 text-sm">Amount Due</td>
                                        <td className="py-4 text-right">
                                            <div className="text-lg">₱{reportData.grandDue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                            <div className="text-[9px] font-black text-gray-400">PHP</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {(reportData.clients as any[]).length > 0 ? (reportData.clients as any[]).map(client => (
                            <div key={client.name} className="mb-24">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-fb-yellow/20 text-fb-navy font-black text-xs flex items-center justify-center border border-fb-yellow/30 uppercase">
                                        {client.name.substring(0, 2)}
                                    </div>
                                    <span className="text-base font-black text-fb-blue hover:underline cursor-pointer">{client.name}</span>
                                </div>

                                <div className="mb-10">
                                    <table className="w-full text-xs font-bold text-gray-600">
                                        <tbody>
                                            <tr className="border-t border-gray-100">
                                                <td className="py-2 px-1 uppercase tracking-widest text-[9px] text-gray-400">Summary</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-10">Total Invoiced</td>
                                                <td className="py-2 text-right">{client.totalInvoiced.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-10 border-b border-gray-50">Amount Paid</td>
                                                <td className="py-2 text-right border-b border-gray-50">{client.amountPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            </tr>
                                            <tr className="text-fb-navy font-black">
                                                <td className="py-4 px-1 text-sm">Amount Due</td>
                                                <td className="py-4 text-right">
                                                    <div className="text-lg">₱{(client.totalInvoiced - client.amountPaid).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                                    <div className="text-[9px] font-black text-gray-400">PHP</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {client.invoices.map(inv => (
                                    <div key={inv.id} className="mb-12 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex justify-between items-end mb-4 text-[11px] font-black">
                                            <div className="text-gray-400 uppercase tracking-tighter">
                                                Invoice #: <span className="text-fb-blue hover:underline cursor-pointer">{inv.number}</span><br/>
                                                Issued: <span className="text-fb-navy">{inv.date}</span>
                                            </div>
                                            <div className="text-fb-navy uppercase tracking-widest text-[10px]">Status: {inv.status}</div>
                                        </div>

                                        <table className="w-full text-[11px] text-gray-600 border-t border-blue-50">
                                            <thead>
                                                <tr className="text-fb-navy font-black uppercase tracking-tighter text-[9px] bg-gray-50/30">
                                                    <th className="py-4 text-left pl-2">Description</th>
                                                    <th className="py-4 text-right">Rate</th>
                                                    <th className="py-4 text-right">Quantity</th>
                                                    <th className="py-4 text-right">Tax 1</th>
                                                    <th className="py-4 text-right">Tax 2</th>
                                                    <th className="py-4 text-right pr-2">Line Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 border-b border-gray-100">
                                                {inv.items?.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                        <td className="py-5 pl-10 font-bold text-fb-navy max-w-xs">{item.description || '—'}</td>
                                                        <td className="py-5 text-right font-medium">₱{parseFloat(item.rate || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="py-5 text-right font-medium">{item.quantity}</td>
                                                        <td className="py-5 text-right font-medium">0.00</td>
                                                        <td className="py-5 text-right font-medium">0.00</td>
                                                        <td className="py-5 text-right pr-2 font-black text-fb-navy">₱{((item.rate || 0) * (item.quantity || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-t border-gray-100">
                                                    <td colSpan={4}></td>
                                                    <td className="py-4 text-right font-black text-[#002a63] text-xs">Invoice Total</td>
                                                    <td className="py-4 text-right pr-2 font-black text-[#002a63] text-xs">{(inv.total || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                </tr>
                                                <tr className="border-t-2 border-gray-100">
                                                    <td colSpan={4}></td>
                                                    <td className="py-4 text-right font-black text-[#002a63] uppercase tracking-widest text-[9px]">Amount Due</td>
                                                    <td className="py-4 text-right pr-2 font-black text-[#002a63]">
                                                        <div className="text-sm">₱{inv.status === 'Paid' ? '0.00' : (inv.total || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                                        <div className="text-[9px] text-gray-400 uppercase leading-none mt-1">PHP</div>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        )) : (
                            <div className="py-32 text-center">
                                <FileText size={64} className="text-gray-100 mx-auto mb-6" />
                                <p className="text-xl font-black text-gray-300 italic tracking-tighter">No invoices found for the current filters.</p>
                            </div>
                        )}
                    </div>
                </div>

                <aside className="w-[340px] border-l border-gray-200 bg-white p-10 flex flex-col gap-10 overflow-y-auto sticky top-0 h-screen shadow-sm z-40 print:hidden">
                    <div>
                        <h3 className="text-2xl font-black text-[#002a63] mb-6 tracking-tighter">Settings</h3>
                        
                        <div className="space-y-4">
                            <div 
                                onClick={() => setIsFiltersOpen(true)}
                                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                            >
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

                        <div className="h-[1px] bg-gray-100 my-8"></div>
                        
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                            These settings are specific to this report version. Save as a custom report to preserve your configurations.
                        </p>
                    </div>
                </aside>

                <aside 
                    className={`fixed top-0 right-0 h-full w-[340px] border-l border-gray-200 bg-white p-10 flex flex-col gap-10 overflow-y-auto shadow-2xl z-[100] transition-transform duration-300 ease-in-out ${isFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-2xl font-black text-[#002a63] tracking-tighter">Filters</h3>
                             <button onClick={() => setIsFiltersOpen(false)} className="text-gray-300 hover:text-fb-blue transition-colors"><X size={24} /></button>
                        </div>
                        <button onClick={resetFilters} className="text-xs font-black text-fb-blue hover:underline mb-10 block uppercase tracking-widest">Reset all</button>
                        
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date Range</label>
                                <div className="relative group">
                                    <select 
                                        value={dateRange}
                                        onChange={e => setDateRange(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold text-[#002a63] appearance-none outline-none focus:ring-4 ring-blue-50 focus:border-fb-blue transition-all shadow-sm bg-none pr-12"
                                    >
                                        <option>This Year</option>
                                        <option>Last Year</option>
                                        <option>This Month</option>
                                        <option>Custom</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-fb-blue transition-colors" size={20} />
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${dateType === 'Issue Date' ? 'border-fb-blue bg-white' : 'border-gray-300 hover:border-gray-400'}`}>
                                        {dateType === 'Issue Date' && <div className="w-3.5 h-3.5 rounded-full bg-fb-blue animate-in zoom-in-50" />}
                                    </div>
                                    <input type="radio" className="hidden" checked={dateType === 'Issue Date'} onChange={() => setDateType('Issue Date')} />
                                    <span className={`text-sm font-bold transition-colors ${dateType === 'Issue Date' ? 'text-[#002a63]' : 'text-gray-400'}`}>Issue Date</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${dateType === 'Paid Date' ? 'border-fb-blue bg-white' : 'border-gray-300 hover:border-gray-400'}`}>
                                        {dateType === 'Paid Date' && <div className="w-3.5 h-3.5 rounded-full bg-fb-blue animate-in zoom-in-50" />}
                                    </div>
                                    <input type="radio" className="hidden" checked={dateType === 'Paid Date'} onChange={() => setDateType('Paid Date')} />
                                    <span className={`text-sm font-bold transition-colors ${dateType === 'Paid Date' ? 'text-[#002a63]' : 'text-gray-400'}`}>Paid Date</span>
                                </label>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Clients</label>
                                <div className="relative group">
                                    <select 
                                        value={clientFilter}
                                        onChange={e => setClientFilter(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold text-[#002a63] appearance-none outline-none focus:ring-4 ring-blue-50 focus:border-fb-blue transition-all shadow-sm bg-none pr-12"
                                    >
                                        <option>All Clients</option>
                                        {clients.map(c => <option key={c.id} value={c.company}>{c.company}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-fb-blue transition-colors" size={20} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Invoice Status</label>
                                <div className="relative group">
                                    <select 
                                        value={statusFilter}
                                        onChange={e => setStatusFilter(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold text-[#002a63] appearance-none outline-none focus:ring-4 ring-blue-50 focus:border-fb-blue transition-all shadow-sm bg-none pr-12"
                                    >
                                        <option>All Statuses</option>
                                        <option>Paid</option>
                                        <option>Unpaid</option>
                                        <option>Draft</option>
                                        <option>Overdue</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-fb-blue transition-colors" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto flex items-center gap-6 pt-10 border-t border-gray-100">
                        <button onClick={() => setIsFiltersOpen(false)} className="flex-1 text-sm font-black text-[#002a63] hover:underline uppercase tracking-widest">Close</button>
                        <button onClick={() => setIsFiltersOpen(false)} className="flex-1 bg-fb-green hover:bg-fb-darkGreen text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-fb-green/20 active:scale-95 transition-all">Apply</button>
                    </div>
                </aside>
                
                {isFiltersOpen && (
                    <div 
                        className="fixed inset-0 bg-[#002a63]/20 backdrop-blur-[2px] z-[90] animate-in fade-in duration-300"
                        onClick={() => setIsFiltersOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
