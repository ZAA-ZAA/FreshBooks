// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, SlidersHorizontal, ChevronDown, X, 
    CheckCircle2, Pencil, Trash2, Copy, MoreHorizontal,
    Receipt, Landmark, Settings, Link2, Filter, ReceiptText
} from 'lucide-react';

export default function ExpensesList() {
    const navigate = useNavigate();
    const [showPromo, setShowPromo] = useState(true);
    const [showBankBanner, setShowBankBanner] = useState(true);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [moreActionsOpen, setMoreActionsOpen] = useState(false);
    const moreActionsRef = useRef(null);

    useEffect(() => {
        const stored = localStorage.getItem('fb_expenses');
        if (stored) setExpenses(JSON.parse(stored));

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
        exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm('Delete this expense?')) {
            const updated = expenses.filter(e => e.id !== id);
            setExpenses(updated);
            localStorage.setItem('fb_expenses', JSON.stringify(updated));
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-fb-navy tracking-tighter">Expenses</h1>
                    <p className="text-gray-400 font-bold mt-2">Track business spending and automate tax deductions</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative" ref={moreActionsRef}>
                        <button 
                            onClick={() => setMoreActionsOpen(!moreActionsOpen)}
                            className={`flex items-center gap-3 font-black text-fb-navy hover:text-fb-blue transition-all px-4 py-3 rounded-xl border-2 border-transparent hover:border-fb-blue/5 ${moreActionsOpen ? 'bg-fb-gray' : ''}`}
                        >
                            More Actions <ChevronDown size={22} className={`transition-transform duration-300 ${moreActionsOpen ? 'rotate-180 text-fb-blue' : ''}`} />
                        </button>
                        {moreActionsOpen && (
                            <div className="absolute right-0 top-[calc(100%+12px)] w-64 bg-white border border-gray-100 rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] z-[60] py-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="px-6 py-4 hover:bg-fb-gray flex items-center space-x-4 cursor-pointer group">
                                    <Landmark size={20} className="text-gray-400 group-hover:text-fb-blue transition-colors" />
                                    <span className="text-base font-black text-fb-navy">Import from Bank</span>
                                </div>
                                <div className="px-6 py-4 hover:bg-fb-gray flex items-center space-x-4 cursor-pointer group">
                                    <Settings size={20} className="text-gray-400 group-hover:text-fb-blue transition-colors" />
                                    <span className="text-base font-black text-fb-navy">Manage Categories</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => navigate('/expenses/new')}
                        className="bg-fb-green hover:brightness-110 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-fb-green/20 transition-all active:scale-95"
                    >
                        New Expense
                    </button>
                </div>
            </div>

            {/* Recently Updated Shelf */}
            <div className="relative">
                <div className="flex justify-between items-center mb-8 px-2">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-4 flex-1">
                        Recent Activity <div className="flex-1 h-[1px] bg-gray-100"></div>
                    </h3>
                    <button className="text-gray-300 font-black text-[10px] uppercase tracking-widest flex items-center hover:text-fb-navy transition-colors ml-6">
                        Dismiss All <X size={14} className="ml-1" />
                    </button>
                </div>
                <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide relative px-2">
                    <div 
                        onClick={() => navigate('/expenses/new')}
                        className="flex-none w-56 h-64 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-fb-blue transition-all group"
                    >
                        <div className="w-14 h-14 bg-fb-green/10 rounded-2xl flex items-center justify-center text-fb-green mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={32} strokeWidth={3} />
                        </div>
                        <span className="font-black text-fb-navy text-xs uppercase tracking-widest text-center">New<br/>Expense</span>
                    </div>
                    {expenses.slice(0, 10).map(exp => (
                        <div 
                            key={exp.id}
                            onClick={() => navigate(`/expenses/${exp.id}`)}
                            className="flex-none w-56 h-64 bg-white border border-gray-200 rounded-[32px] shadow-sm hover:shadow-2xl cursor-pointer transition-all overflow-hidden flex flex-col group relative"
                        >
                            <div className="h-3 w-full bg-fb-green opacity-40"></div>
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-fb-green group-hover:text-white transition-all">
                                            <Receipt size={16} />
                                        </div>
                                        <span className="text-[9px] font-black text-gray-400 truncate uppercase tracking-widest">{exp.category}</span>
                                    </div>
                                    <div className="font-black text-fb-navy truncate text-lg mb-1 leading-tight group-hover:text-fb-blue transition-colors">{exp.merchant}</div>
                                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{exp.date}</div>
                                </div>
                                
                                <div className="text-right">
                                     <div className="text-2xl font-black text-fb-navy tracking-tight">₱{exp.amount.toLocaleString()}</div>
                                     <div className="text-[9px] font-black text-fb-green uppercase tracking-[0.2em] mt-1">Logged</div>
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] group-hover:opacity-10 transition-opacity">
                                <ReceiptText size={160} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* All Expenses List */}
            <div className="pt-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 h-16 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-fb-navy tracking-tight">Expense Ledger</h2>
                        <div className="bg-fb-green/10 text-fb-green px-3 py-1 rounded-lg text-xs font-black">₱{expenses.reduce((a,b)=>a+b.amount,0).toLocaleString()} Total</div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue transition-colors" size={20} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none w-full md:w-80 text-sm font-bold text-fb-navy shadow-sm transition-all" 
                                placeholder="Search merchants or categories..." 
                            />
                        </div>
                        <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} /> Filters
                        </button>
                    </div>
                </div>

                {showBankBanner && (
                    <div className="bg-[#f0f9ff] border-2 border-[#bae6fd] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-center mb-10 text-sm text-[#0369a1] relative shadow-inner animate-in fade-in duration-500">
                         <button onClick={() => setShowBankBanner(false)} className="absolute right-4 top-4 md:top-1/2 md:-translate-y-1/2 text-[#0369a1] hover:text-[#0c4a6e] transition-colors"><X size={20} /></button>
                         <Landmark className="mr-4 text-fb-blue hidden md:block" size={24} />
                         <div className="text-center md:text-left">
                            <span className="font-black text-fb-navy mr-1 uppercase text-[10px] tracking-widest block md:inline mb-1 md:mb-0">Pro Tip</span>
                            <a href="#" className="underline font-black text-fb-blue hover:text-fb-darkBlue transition-colors">Connect your Bank</a> 
                            <span className="ml-1 font-bold opacity-80">to automatically categorize business spending and maximize tax savings.</span>
                         </div>
                    </div>
                )}

                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-fb-green">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <tr>
                                <th className="p-6 w-16"><input type="checkbox" className="rounded-lg border-gray-300 text-fb-blue w-5 h-5" /></th>
                                <th className="p-6">Merchant / Category</th>
                                <th className="p-6">Timeline</th>
                                <th className="p-6">Client / Project / Notes</th>
                                <th className="p-6 text-right">Amount / Status</th>
                                <th className="p-6 w-32"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredExpenses.map(exp => (
                                <tr key={exp.id} className="transition-all duration-300 group cursor-pointer hover:bg-fb-gray" onClick={() => navigate(`/expenses/${exp.id}`)}>
                                    <td className="p-6" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded-lg border-gray-300 text-fb-blue w-5 h-5" /></td>
                                    <td className="p-6 border-l-8 border-fb-green/30 group-hover:border-fb-green transition-all">
                                        <div className="font-black text-fb-navy group-hover:text-fb-blue text-base leading-tight mb-1">{exp.merchant}</div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <Receipt size={12} className="text-fb-green opacity-50" /> {exp.category}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-black text-fb-navy text-xs mb-1">{exp.date}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source: Manual</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-black text-fb-navy text-xs mb-1 truncate max-w-[150px]">{exp.client || 'INTERNAL BUSINESS'}</div>
                                        <div className="text-[10px] font-bold text-gray-400 italic line-clamp-1">"{exp.description || 'No notes'}"</div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="font-black text-fb-navy text-lg leading-none mb-1">₱{exp.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                        <span className="text-[10px] font-black text-fb-green bg-fb-green/10 px-3 py-1 rounded-full uppercase tracking-widest border border-fb-green/20">
                                            {exp.status || 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-x-2">
                                            <button onClick={() => navigate(`/expenses/${exp.id}`)} className="w-10 h-10 bg-fb-blue/5 text-fb-blue rounded-xl flex items-center justify-center hover:bg-fb-blue hover:text-white transition-all shadow-sm">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(exp.id)} className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-fb-navy hover:text-white transition-all shadow-sm">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredExpenses.length === 0 && (
                        <div className="p-32 text-center bg-gray-50/30">
                            <div className="flex flex-col items-center">
                                <ReceiptText size={64} className="text-gray-100 mb-6" />
                                <p className="text-gray-400 font-black text-2xl italic tracking-tight">No expenses logged yet</p>
                                <button onClick={() => navigate('/expenses/new')} className="bg-fb-blue text-white px-8 py-3 rounded-xl font-black mt-6 shadow-xl active:scale-95 transition-all">Log Your First Expense</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}