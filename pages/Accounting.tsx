import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, TrendingDown, BookOpen } from 'lucide-react';

export default function Accounting() {
    const [cashOnHand, setCashOnHand] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [accountsReceivable, setAccountsReceivable] = useState(0);

    useEffect(() => {
        // Calculate Cash on Hand (Sum of all payments)
        const payments = JSON.parse(localStorage.getItem('fb_payments') || '[]');
        const cash = payments.reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
        setCashOnHand(cash);

        // Calculate Cost of Goods/Expenses
        const expenses = JSON.parse(localStorage.getItem('fb_expenses') || '[]');
        const exp = expenses.reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
        setTotalExpenses(exp);

        // Calculate Accounts Receivable (Unpaid Invoices)
        const invoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
        const ar = invoices.reduce((acc: number, i: any) => acc + (i.amount || 0), 0); // Simplified: treating all as AR for demo
        setAccountsReceivable(ar);

    }, []);

    const equity = cashOnHand - totalExpenses;

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
                    <div className="flex items-center text-gray-500 mb-2">
                        <TrendingUp size={18} className="mr-2 text-green-500" /> Cash on Hand
                    </div>
                    <div className="text-2xl font-bold text-fb-slate">₱{cashOnHand.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                </div>
                <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
                    <div className="flex items-center text-gray-500 mb-2">
                        <TrendingDown size={18} className="mr-2 text-red-500" /> Total Expenses
                    </div>
                    <div className="text-2xl font-bold text-fb-slate">₱{totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                </div>
                 <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
                    <div className="flex items-center text-gray-500 mb-2">
                        <PieChart size={18} className="mr-2 text-blue-500" /> Net Equity
                    </div>
                    <div className="text-2xl font-bold text-fb-slate">₱{equity.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                </div>
            </div>

            {/* Chart of Accounts */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-fb-slate flex items-center">
                        <BookOpen size={20} className="mr-2 text-gray-400" /> Chart of Accounts
                    </h3>
                    <button className="text-fb-blue font-bold text-sm hover:underline">View General Ledger</button>
                </div>

                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-bold text-gray-600">Account Name</th>
                                <th className="p-4 font-bold text-gray-600">Type</th>
                                <th className="p-4 font-bold text-gray-600 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-fb-slate">Cash on Hand</td>
                                <td className="p-4 text-gray-500">Asset</td>
                                <td className="p-4 text-right font-medium">₱{cashOnHand.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-fb-slate">Accounts Receivable</td>
                                <td className="p-4 text-gray-500">Asset</td>
                                <td className="p-4 text-right font-medium">₱{accountsReceivable.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-fb-slate">Owner's Equity</td>
                                <td className="p-4 text-gray-500">Equity</td>
                                <td className="p-4 text-right font-medium">₱{equity.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                             <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-fb-slate">Sales Revenue</td>
                                <td className="p-4 text-gray-500">Revenue</td>
                                <td className="p-4 text-right font-medium">₱{cashOnHand.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-fb-slate">Operating Expenses</td>
                                <td className="p-4 text-gray-500">Expense</td>
                                <td className="p-4 text-right font-medium">₱{totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}