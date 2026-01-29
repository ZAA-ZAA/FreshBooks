// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, TrendingDown, BookOpen, Landmark, ArrowUpRight, ArrowDownLeft, ShieldCheck, Info, FileText, ChevronRight, Calculator, Archive, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MetricCard = ({ title, amount, icon: Icon, colorClass, subText }: any) => (
    <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm relative group hover:shadow-2xl transition-all overflow-hidden border-b-[10px]" style={{ borderBottomColor: colorClass }}>
        <div className="flex justify-between items-start mb-12 relative z-10">
            <div className={`p-5 rounded-[24px] group-hover:scale-110 transition-transform shadow-sm`} style={{ backgroundColor: `${colorClass}15` }}>
                <Icon size={36} strokeWidth={2.5} style={{ color: colorClass }} />
            </div>
            <button className="text-gray-200 hover:text-fb-blue transition-colors">
                <Info size={24} />
            </button>
        </div>
        <div className="relative z-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">{title}</p>
            <div className="text-6xl font-black text-fb-navy tracking-tighter leading-none mb-6">₱{amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            <p className="text-sm font-bold text-gray-400 leading-relaxed max-w-[200px]">{subText}</p>
        </div>
    </div>
);

export default function Accounting() {
    const navigate = useNavigate();
    const [cashOnHand, setCashOnHand] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [accountsReceivable, setAccountsReceivable] = useState(0);

    useEffect(() => {
        const payments = JSON.parse(localStorage.getItem('fb_payments') || '[]');
        const cash = payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
        setCashOnHand(cash);

        const expenses = JSON.parse(localStorage.getItem('fb_expenses') || '[]');
        const exp = expenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);
        setTotalExpenses(exp);

        const invoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
        const ar = invoices.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0);
        setAccountsReceivable(ar);
    }, []);

    const equity = cashOnHand - totalExpenses;

    return (
        <div className="space-y-16 animate-in fade-in duration-500 pb-20 select-none">
            {/* Ledger Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                <div>
                    <h1 className="text-6xl font-black text-fb-navy tracking-tighter">Double-Entry Ledger</h1>
                    <p className="text-gray-400 font-bold mt-4 text-xl">GAAP-compliant reporting and auditing interface.</p>
                </div>
                <div className="flex items-center gap-8">
                    <button className="text-fb-navy font-black text-lg hover:underline transition-all flex items-center gap-2">
                        <History size={20} /> History
                    </button>
                    <button className="bg-[#1a202c] hover:bg-black text-white px-12 py-6 rounded-[24px] font-black text-xl shadow-2xl active:scale-95 flex items-center gap-5">
                        <ShieldCheck size={28} className="text-fb-blue" /> Lock Fiscal Period
                    </button>
                </div>
            </div>

            {/* Live Metrics Shelf */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <MetricCard 
                    title="Liquid Assets" 
                    amount={cashOnHand} 
                    icon={TrendingUp} 
                    colorClass="#00a651" 
                    subText="Settled transactions and realized income"
                />
                <MetricCard 
                    title="Liabilities" 
                    amount={totalExpenses} 
                    icon={TrendingDown} 
                    colorClass="#ef4444" 
                    subText="Total operating burn and expenses"
                />
                <MetricCard 
                    title="Realized Equity" 
                    amount={equity} 
                    icon={Landmark} 
                    colorClass="#0075dd" 
                    subText="Net book value of the organization"
                />
            </div>

            {/* Account Mapping Table */}
            <div className="pt-16">
                <div className="flex items-center justify-between mb-16 border-b border-gray-100 pb-12">
                    <h3 className="font-black text-5xl text-fb-navy tracking-tighter flex items-center gap-8">
                        <div className="w-20 h-20 bg-fb-navy rounded-[28px] flex items-center justify-center text-white">
                            <BookOpen size={40} />
                        </div>
                        Chart of Accounts
                    </h3>
                    <button className="bg-white border-2 border-fb-blue text-fb-blue px-10 py-5 rounded-[24px] font-black text-xl hover:bg-blue-50 transition-all flex items-center gap-3">
                        <Calculator size={22} /> Adjustments
                    </button>
                </div>

                <div className="bg-white border border-gray-100 rounded-[56px] shadow-2xl overflow-hidden border-t-[12px] border-t-fb-navy relative">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">
                            <tr>
                                <th className="p-12">Ledger Account ID</th>
                                <th className="p-12">Classification</th>
                                <th className="p-12 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { id: '1000', name: 'Cash Accounts', class: 'Asset', color: 'green', val: cashOnHand },
                                { id: '1100', name: 'Accounts Receivable', class: 'Asset', color: 'green', val: accountsReceivable },
                                { id: '2100', name: 'Accounts Payable', class: 'Liability', color: 'red', val: 0 },
                                { id: '3000', name: 'Retained Earnings', class: 'Equity', color: 'blue', val: equity },
                                { id: '4000', name: 'Operating Revenue', class: 'Revenue', color: 'amber', val: cashOnHand + accountsReceivable },
                                { id: '6000', name: 'Operating Expenditure', class: 'Expense', color: 'red', val: totalExpenses }
                            ].map((acc) => (
                                <tr key={acc.id} className="hover:bg-fb-gray/50 transition-all group/row">
                                    <td className="p-12 border-l-[12px] border-transparent group-hover/row:border-fb-navy">
                                        <div className="font-black text-fb-navy text-2xl leading-tight mb-2 tracking-tight">{acc.id} - {acc.name}</div>
                                    </td>
                                    <td className="p-12">
                                        <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                                            acc.color === 'green' ? 'bg-green-50 text-fb-green border-green-100' : 
                                            acc.color === 'red' ? 'bg-red-50 text-red-500 border-red-100' :
                                            acc.color === 'blue' ? 'bg-blue-50 text-fb-blue border-blue-100' :
                                            'bg-amber-50 text-amber-500 border-amber-100'
                                        }`}>
                                            {acc.class}
                                        </span>
                                    </td>
                                    <td className="p-12 text-right">
                                        <div className={`text-3xl font-black ${acc.class === 'Expense' || acc.class === 'Liability' ? 'text-red-500' : 'text-fb-navy'}`}>
                                            ₱{acc.val.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </div>
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-2">Verified Equilibrium</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-20 bg-[#002a63] rounded-[56px] p-20 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 max-w-2xl">
                         <h4 className="text-5xl font-black mb-8 tracking-tighter leading-tight">Auditor Access Gateway</h4>
                         <p className="text-2xl text-blue-100 font-medium leading-relaxed opacity-80">Grant your professional accountant secure, direct visibility into your ledger to simplify compliance and year-end filing.</p>
                    </div>
                    <button onClick={() => navigate('/team')} className="relative z-10 bg-white text-fb-navy px-12 py-6 rounded-[28px] font-black text-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-2xl">
                        Invite CPA
                    </button>
                </div>
            </div>
        </div>
    );
}
