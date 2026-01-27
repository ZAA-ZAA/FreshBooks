import React, { useState, useEffect } from 'react';
import { Plus, Search, FileOutput, CheckCircle2, X } from 'lucide-react';

export default function BillsList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [bills, setBills] = useState<any[]>([]);
    const [newBill, setNewBill] = useState({ vendor: '', date: '', details: '', amount: '' });

    useEffect(() => {
        const stored = localStorage.getItem('fb_bills');
        if (stored) {
            setBills(JSON.parse(stored));
        }
    }, []);

    const handleSave = () => {
        const bill = {
            id: Date.now(),
            vendor: newBill.vendor,
            date: newBill.date || new Date().toISOString().split('T')[0],
            details: newBill.details || 'General Expense',
            amount: parseFloat(newBill.amount) || 0,
            status: 'Unpaid'
        };
        const updated = [bill, ...bills];
        setBills(updated);
        localStorage.setItem('fb_bills', JSON.stringify(updated));

        setIsModalOpen(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setNewBill({ vendor: '', date: '', details: '', amount: '' });
    };

    const overdueAmount = bills.filter(b => b.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);
    const outstandingAmount = bills.filter(b => b.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Bill Created Successfully</span>
                </div>
            )}

             {/* Top Action */}
             <div className="absolute top-[-50px] right-0">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-fb-green hover:bg-[#33c46b] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                >
                    New Bill
                </button>
            </div>

            {/* Stats Header */}
            <div className="grid grid-cols-3 gap-8 mb-8 px-4 border-b border-gray-200 pb-8">
                 <div className="text-center border-r border-gray-200">
                     <div className="text-3xl font-bold text-red-500 mb-1">₱{overdueAmount.toLocaleString()}</div>
                     <div className="text-sm text-gray-500 font-medium">Overdue</div>
                 </div>
                 <div className="text-center border-r border-gray-200">
                     <div className="text-3xl font-bold text-fb-blue mb-1">₱{outstandingAmount.toLocaleString()}</div>
                     <div className="text-sm text-gray-500 font-medium">Outstanding</div>
                 </div>
                 <div className="text-center">
                     <div className="text-3xl font-bold text-fb-slate mb-1">₱0</div>
                     <div className="text-sm text-gray-500 font-medium">Draft</div>
                 </div>
            </div>

            {/* List Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-fb-slate">Bills</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Bills" 
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-fb-blue w-64 focus:ring-1 focus:ring-fb-blue"
                        />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-normal text-gray-500">Date</th>
                                <th className="p-4 font-normal text-gray-500">Vendor</th>
                                <th className="p-4 font-normal text-gray-500">Details</th>
                                <th className="p-4 font-normal text-gray-500 text-right">Amount</th>
                                <th className="p-4 font-normal text-gray-500 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.id} className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                                    <td className="p-4 text-gray-600">{bill.date}</td>
                                    <td className="p-4 font-bold text-fb-slate">{bill.vendor}</td>
                                    <td className="p-4 text-gray-600">{bill.details}</td>
                                    <td className="p-4 text-right font-bold text-fb-slate">₱{bill.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    <td className="p-4 text-right">
                                        <span className={`font-bold text-xs uppercase ${bill.status === 'Overdue' ? 'text-red-500' : 'text-fb-blue'}`}>
                                            {bill.status}
                                        </span>
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
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-fb-slate">Add Bill</h2>
                                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Vendor</label>
                                    <input 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                        placeholder="e.g. AWS" 
                                        value={newBill.vendor}
                                        onChange={e => setNewBill({...newBill, vendor: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Details</label>
                                    <input 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                        placeholder="e.g. Hosting" 
                                        value={newBill.details}
                                        onChange={e => setNewBill({...newBill, details: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Issue Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none"
                                            value={newBill.date}
                                            onChange={e => setNewBill({...newBill, date: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Total Amount</label>
                                        <input 
                                            type="number" 
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                            placeholder="0.00" 
                                            value={newBill.amount}
                                            onChange={e => setNewBill({...newBill, amount: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
    
                            <div className="flex justify-end space-x-4 mt-8">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="font-bold text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="bg-fb-green hover:bg-[#33c46b] text-white font-bold py-2 px-6 rounded shadow-sm"
                                >
                                    Save Bill
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}