// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, ChevronDown, X, Play, Landmark, Settings, 
    Filter, MoreHorizontal, Pencil, Trash2, Copy, Paperclip,
    Home, Receipt, Info, CheckCircle2
} from 'lucide-react';

export default function ExpensesList() {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [showBankBanner, setShowBankBanner] = useState(true);
    const [showShelf, setShowShelf] = useState(true);
    const [moreActionsOpen, setMoreActionsOpen] = useState(false);
    const moreActionsRef = useRef(null);

    useEffect(() => {
        const stored = localStorage.getItem('fb_expenses');
        if (stored) {
            setExpenses(JSON.parse(stored));
        } else {
            const initial = [
                { id: 'exp1', date: '2026-01-29', merchant: 'Abc', category: 'Rent or Lease', amount: 1321.00, status: 'Draft', description: 'test', client: 'John Doe' }
            ];
            setExpenses(initial);
            localStorage.setItem('fb_expenses', JSON.stringify(initial));
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
                setMoreActionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredExpenses = expenses.filter(exp => 
        exp.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalAmount = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 font-sans">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Expenses</h1>
                <div className="flex items-center gap-4">
                    <div className="relative" ref={moreActionsRef}>
                        <button 
                            onClick={() => setMoreActionsOpen(!moreActionsOpen)}
                            className="flex items-center gap-2 text-[15px] font-bold text-[#556d82] hover:text-[#0075dd] transition-colors"
                        >
                            More Actions <ChevronDown size={20} className={`transition-transform ${moreActionsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {moreActionsOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded shadow-xl z-[100] py-1">
                                <div className="px-4 py-2 hover:bg-gray-50 text-sm font-bold text-[#002a63] cursor-pointer">Import Expenses</div>
                                <div className="px-4 py-2 hover:bg-gray-50 text-sm font-bold text-[#002a63] cursor-pointer">Manage Categories</div>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => navigate('/expenses/new')}
                        className="bg-[#00a651] hover:bg-[#008541] text-white px-8 py-2.5 rounded font-black text-lg shadow-md transition-all active:scale-95"
                    >
                        New Expense
                    </button>
                </div>
            </div>

            {/* Onboarding Banner */}
            {showOnboarding && (
                <div className="bg-white border border-gray-200 rounded-lg p-10 relative shadow-sm animate-in zoom-in-95 duration-500 overflow-hidden">
                    <button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-[#0075dd] text-center mb-12 tracking-tight">Save Time with Expenses that Organize Themselves</h2>
                    <div className="grid grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-6 border border-[#e0f2fe] relative">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Receipt size={24} />
                                </div>
                                <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full border border-gray-100 flex items-center justify-center text-[#0075dd] shadow-sm">
                                    <Play size={10} className="fill-current ml-0.5" />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Track Your Spending</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Learn how to keep your expenses organized for tax time. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn more</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-gray-100 px-10">
                            <div className="w-20 h-20 bg-[#f1fcf1] rounded-full flex items-center justify-center mb-6 border border-[#e0f5e0]">
                                <div className="w-12 h-12 bg-[#5cb85c] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Landmark size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Connect Your Bank</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Automatically import your expenses from your bank or credit card. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Connect now</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-6 border border-[#e0f2fe] relative">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Settings size={24} />
                                </div>
                                <div className="absolute top-0 right-0 w-6 h-6 bg-pink-400 rounded-full border border-white flex items-center justify-center text-white font-bold text-[10px] shadow-sm">+</div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Manage Expense Categories</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Customize categories in the Chart of Accounts with Advanced Accounting. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn more</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recently Updated Shelf */}
            {showShelf && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-[#2d3a4b]">Recently Updated</h3>
                        <button onClick={() => setShowShelf(false)} className="flex items-center gap-1.5 text-xs font-bold text-[#556d82] hover:text-[#0075dd]">
                            Remove <X size={14} className="mt-0.5" />
                        </button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {/* New Expense Card */}
                        <div 
                            onClick={() => navigate('/expenses/new')}
                            className="flex-none w-52 h-64 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#0075dd] transition-all group"
                        >
                            <Plus size={32} className="text-[#00a651] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-[#002a63] text-sm">New Expense</span>
                        </div>
                        {/* Expense Cards */}
                        {expenses.map(exp => (
                            <div 
                                key={exp.id}
                                onClick={() => navigate(`/expenses/${exp.id}`)}
                                className="flex-none w-52 h-64 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col overflow-hidden border-t-4 border-t-[#00a651] group"
                            >
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <Home size={14} className="text-[#00a651]" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{exp.category}</span>
                                    </div>
                                    <div className="font-bold text-[#2d3a4b] text-[15px] mb-1">{exp.merchant}</div>
                                    <div className="text-[10px] text-gray-400 mb-auto">{exp.date}</div>
                                    <div className="w-full h-[1px] bg-gray-100 my-4 border-dashed"></div>
                                    <div className="flex justify-between items-end">
                                         <div className="text-xl font-bold text-[#2d3a4b]">₱{exp.amount.toLocaleString()}</div>
                                    </div>
                                </div>
                                {/* Receipt simulation at bottom */}
                                <div className="h-6 w-full relative">
                                    <div className="absolute inset-x-0 bottom-0 h-4 bg-white" style={{ clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Expenses List */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-[#2d3a4b]">All Expenses</h3>
                    <button onClick={() => navigate('/expenses/new')} className="text-[#00a651] hover:scale-110 transition-transform">
                        <div className="bg-[#00a651] text-white p-0.5 rounded shadow-sm">
                            <Plus size={16} strokeWidth={4} />
                        </div>
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-end items-center bg-gray-50/20">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
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

                    {/* Table Integrated Banner */}
                    {showBankBanner && (
                        <div className="bg-[#f0f9ff] px-10 py-3 border-b border-blue-100 flex items-center justify-center relative animate-in slide-in-from-top-1 duration-200">
                             <div className="text-[13px] text-[#0075dd] font-medium">
                                <span className="underline cursor-pointer hover:text-[#005aab]">Connect your Bank</span> to import expenses and get a head start on tax time.
                             </div>
                             <button onClick={() => setShowBankBanner(false)} className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={14} />
                             </button>
                        </div>
                    )}

                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <tr>
                                <th className="p-4 w-10">
                                    <input type="checkbox" className="rounded border-gray-300 text-[#0075dd] focus:ring-[#0075dd] w-4 h-4 cursor-pointer" />
                                </th>
                                <th className="p-4">Merchant / Category</th>
                                <th className="p-4">Date <ChevronDown size={10} className="inline ml-1" /> / Source</th>
                                <th className="p-4">Client / Project / Description</th>
                                <th className="p-4 text-right">Amount / Tax / Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             {/* Inline "New Expense" row simulation from screenshot */}
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate('/expenses/new')}>
                                <td colSpan={6} className="p-4 text-center">
                                     <div className="flex items-center justify-center gap-2 text-[#556d82] font-bold">
                                         <Plus size={16} className="text-[#00a651]" />
                                         <span className="text-sm">New Expense</span>
                                     </div>
                                </td>
                            </tr>

                            {filteredExpenses.map(exp => (
                                <tr key={exp.id} className="hover:bg-[#f0f9ff]/50 cursor-pointer group transition-colors">
                                    <td className="p-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#0075dd] focus:ring-[#0075dd] w-4 h-4 cursor-pointer" />
                                    </td>
                                    <td className="p-4 border-l-4 border-l-[#5cb85c]">
                                        <div className="font-bold text-[#002a63] text-[13px]">{exp.merchant}</div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Home size={12} className="text-[#00a651]" />
                                            <span className="text-[11px] text-gray-400 font-bold uppercase">{exp.category}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-[13px] font-medium text-gray-600">{exp.date}</div>
                                        <div className="text-[11px] text-gray-400 font-bold uppercase">Manual</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-[13px] font-bold text-[#0075dd]">{exp.client}</div>
                                        <div className="text-[11px] text-gray-400 italic">"{exp.description || 'No description'}"</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-bold text-[#2d3a4b] text-[13px]">₱{exp.amount.toLocaleString(undefined, {minimumFractionDigits: 2})} PHP</div>
                                        <div className="bg-gray-100 text-gray-500 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-gray-200 inline-block mt-1">
                                            {exp.status}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-lg border border-gray-100 shadow-sm translate-x-[-100%]">
                                            <button onClick={() => navigate(`/expenses/${exp.id}/edit`)} className="p-1.5 text-gray-400 hover:text-[#0075dd] transition-colors"><Pencil size={14} /></button>
                                            <button className="p-1.5 text-gray-400 hover:text-[#0075dd] transition-colors"><Paperclip size={14} /></button>
                                            <button className="p-1.5 text-gray-400 hover:text-[#0075dd] transition-colors"><Copy size={14} /></button>
                                            <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50/30">
                            <tr>
                                <td colSpan={6} className="p-4 text-right">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Grand Total:</span>
                                    <span className="text-sm font-black text-[#2d3a4b]">₱{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} PHP</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/20 text-xs font-bold text-gray-400">
                        <div>1-{filteredExpenses.length} of {filteredExpenses.length}</div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <button className="text-[#0075dd] hover:underline px-4 py-1.5 border border-[#0075dd]/20 rounded bg-white">View Archived Expenses</button>
                                <span className="text-gray-300">or</span>
                                <span className="text-[#0075dd] hover:underline cursor-pointer">deleted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Items per page:</span>
                                <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer text-gray-600">
                                    30 <ChevronDown size={14} className="opacity-40" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
