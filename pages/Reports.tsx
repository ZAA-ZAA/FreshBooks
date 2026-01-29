// @ts-nocheck
import React, { useState } from 'react';
import { 
    BarChart3, PieChart, FileText, CreditCard, X, Star, 
    ChevronRight, ChevronLeft, ChevronDown, Printer, Download,
    Clock, Users, Calculator, Briefcase, FileSearch, ScrollText, 
    BookOpen, RotateCcw, Landmark, TrendingUp, Handshake, DollarSign,
    Scale, Receipt, History
} from 'lucide-react';

export default function Reports() {
    const [favorites, setFavorites] = useState(['Profit and Loss']);

    const toggleFavorite = (title: string) => {
        setFavorites(prev => prev.includes(title) ? prev.filter(f => f !== title) : [...prev, title]);
    };

    const ReportCard = ({ title, desc, icon: Icon, updated = false }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col min-h-[140px] relative group hover:border-[#0075dd] transition-all cursor-pointer shadow-sm">
             <div className="flex justify-between items-start mb-4">
                 <div className="text-[#0075dd]">
                     <Icon size={24} />
                 </div>
                 <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(title); }}
                    className={`transition-all ${favorites.includes(title) ? 'text-[#f9c80e]' : 'text-gray-300 hover:text-gray-400'}`}
                >
                    <Star size={18} className={favorites.includes(title) ? 'fill-current' : ''} />
                </button>
             </div>
             <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#2d3a4b] text-[14px]">{title}</h3>
                    {updated && (
                        <span className="bg-gray-100 text-gray-500 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-gray-200 tracking-tighter">
                            UPDATED
                        </span>
                    )}
                 </div>
                 <p className="text-[11px] text-[#556d82] leading-relaxed line-clamp-2">{desc}</p>
             </div>
        </div>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <h2 className="text-[12px] font-bold text-[#2d3a4b] uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">{title}</h2>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20 font-sans">
            {/* Header */}
            <div className="flex justify-between items-end mb-4">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Reports</h1>
            </div>

            {/* Favorite Reports Shelf */}
            <div className="relative">
                <SectionHeader title="Favorite Reports" />
                
                {/* Handwriting Annotation */}
                <div className="absolute left-[30%] top-16 pointer-events-none z-10 hidden lg:block">
                    <div className="relative">
                        <div className="text-[#0075dd] font-handwriting text-2xl leading-none transform -rotate-2">Easy access to your favorite reports</div>
                        <svg width="100" height="40" viewBox="0 0 100 40" fill="none" className="text-[#0075dd] absolute -left-12 -bottom-2 transform -scale-x-100 rotate-12">
                             <path d="M5 5C5 5 25 35 95 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                             <path d="M15 30L5 35L15 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="border border-gray-200 bg-white rounded-lg h-56 flex flex-col items-center justify-center p-6 shadow-sm relative group">
                             <div className="w-20 h-20 rounded-full border border-gray-100 bg-gray-50/50 mb-6"></div>
                             <div className="w-full space-y-2">
                                <div className="h-2.5 bg-gray-100 rounded-full w-3/4 mx-auto"></div>
                                <div className="h-2 bg-gray-50 rounded-full w-1/2 mx-auto"></div>
                             </div>
                             <div className="absolute top-2 right-2 p-1 text-gray-100">
                                <Star size={16} />
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invoice and Expense Reports */}
            <div className="relative">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
                    <h2 className="text-[12px] font-bold text-[#2d3a4b] uppercase tracking-widest">Invoice and Expense Reports</h2>
                    <div className="relative group">
                         <p className="text-[11px] text-[#0075dd] italic font-bold cursor-pointer">Star your favorite reports →</p>
                         {/* Handwriting Annotation for starring */}
                         <div className="absolute -top-14 -right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            <div className="text-[#0075dd] font-handwriting text-xl">Star your favorite reports</div>
                            <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="text-[#0075dd] transform translate-x-32 -translate-y-4">
                                <path d="M35 5C35 5 30 25 5 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M10 20L5 25L10 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                         </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReportCard title="Invoice Details" desc="A detailed summary of all invoices you've sent over a period of time" icon={FileText} />
                    <ReportCard title="Expense Report" desc="See how much money you're spending, and where you're spending it" icon={PieChart} />
                    <ReportCard title="Item Sales" desc="See how much money you're making from each item you sell" icon={CreditCard} />
                    <ReportCard title="Revenue by Client" desc="A breakdown of how much revenue each of your clients is bringing in. Updated with new style and functionality." icon={TrendingUp} updated={true} />
                </div>
            </div>

            {/* Payments Reports */}
            <div>
                <SectionHeader title="Payments Reports" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReportCard title="Accounts Aging" desc="Find out which clients are taking a long time to pay" icon={Clock} />
                    <ReportCard title="Payments Collected" desc="A summary of all the payments you have collected over a period of time" icon={Handshake} />
                    <ReportCard title="Accounts Payable Aging" desc="Find out how much each vendor needs to be paid" icon={Landmark} />
                    <ReportCard title="Credit Balance" desc="Summary of all your credit balance for your clients over a period of time" icon={DollarSign} />
                </div>
            </div>

            {/* Accounting Reports */}
            <div>
                <SectionHeader title="Accounting Reports" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReportCard title="Balance Sheet" desc="A snapshot of your assets, liabilities, and equity at any given point in time. Updated with new style and functionality." icon={BookOpen} updated={true} />
                    <ReportCard title="Profit and Loss" desc="A summary of your total income, expenses, and net profit. Updated with new style and functionality." icon={BarChart3} updated={true} />
                    <ReportCard title="General Ledger" desc="A complete record of transactions and balances for all your accounts. Updated with new style and functionality." icon={ScrollText} updated={true} />
                    <ReportCard title="Trial Balance" desc="A quick gut check to make sure your books are balanced" icon={Scale} />
                    <ReportCard title="Bank Reconciliation Summary" desc="Shows unreconciled bank transactions and FreshBooks entries" icon={Landmark} />
                    <ReportCard title="Sales Tax Summary" desc="Helps determine how much you owe the government in Sales Taxes" icon={Calculator} />
                    <ReportCard title="Cash Flow" desc="Overview of Cash coming in and going out of your business" icon={RotateCcw} />
                    <ReportCard title="Journal Entry" desc="Helps you see all the Manual Journal Entries and Adjustments made to your books" icon={ScrollText} />
                </div>
            </div>

            {/* Time Tracking and Project Reports */}
            <div>
                <SectionHeader title="Time Tracking and Project Reports" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReportCard title="Time Entry Details" desc="A detailed summary of how much time you and / or your team tracked over a period of time" icon={Clock} />
                    <ReportCard title="Retainer Summary" desc="A detailed work summary for your retainer clients" icon={RotateCcw} />
                    <ReportCard title="Profitability Summary" desc="View a summary of a client's profitability across all their projects" icon={BarChart3} />
                    <ReportCard title="Profitability Details" desc="Get a detailed breakdown of project profitability by service and expense categories" icon={DollarSign} />
                    <ReportCard title="Team Utilization" desc="Overview of billable hours from team members against their expected capacity" icon={Users} />
                </div>
            </div>

            {/* Logs */}
            <div>
                <SectionHeader title="Logs" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReportCard title="Audit Log" desc="View changes made to your books" icon={History} />
                </div>
            </div>
        </div>
    );
}
