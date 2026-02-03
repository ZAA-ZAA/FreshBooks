// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronDown, X, Calculator, BookOpen, ScrollText, BarChart3, 
    Landmark, TrendingUp, RotateCcw, Plus, Info, PieChart,
    FlaskConical, CheckCircle2, ChevronRight, BarChart
} from 'lucide-react';

export default function Accounting() {
    const navigate = useNavigate();
    const [showOnboarding, setShowOnboarding] = useState(true);

    const ReportCard = ({ title, desc, icon: Icon, updated = false }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col min-h-[160px] relative group hover:border-[#0075dd] transition-all cursor-pointer shadow-sm">
             <div className="text-[#0075dd] mb-4">
                 <Icon size={28} />
             </div>
             <div>
                 <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#2d3a4b] text-[15px]">{title}</h3>
                    {updated && <span className="bg-gray-100 text-gray-500 text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-tighter border border-gray-200">UPDATED</span>}
                 </div>
                 <p className="text-xs text-[#556d82] leading-relaxed line-clamp-2">{desc}</p>
             </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20 font-sans">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Accounting</h1>
                <button className="flex items-center gap-2 text-[15px] font-bold text-[#556d82] hover:text-[#0075dd]">
                    Invite <ChevronDown size={18} className="text-gray-300" />
                </button>
            </div>

            {/* Onboarding Banner */}
            {showOnboarding && (
                <div className="bg-white border border-gray-200 rounded-lg p-10 relative shadow-sm animate-in zoom-in-95 duration-500 overflow-hidden">
                    <button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-[#0075dd] text-center mb-12 tracking-tight">Here’s how to get started with accounting</h2>
                    <div className="grid grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f1fcf1] rounded-full flex items-center justify-center mb-6 border border-[#e0f5e0]">
                                <div className="w-12 h-12 bg-[#5cb85c] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <BarChart size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Get ready for bookkeeping</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Connect your bank or upload a CSV file to create related accounts in your books. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn More</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-gray-100 px-10">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-6 border border-[#e0f2fe] relative">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <FlaskConical size={24} />
                                </div>
                                <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full border border-gray-100 flex items-center justify-center text-[#0075dd] shadow-sm">
                                    <span className="text-[10px] font-black">$</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Journal Entries and Chart of Accounts</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Create Journal Entries and edit accounts in the Chart of Accounts with <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Advanced Accounting</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-6 border border-[#e0f2fe] relative">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Landmark size={24} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-400 rounded-full border border-white flex items-center justify-center text-white shadow-sm">
                                     <CheckCircle2 size={10} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Reconcile your accounts</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Match transactions to keep your books organized and accurate. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn about Bank Reconciliation</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* Bank Reconciliation Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-[#2d3a4b]">Bank Reconciliation</h3>
                    <div className="flex">
                        <button className="bg-[#00a651] hover:bg-[#008541] text-white px-6 py-2.5 rounded-l font-black text-lg shadow-md transition-all active:scale-95">
                            Add Bank Account
                        </button>
                        <button className="bg-[#00a651] hover:bg-[#008541] text-white px-3 py-2.5 rounded-r border-l border-white/20 shadow-md">
                            <ChevronDown size={24} />
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-16 flex flex-col md:flex-row items-center gap-20 shadow-sm min-h-[440px]">
                    <div className="flex-1 relative">
                        {/* Graphic Placeholder resembling the screenshot */}
                        <div className="bg-[#f0f9ff] rounded-lg p-6 w-full max-w-[400px] border border-blue-100 shadow-xl transform -rotate-1">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-[#002a63] text-sm">Bank Reconciliation</span>
                                <div className="h-4 w-12 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                    <div className="space-y-1">
                                        <div className="h-2 w-16 bg-gray-300 rounded"></div>
                                        <div className="h-2 w-24 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="h-2 w-12 bg-blue-100 rounded"></div>
                                </div>
                                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                    <div className="space-y-1">
                                        <div className="h-2 w-16 bg-gray-300 rounded"></div>
                                        <div className="h-2 w-24 bg-[#0075dd] rounded"></div>
                                    </div>
                                    <div className="text-[10px] font-bold text-[#0075dd]">8 left to match</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <div className="h-2 w-16 bg-gray-300 rounded"></div>
                                        <div className="h-2 w-24 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="text-[10px] font-bold text-[#0075dd] underline">Set opening balance</div>
                                </div>
                            </div>
                        </div>
                        {/* Sidebar strip in graphic */}
                        <div className="absolute left-[-40px] top-[20px] w-12 h-[300px] bg-[#0075dd] rounded-lg shadow-lg flex flex-col items-center py-4 gap-4">
                             {[1,2,3,4,5,6,7].map(i => <div key={i} className="w-6 h-1 bg-white/30 rounded-full"></div>)}
                             <div className="mt-auto w-4 h-4 bg-white rounded flex items-center justify-center text-[10px] font-black text-[#0075dd]">f</div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6">
                        <h4 className="text-4xl font-black text-[#0075dd] leading-tight">A little bookkeeping goes a long way</h4>
                        <p className="text-[#556d82] text-lg leading-relaxed font-medium">
                            Don’t wait until crunch time to get your books organized. Use Bank Reconciliation on a regular basis to keep your books organized throughout the year. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn More</span>
                        </p>
                        <p className="text-xl text-[#556d82] font-medium">
                            Select <span className="font-bold text-[#2d3a4b]">Add Bank Account</span> to get started.
                        </p>
                    </div>
                </div>
            </div>

            {/* Accounting Reports Grid Section */}
            <div className="space-y-6 pt-10">
                <div className="flex items-center gap-4 relative">
                    <h3 className="text-2xl font-bold text-[#2d3a4b]">Accounting Reports</h3>
                    <div className="absolute left-48 -top-12 pointer-events-none hidden lg:block">
                        <div className="text-[#0075dd] font-handwriting text-2xl leading-none transform -rotate-3">Get a snapshot of your financial position</div>
                        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="text-[#0075dd] transform rotate-12 -translate-x-12 mt-2">
                             <path d="M5 35C5 35 15 5 55 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                             <path d="M15 30L5 35L10 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReportCard title="Profit and Loss" desc="A summary of your total income, expenses, and net profit. Updated with new style and functionality." icon={BarChart3} updated={true} />
                    <ReportCard title="General Ledger" desc="A complete record of transactions and balances for all your accounts. Updated with new style and functionality." icon={ScrollText} updated={true} />
                    <ReportCard title="Balance Sheet" desc="A complete record of transactions and balances for all your accounts. Updated with new style and functionality." icon={BookOpen} updated={true} />
                    <ReportCard title="Revenue by Client" desc="A breakdown of your revenue by client to help you understand your business better. Updated with new style and functionality." icon={TrendingUp} updated={true} />
                    <ReportCard title="Trial Balance" desc="A quick gut check to make sure your books are balanced" icon={Calculator} />
                    <ReportCard title="Bank Reconciliation Summary" desc="Shows unreconciled bank transactions and BookFlow entries" icon={Landmark} />
                    <ReportCard title="Sales Tax Summary" desc="Helps determine how much you owe the government in Sales Taxes" icon={Calculator} />
                    <ReportCard title="Cash Flow" desc="Overview of Cash coming in and going out of your business" icon={RotateCcw} />
                    <ReportCard title="Journal Entry" desc="Helps you see all the Manual Journal Entries and Adjustments made to your books" icon={ScrollText} />
                </div>
            </div>

            {/* Update Your Books Section */}
            <div className="space-y-8 pt-16">
                 <h3 className="text-2xl font-bold text-[#2d3a4b]">Update Your Books</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white border border-gray-200 rounded-lg p-10 flex flex-col h-full shadow-sm hover:border-[#0075dd] transition-all group">
                         <div className="flex gap-6 mb-8">
                            <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-[#0075dd]">
                                <ScrollText size={32} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#2d3a4b] text-xl mb-3">Journal Entries</h4>
                                <p className="text-[#556d82] text-[15px] leading-relaxed">
                                    Journal Entries allow you to create transactions and assign them to specific accounts. Use these and work with your accountant to keep your books balanced. <span className="text-[#0075dd] cursor-pointer font-bold">Learn More</span>
                                </p>
                            </div>
                         </div>
                         <div className="mt-auto pt-4 flex justify-end">
                            <button className="text-lg font-bold text-[#2d3a4b] hover:text-[#0075dd] flex items-center gap-1 group-hover:gap-2 transition-all">
                                View Your Journal Entries <ChevronRight size={20} className="mt-0.5" />
                            </button>
                         </div>
                     </div>
                     <div className="bg-white border border-gray-200 rounded-lg p-10 flex flex-col h-full shadow-sm hover:border-[#0075dd] transition-all group">
                         <div className="flex gap-6 mb-8">
                            <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-[#0075dd]">
                                <Calculator size={32} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#2d3a4b] text-xl mb-3">Chart of Accounts</h4>
                                <p className="text-[#556d82] text-[15px] leading-relaxed">
                                    See a list of accounts your business has across Assets, Liabilities, Equity, Revenue and Expenses. Collaborate with your accountant to customize the accounts for your business. <span className="text-[#0075dd] cursor-pointer font-bold">Learn More</span>
                                </p>
                            </div>
                         </div>
                         <div className="mt-auto pt-4 flex justify-end">
                            <button className="text-lg font-bold text-[#2d3a4b] hover:text-[#0075dd] flex items-center gap-1 group-hover:gap-2 transition-all">
                                View Your Accounts <ChevronRight size={20} className="mt-0.5" />
                            </button>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
}
