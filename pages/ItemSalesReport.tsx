// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ChevronLeft, ChevronDown, X, Filter, ChevronRight
} from 'lucide-react';

export default function ItemSalesReport() {
    const navigate = useNavigate();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [invoices, setInvoices] = useState([]);
    
    // Filters
    const [dateRange, setDateRange] = useState('This Year');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
        setInvoices(stored);
    }, []);

    const reportData = useMemo(() => {
        const itemMap = {};
        let totalUnits = 0;
        let totalSales = 0;

        invoices.forEach(inv => {
            inv.items?.forEach(item => {
                const itemName = item.name || 'Uncategorized Item';
                if (!itemMap[itemName]) {
                    itemMap[itemName] = { name: itemName, entries: [], totalQty: 0, totalAmount: 0 };
                }
                const lineTotal = item.rate * item.qty;
                itemMap[itemName].entries.push({
                    client: inv.client,
                    number: inv.number,
                    date: inv.date,
                    rate: item.rate,
                    qty: item.qty,
                    total: lineTotal
                });
                itemMap[itemName].totalQty += item.qty;
                itemMap[itemName].totalAmount += lineTotal;
                totalUnits += item.qty;
                totalSales += lineTotal;
            });
        });

        return { groups: Object.values(itemMap), totalUnits, totalSales };
    }, [invoices]);

    return (
        <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-500 font-sans">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-[60] print:hidden">
                <div className="flex flex-col">
                    <Link to="/reports" className="flex items-center gap-1 text-xs font-bold text-fb-blue hover:underline mb-2">
                        <ChevronLeft size={14} /> Reports
                    </Link>
                    <h1 className="text-4xl font-black text-[#002a63] tracking-tighter">Item Sales</h1>
                </div>
                <button className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-2.5 rounded-lg font-black shadow-md">Send...</button>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto custom-scroll p-12 bg-[#f5f7f9] print:bg-white print:p-0">
                    <div className="max-w-[900px] mx-auto bg-white rounded-sm border border-gray-200 shadow-sm p-16 print:border-none print:shadow-none min-h-[1000px]">
                        <div className="mb-12 border-b-4 border-[#0075dd] pb-8">
                            <h2 className="text-4xl font-black text-[#0075dd] mb-4 tracking-tighter">Item Sales</h2>
                            <div className="space-y-1 text-xs text-gray-500 font-bold">
                                <p>Demo</p>
                                <p>All Items</p>
                                <p>For Jan 1, 2026 - Dec 31, 2026</p>
                                <button className="text-fb-blue mt-6 hover:underline font-black uppercase text-[10px] tracking-widest print:hidden">Item Sales Summary</button>
                            </div>
                        </div>

                        <div className="mb-16">
                            <table className="w-full text-xs font-bold text-gray-600">
                                <tbody>
                                    <tr className="border-t border-gray-100">
                                        <td className="py-2.5 px-1 uppercase tracking-widest text-[9px] text-gray-400">Total Units</td>
                                        <td className="py-2.5 text-right font-black text-fb-navy">{reportData.totalUnits}</td>
                                    </tr>
                                    <tr className="text-fb-navy font-black border-t border-gray-100">
                                        <td className="py-4 px-1 text-sm">Total Item Sales (PHP)</td>
                                        <td className="py-4 text-right">
                                            <div className="text-lg">₱{reportData.totalSales.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                            <div className="text-[9px] font-black text-gray-400">PHP</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {reportData.groups.map(group => (
                            <div key={group.name} className="mb-20">
                                <div className="mb-4">
                                    <span className="text-sm font-black text-fb-blue hover:underline cursor-pointer">{group.name}</span>
                                </div>
                                <table className="w-full text-[11px] text-gray-600 border-t border-blue-50">
                                    <thead>
                                        <tr className="text-fb-navy font-black uppercase tracking-tighter text-[9px] bg-gray-50/30">
                                            <th className="py-4 text-left pl-2">Client Name</th>
                                            <th className="py-4 text-left">Invoice</th>
                                            <th className="py-4 text-left">Invoice Date</th>
                                            <th className="py-4 text-right">Unit Cost</th>
                                            <th className="py-4 text-right">Quantity</th>
                                            <th className="py-4 text-right">Discount</th>
                                            <th className="py-4 text-right pr-2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 border-b border-gray-100">
                                        {group.entries.map((entry, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 pl-2 font-bold text-fb-navy">{entry.client}</td>
                                                <td className="py-4 font-black text-fb-blue hover:underline">{entry.number}</td>
                                                <td className="py-4">{entry.date}</td>
                                                <td className="py-4 text-right">₱{entry.rate.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                <td className="py-4 text-right">{entry.qty}</td>
                                                <td className="py-4 text-right">₱0.00</td>
                                                <td className="py-4 text-right pr-2 font-black text-fb-navy">₱{entry.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="text-fb-navy font-black">
                                            <td colSpan={4} className="py-4 text-[10px] uppercase tracking-widest text-gray-400">Total</td>
                                            <td className="py-4 text-right">{group.totalQty}</td>
                                            <td className="py-4 text-right">₱0.00</td>
                                            <td className="py-4 text-right pr-2">
                                                <div className="text-sm">₱{group.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                                <div className="text-[9px] text-gray-400 uppercase">PHP</div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ))}
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
                        </div>
                    </div>
                    <div className="mt-auto flex items-center gap-6 pt-10 border-t border-gray-100">
                        <button onClick={() => setIsFiltersOpen(false)} className="flex-1 text-sm font-black text-[#002a63] hover:underline uppercase">Close</button>
                        <button onClick={() => setIsFiltersOpen(false)} className="flex-1 bg-fb-green text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl">Apply</button>
                    </div>
                </aside>
                {isFiltersOpen && <div className="fixed inset-0 bg-[#002a63]/20 backdrop-blur-[2px] z-[90]" onClick={() => setIsFiltersOpen(false)} />}
            </div>
        </div>
    );
}
