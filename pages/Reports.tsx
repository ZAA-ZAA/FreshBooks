// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BarChart3, PieChart, FileText, CreditCard, X, Star, 
    ChevronRight, ChevronLeft, ChevronDown, Printer, Download,
    Clock, Users, Calculator, Briefcase, FileSearch, ScrollText, 
    BookOpen, RotateCcw, Landmark, TrendingUp, Handshake, DollarSign,
    Scale, Receipt, History, ShoppingBag
} from 'lucide-react';

const REPORT_DEFINITIONS = [
    { title: "Invoice Details", desc: "A detailed summary of all invoices you've sent over a period of time", icon: FileText, category: "Invoice and Expense", path: "/reports/invoice-details" },
    { title: "Expense Report", desc: "See how much money you're spending, and where you're spending it", icon: PieChart, category: "Invoice and Expense", path: "/reports/expense-report" },
    { title: "Item Sales", desc: "A breakdown of sales and revenue for each item or service you sell", icon: ShoppingBag, category: "Invoice and Expense", path: "/reports/item-sales" },
    { title: "Profit and Loss", desc: "A summary of your total income, expenses, and net profit.", icon: BarChart3, category: "Accounting", updated: true },
    { title: "Accounts Aging", desc: "Find out which clients are taking a long time to pay", icon: Clock, category: "Payments" },
    { title: "General Ledger", desc: "A complete record of transactions and balances for all your accounts.", icon: ScrollText, category: "Accounting", updated: true },
    { title: "Revenue by Client", desc: "A breakdown of how much revenue each of your clients is bringing in.", icon: TrendingUp, category: "Accounting", updated: true },
];

export default function Reports() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState(['Invoice Details', 'Expense Report', 'Item Sales']);
    const [stats, setStats] = useState({ revenue: 0, expense: 0, net: 0 });
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const invoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
        const expenses = JSON.parse(localStorage.getItem('fb_expenses') || '[]');
        const storedFavs = JSON.parse(localStorage.getItem('fb_report_favorites'));
        if (storedFavs) setFavorites(storedFavs);
        
        const rev = invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);
        const exp = expenses.reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);
        
        setStats({ revenue: rev, expense: exp, net: rev - exp });
    }, []);

    const toggleFavorite = (title: string) => {
        setFavorites(prev => {
            const next = prev.includes(title) ? prev.filter(f => f !== title) : [...prev, title];
            localStorage.setItem('fb_report_favorites', JSON.stringify(next));
            return next;
        });
    };

    const ReportCard = ({ report }) => {
        const { title, desc, icon: Icon, updated = false, path } = report;
        let liveValue = null;
        if (title === "Expense Report") liveValue = `Total Spent: ₱${stats.expense.toLocaleString()}`;
        if (title === "Invoice Details") liveValue = `Total Invoiced: ₱${stats.revenue.toLocaleString()}`;
        if (title === "Profit and Loss") liveValue = `Net Profit: ₱${stats.net.toLocaleString()}`;

        return (
            <div 
                onClick={() => path && navigate(path)}
                className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col min-h-[180px] relative group hover:border-[#0075dd] hover:shadow-xl transition-all cursor-pointer shadow-sm"
            >
                 <div className="flex justify-between items-start mb-6">
                     <div className="text-[#0075dd] bg-blue-50 p-3 rounded-xl group-hover:bg-[#0075dd] group-hover:text-white transition-all">
                         <Icon size={28} />
                     </div>
                     <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(title); }}
                        className={`transition-all p-1 hover:scale-110 ${favorites.includes(title) ? 'text-[#f9c80e]' : 'text-gray-300 hover:text-gray-400'}`}
                    >
                        <Star size={20} className={favorites.includes(title) ? 'fill-current' : ''} />
                    </button>
                 </div>
                 <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-black text-[#002a63] text-lg group-hover:text-fb-blue transition-colors">{title}</h3>
                        {updated && (
                            <span className="bg-fb-green/10 text-fb-green text-[8px] font-black uppercase px-2 py-1 rounded-full border border-fb-green/20 tracking-widest">
                                UPDATED
                            </span>
                        )}
                     </div>
                     <p className="text-xs text-[#556d82] font-medium leading-relaxed line-clamp-2 mb-4">{desc}</p>
                     {liveValue && (
                         <div className="mt-auto pt-4 border-t border-gray-50 text-[10px] font-black text-[#0075dd] uppercase tracking-[0.2em]">
                             {liveValue}
                         </div>
                     )}
                 </div>
            </div>
        );
    };

    const favoriteReports = REPORT_DEFINITIONS.filter(r => favorites.includes(r.title));

    return (
        <div className="space-y-16 animate-in fade-in duration-500 pb-24 font-sans">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-[#002a63] tracking-tighter">Reports</h1>
                    <p className="text-gray-400 font-bold mt-2">Insights and analytics to power your business growth</p>
                </div>
            </div>

            <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Pinned Reports</h2>
                    <div className="h-[1px] bg-gray-100 w-full"></div>
                </div>
                
                {favoriteReports.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favoriteReports.map(report => (
                            <ReportCard key={report.title} report={report} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[32px] p-16 text-center">
                        <Star className="mx-auto text-gray-200 mb-4 animate-pulse" size={48} />
                        <p className="text-lg font-black text-gray-300 italic">Favorite your most-used reports for quick access</p>
                    </div>
                )}
            </div>

            <div className="space-y-10">
                <div className="flex gap-10 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                    {['All', 'Invoice and Expense', 'Payments', 'Accounting'].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`pb-5 text-sm font-black transition-all border-b-4 uppercase tracking-[0.2em] whitespace-nowrap ${activeCategory === cat ? 'border-[#0075dd] text-[#0075dd]' : 'border-transparent text-gray-400 hover:text-fb-navy'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {REPORT_DEFINITIONS
                        .filter(r => activeCategory === 'All' || r.category === activeCategory)
                        .map(report => (
                            <ReportCard key={report.title} report={report} />
                    ))}
                </div>
            </div>

            <div className="bg-fb-navy rounded-[40px] p-16 text-white relative overflow-hidden shadow-2xl">
                 <div className="relative z-10 max-w-xl">
                    <h2 className="text-4xl font-black mb-6 leading-tight tracking-tighter">Need custom analytics?</h2>
                    <p className="text-lg text-blue-100 mb-10 leading-relaxed font-medium">Export your raw data and create custom visualizations or share directly with your accountant.</p>
                    <div className="flex gap-6">
                        <button className="bg-[#0075dd] hover:bg-fb-blue text-white px-10 py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-fb-blue/20">Explore Export Options</button>
                        <button className="border-2 border-white/20 hover:bg-white/5 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all">Report Guide</button>
                    </div>
                 </div>
                 <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-10 pointer-events-none transform translate-x-20 rotate-12">
                     <TrendingUp size={400} />
                 </div>
            </div>
        </div>
    );
}
