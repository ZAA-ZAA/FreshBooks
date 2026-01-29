// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
    BarChart3, PieChart, FileText, CreditCard, X, Star, 
    ChevronRight, ChevronLeft, ChevronDown, Printer, Download
} from 'lucide-react';

export default function Reports() {
    const [view, setView] = useState('list'); 
    const [selectedReport, setSelectedReport] = useState(null);
    const [stats, setStats] = useState({ totalInvoiced: 0, totalExpenses: 0, netProfit: 0, totalIncome: 0 });
    const [favorites, setFavorites] = useState(['Profit and Loss', 'Invoice Details']);

    useEffect(() => {
        const invoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
        const expenses = JSON.parse(localStorage.getItem('fb_expenses') || '[]');
        const payments = JSON.parse(localStorage.getItem('fb_payments') || '[]');

        const totalInvoiced = invoices.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0);
        const totalExpenses = expenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);
        const totalIncome = payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
        
        setStats({
            totalInvoiced,
            totalExpenses,
            totalIncome,
            netProfit: totalIncome - totalExpenses
        });
    }, [view]);

    const toggleFavorite = (title) => {
        setFavorites(prev => prev.includes(title) ? prev.filter(f => f !== title) : [...prev, title]);
    };

    const handleReportClick = (report) => {
        setSelectedReport(report);
        setView('detail');
        window.scrollTo(0, 0);
    };

    const reportsData = [
        { 
            category: 'Financial Statements',
            items: [
                { title: 'Profit and Loss', desc: 'Comprehensive summary of total income minus your operating expenses.', icon: BarChart3, value: stats.netProfit },
                { title: 'Invoice Details', desc: 'A granular view of all invoices sent, showing status and expected revenue.', icon: FileText, value: stats.totalInvoiced },
                { title: 'Expense Report', desc: 'A categorized analysis of where your business capital is being utilized.', icon: PieChart, value: stats.totalExpenses },
                { title: 'Payments Collected', desc: 'Actual realized cash flow from settled client invoices and income.', icon: CreditCard, value: stats.totalIncome }
            ]
        }
    ];

    if (view === 'detail') {
        return (
            <div className="animate-in fade-in duration-300 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button onClick={() => setView('list')} className="flex items-center text-fb-blue font-bold text-sm hover:underline mb-2 transition-all">
                            <ChevronLeft size={16} className="mr-1" /> Back to Reports
                        </button>
                        <h1 className="text-4xl font-black text-fb-navy">{selectedReport.title}</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white border border-gray-300 px-5 py-2.5 rounded-lg font-bold text-fb-navy flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                            <Printer size={18} /> Print
                        </button>
                        <button className="bg-fb-green hover:brightness-110 text-white px-8 py-2.5 rounded-lg font-black text-lg shadow-md transition-all">
                            Send...
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-12 md:p-20 border border-gray-100 min-h-[700px] w-full max-w-4xl mx-auto relative animate-in slide-in-from-bottom-6 duration-700">
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-fb-blue mb-4">{selectedReport.title}</h2>
                        <div className="space-y-1">
                            <p className="text-sm text-fb-navy font-black uppercase tracking-widest">Demo Business Report</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Currency: PHP</p>
                            <p className="text-xs text-gray-400 font-medium italic">Data verified up to {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="h-1 w-full bg-fb-blue mb-12"></div>

                    {selectedReport.title === 'Profit and Loss' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            <div>
                                <h4 className="text-[11px] font-black text-fb-blue uppercase tracking-[0.3em] mb-6">Revenue Streams</h4>
                                <div className="flex justify-between items-center py-5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors px-2">
                                    <span className="font-bold text-fb-navy text-lg">Payments Collected</span>
                                    <span className="text-2xl font-black text-fb-green">₱{stats.totalIncome.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-[11px] font-black text-red-400 uppercase tracking-[0.3em] mb-6">Operating Costs</h4>
                                <div className="flex justify-between items-center py-5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors px-2">
                                    <span className="font-bold text-fb-navy text-lg">Total Business Expenses</span>
                                    <span className="text-2xl font-black text-red-500">(₱{stats.totalExpenses.toLocaleString()})</span>
                                </div>
                            </div>

                            <div className="pt-12">
                                <div className="flex justify-between items-center py-10 px-8 bg-fb-gray rounded-2xl border border-gray-100 shadow-inner">
                                    <span className="text-3xl font-black text-fb-navy uppercase tracking-tighter">Net Profit</span>
                                    <div className="text-right">
                                        <span className={`text-6xl font-black block ${stats.netProfit >= 0 ? 'text-fb-blue' : 'text-red-600'}`}>
                                            ₱{stats.netProfit.toLocaleString()}
                                        </span>
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-2 block">Tax Year 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedReport.title === 'Invoice Details' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex justify-between items-center py-14 px-10 bg-blue-50/30 rounded-2xl border border-blue-100 border-t-[12px] border-t-fb-blue">
                                <span className="text-2xl font-black text-fb-navy">Total Invoiced Volume</span>
                                <span className="text-6xl font-black text-fb-blue">₱{stats.totalInvoiced.toLocaleString()}</span>
                            </div>
                            <div className="mt-12 space-y-4">
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">This report includes all invoices currently in your system regardless of payment status. It represents your total potential revenue for the period.</p>
                            </div>
                        </div>
                    )}

                    {selectedReport.title === 'Expense Report' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex justify-between items-center py-14 px-10 bg-red-50/30 rounded-2xl border border-red-100 border-t-[12px] border-t-red-500">
                                <span className="text-2xl font-black text-fb-navy">Business Spending Log</span>
                                <span className="text-6xl font-black text-red-500">₱{stats.totalExpenses.toLocaleString()}</span>
                            </div>
                            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                                <h5 className="font-bold text-fb-navy text-sm mb-2">Internal Note</h5>
                                <p className="text-xs text-gray-500">Expense tracking helps you identify tax deductions and maintain healthy cash flow margins.</p>
                            </div>
                        </div>
                    )}

                    {selectedReport.title === 'Payments Collected' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex justify-between items-center py-14 px-10 bg-green-50/30 rounded-2xl border border-green-100 border-t-[12px] border-t-fb-green">
                                <span className="text-2xl font-black text-fb-navy">Total Realized Income</span>
                                <span className="text-6xl font-black text-fb-green">₱{stats.totalIncome.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* Footer Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 w-full flex items-end pointer-events-none opacity-5">
                         {Array.from({ length: 40 }).map((_, i) => (
                             <div key={i} className="flex-1 h-3 bg-gray-800" style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }}></div>
                         ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-300 pb-20">
            <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black text-fb-navy tracking-tight">Reports</h1>
                <div className="w-12 h-12 bg-fb-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 animate-in zoom-in duration-500">
                    <BarChart3 size={24} />
                </div>
            </div>

            {reportsData.map((category, idx) => (
                <div key={idx}>
                    <h2 className="text-xl font-black text-fb-navy mb-8 border-b border-gray-100 pb-4 uppercase tracking-[0.2em] text-[12px]">
                        {category.category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {category.items.map((report, rIdx) => (
                            <div 
                                key={rIdx}
                                onClick={() => handleReportClick(report)}
                                className="bg-white border border-gray-200 rounded-2xl p-10 flex items-start gap-8 hover:shadow-2xl hover:border-fb-blue/40 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98]"
                            >
                                <div className="p-6 bg-gray-50 rounded-2xl text-fb-blue group-hover:bg-fb-blue group-hover:text-white transition-all duration-300 shrink-0">
                                    <report.icon size={40} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-black text-fb-navy group-hover:text-fb-blue transition-colors mb-2 tracking-tight">{report.title}</h3>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(report.title); }}
                                            className={`transition-all ${favorites.includes(report.title) ? 'text-fb-yellow scale-110' : 'text-gray-200 hover:text-gray-400'}`}
                                        >
                                            <Star size={20} className={favorites.includes(report.title) ? 'fill-current' : ''} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8 pr-6">{report.desc}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate Balance</span>
                                        <div className={`text-2xl font-black ${report.title === 'Expense Report' ? 'text-red-500' : 'text-fb-navy'}`}>
                                            ₱{report.value.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-8 text-gray-200 group-hover:text-fb-blue group-hover:translate-x-3 transition-all duration-500">
                                    <ChevronRight size={40} strokeWidth={3} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}