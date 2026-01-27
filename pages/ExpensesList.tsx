import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Receipt, Tag, Paperclip, X, CheckCircle2 } from 'lucide-react';

export default function ExpensesList() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    // Data State
    const [expenses, setExpenses] = useState<any[]>([]);
    const [newExpense, setNewExpense] = useState({ merchant: '', amount: '', date: '', category: 'Office Supplies' });

    useEffect(() => {
        const stored = localStorage.getItem('fb_expenses');
        if (stored) {
            setExpenses(JSON.parse(stored));
        }
    }, []);

    const handleSave = () => {
        const expense = {
            id: Date.now(),
            merchant: newExpense.merchant,
            amount: parseFloat(newExpense.amount) || 0,
            date: newExpense.date || new Date().toISOString().split('T')[0],
            category: newExpense.category,
            status: 'Billable',
            hasReceipt: false
        };
        const updated = [...expenses, expense];
        setExpenses(updated);
        localStorage.setItem('fb_expenses', JSON.stringify(updated));

        setIsModalOpen(false);
        setShowToast(true);
        setNewExpense({ merchant: '', amount: '', date: '', category: 'Office Supplies' });
        setTimeout(() => setShowToast(false), 3000);
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Expense Saved Successfully</span>
                </div>
            )}

             {/* Top Action */}
             <div className="absolute top-[-50px] right-0">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-fb-green hover:bg-[#33c46b] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                >
                    New Expense
                </button>
            </div>

            {/* Stats Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 px-4 border-b border-gray-200 pb-8">
                 <div className="text-center border-r border-gray-200 last:border-0">
                     <div className="text-2xl font-bold text-fb-slate mb-1">₱{totalExpenses.toFixed(2)}</div>
                     <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Expenses</div>
                 </div>
                 <div className="text-center border-r border-gray-200 last:border-0">
                     <div className="text-2xl font-bold text-fb-blue mb-1">₱0.00</div>
                     <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">To Bill</div>
                 </div>
                 <div className="text-center border-r border-gray-200 last:border-0">
                     <div className="text-2xl font-bold text-fb-slate mb-1">₱0.00</div>
                     <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Taxes</div>
                 </div>
                 <div className="text-center">
                     <div className="text-2xl font-bold text-fb-green mb-1">₱0.00</div>
                     <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Profit Impact</div>
                 </div>
            </div>

            {/* List Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-fb-slate">All Expenses</h3>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search Expenses" 
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-fb-blue w-64 focus:ring-1 focus:ring-fb-blue"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-normal text-gray-500 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                                <th className="p-4 font-normal text-gray-500">Date</th>
                                <th className="p-4 font-normal text-gray-500">Merchant</th>
                                <th className="p-4 font-normal text-gray-500">Category</th>
                                <th className="p-4 font-normal text-gray-500 text-right">Amount</th>
                                <th className="p-4 font-normal text-gray-500 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr 
                                    key={expense.id}
                                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors group"
                                >
                                    <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                                    <td className="p-4 text-gray-600">{expense.date}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-fb-slate group-hover:text-fb-blue">{expense.merchant}</div>
                                        <div className="text-xs text-gray-400 mt-1 flex items-center">
                                            {expense.status === 'Billable' ? <span className="text-fb-green mr-2">● Billable</span> : <span className="text-gray-400 mr-2">● Non-billable</span>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center text-gray-600">
                                            <Tag size={14} className="mr-2 text-gray-400" /> {expense.category}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-bold text-fb-slate">₱{expense.amount.toFixed(2)}</div>
                                    </td>
                                    <td className="p-4">
                                        {expense.hasReceipt && <Paperclip size={16} className="text-gray-300" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                             <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-fb-slate">New Expense</h2>
                                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Merchant</label>
                                    <input 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                        placeholder="e.g. Starbucks"
                                        value={newExpense.merchant}
                                        onChange={e => setNewExpense({...newExpense, merchant: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                            value={newExpense.date}
                                            onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Amount</label>
                                        <input 
                                            type="number" 
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                            placeholder="0.00"
                                            value={newExpense.amount}
                                            onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none bg-white"
                                        value={newExpense.category}
                                        onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                                    >
                                        <option>Meals & Entertainment</option>
                                        <option>Office Supplies</option>
                                        <option>Travel</option>
                                        <option>Software</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-2">
                                     <input type="checkbox" className="mr-2" />
                                     <span className="text-sm text-gray-600">Billable to Client</span>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button onClick={() => setIsModalOpen(false)} className="font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                                <button onClick={handleSave} className="bg-fb-green hover:bg-[#33c46b] text-white font-bold py-2 px-6 rounded shadow-sm">Save Expense</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}