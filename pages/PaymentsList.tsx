import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, X, CheckCircle2 } from 'lucide-react';

export default function PaymentsList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    // Form State
    const [newPayment, setNewPayment] = useState({ client: '', amount: '', date: '', method: 'Credit Card', invoice: '' });
    
    // Data State
    const [payments, setPayments] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        // Load Data
        const storedPayments = localStorage.getItem('fb_payments');
        if (storedPayments) setPayments(JSON.parse(storedPayments));

        const storedClients = localStorage.getItem('fb_clients');
        if (storedClients) setClients(JSON.parse(storedClients));

        const storedInvoices = localStorage.getItem('fb_invoices');
        if (storedInvoices) setInvoices(JSON.parse(storedInvoices));
    }, []);

    const handleSave = () => {
        const payment = {
            id: Date.now(),
            client: newPayment.client || 'General Client',
            amount: parseFloat(newPayment.amount) || 0,
            date: newPayment.date || new Date().toISOString().split('T')[0],
            method: newPayment.method,
            invoice: newPayment.invoice || 'N/A'
        };
        const updatedPayments = [payment, ...payments];
        setPayments(updatedPayments);
        localStorage.setItem('fb_payments', JSON.stringify(updatedPayments));

        // Update Invoice Status if attached
        if (newPayment.invoice) {
            const updatedInvoices = invoices.map(inv => {
                if (inv.number === newPayment.invoice) {
                    return { ...inv, status: 'Paid' };
                }
                return inv;
            });
            setInvoices(updatedInvoices);
            localStorage.setItem('fb_invoices', JSON.stringify(updatedInvoices));
        }

        setIsModalOpen(false);
        setShowToast(true);
        setNewPayment({ client: '', amount: '', date: '', method: 'Credit Card', invoice: '' });
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewPayment({...newPayment, client: e.target.value, invoice: ''});
    };

    const handleInvoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const invNum = e.target.value;
        const inv = invoices.find(i => i.number === invNum);
        // Auto fill amount
        setNewPayment({
            ...newPayment, 
            invoice: invNum,
            amount: inv ? inv.amount.toString() : newPayment.amount
        });
    };

    // Filter invoices based on selected client
    const availableInvoices = invoices.filter(
        inv => inv.client === newPayment.client && inv.status !== 'Paid'
    );

    const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Payment Logged Successfully</span>
                </div>
            )}

            {/* Top Action */}
            <div className="absolute top-[-50px] right-0">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-fb-green hover:bg-[#33c46b] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                >
                    Log Payment
                </button>
            </div>

            {/* Stats Header */}
            <div className="grid grid-cols-2 gap-8 mb-8 px-4 border-b border-gray-200 pb-8">
                 <div className="text-center border-r border-gray-200">
                     <div className="text-3xl font-bold text-fb-slate mb-1">₱{totalCollected.toLocaleString()}</div>
                     <div className="text-sm text-gray-500 font-medium">Total Collected (YTD)</div>
                 </div>
                 <div className="text-center">
                     <div className="text-3xl font-bold text-fb-blue mb-1">₱0</div>
                     <div className="text-sm text-gray-500 font-medium">Outstanding</div>
                 </div>
            </div>

            {/* List Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-fb-slate">Payments Received</h3>
                    <div className="flex space-x-2">
                         <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search" 
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-fb-blue w-64 focus:ring-1 focus:ring-fb-blue"
                            />
                        </div>
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-normal text-gray-500">Date</th>
                                <th className="p-4 font-normal text-gray-500">Invoice</th>
                                <th className="p-4 font-normal text-gray-500">Client</th>
                                <th className="p-4 font-normal text-gray-500">Method</th>
                                <th className="p-4 font-normal text-gray-500 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => (
                                <tr key={p.id} className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                                    <td className="p-4 text-gray-600">{p.date}</td>
                                    <td className="p-4 text-fb-blue hover:underline">{p.invoice || 'N/A'}</td>
                                    <td className="p-4 font-bold text-fb-slate">{p.client}</td>
                                    <td className="p-4 text-gray-600">{p.method}</td>
                                    <td className="p-4 text-right font-bold text-fb-slate">₱{p.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">No payments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Log Payment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-fb-slate">Log Payment</h2>
                                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Client</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none bg-white"
                                        value={newPayment.client}
                                        onChange={handleClientChange}
                                    >
                                        <option value="">Select a Client</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.company}>{c.company}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dynamic Invoice Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Invoice</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none bg-white"
                                        value={newPayment.invoice}
                                        onChange={handleInvoiceChange}
                                        disabled={!newPayment.client}
                                    >
                                        <option value="">Select an Invoice (Optional)</option>
                                        {availableInvoices.map(inv => (
                                            <option key={inv.id} value={inv.number}>
                                                #{inv.number} - ₱{inv.amount.toLocaleString()} (Due: {inv.date})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Amount</label>
                                        <input 
                                            type="number" 
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                            placeholder="0.00"
                                            value={newPayment.amount}
                                            onChange={e => setNewPayment({...newPayment, amount: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                            value={newPayment.date}
                                            onChange={e => setNewPayment({...newPayment, date: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Payment Method</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none bg-white"
                                        value={newPayment.method}
                                        onChange={e => setNewPayment({...newPayment, method: e.target.value})}
                                    >
                                        <option>Credit Card</option>
                                        <option>Bank Transfer</option>
                                        <option>Cash</option>
                                        <option>Check</option>
                                    </select>
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
                                    Save Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}