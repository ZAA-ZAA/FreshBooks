// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, FileOutput, CheckCircle2, X, Filter, 
    MoreHorizontal, Pencil, Trash2, Landmark, ShieldAlert, Receipt
} from 'lucide-react';

const Stat = ({ value, sub, colorClass }: { value: string, sub: string, colorClass: string }) => (
    <div className="text-center flex-1 border-r border-gray-100 last:border-0 py-4 group cursor-default">
        <div className={`text-5xl font-black mb-2 transition-transform group-hover:scale-105 ${colorClass}`}>{value}</div>
        <div className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">{sub}</div>
    </div>
);

export default function BillsList() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [bills, setBills] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newBill, setNewBill] = useState({ vendor: '', date: '', details: '', amount: '' });

    useEffect(() => {
        const stored = localStorage.getItem('fb_bills');
        if (stored) setBills(JSON.parse(stored));
    }, []);

    const filteredBills = bills.filter(b => 
        b.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        const bill = {
            id: Date.now(),
            vendor: newBill.vendor || 'Unknown Vendor',
            date: newBill.date || new Date().toISOString().split('T')[0],
            details: newBill.details || 'Operational Bill',
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

    const handleDelete = (id) => {
        if (window.confirm('Delete this bill?')) {
            const updated = bills.filter(b => b.id !== id);
            setBills(updated);
            localStorage.setItem('fb_bills', JSON.stringify(updated));
        }
    };

    const overdueAmount = bills.filter(b => b.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);
    const outstandingAmount = bills.filter(b => b.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 relative">
             {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] bg-[#28303f] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-black/10">
                    <CheckCircle2 className="text-fb-green mr-3" size={24} />
                    <span className="font-bold">Bill Authenticated</span>
                </div>
            )}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-fb-navy tracking-tighter">Bills</h1>
                    <p className="text-gray-400 font-bold mt-2">Manage your payables and accounts with vendors</p>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-fb-navy font-black text-lg hover:underline transition-all">Import CSV</button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-fb-green hover:brightness-110 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-fb-green/20 transition-all active:scale-95"
                    >
                        New Bill
                    </button>
                </div>
            </div>

            {/* Stats Header */}
            <div className="flex justify-between items-center pt-6 px-12 bg-white border border-gray-100 rounded-[32px] shadow-sm">
                 <Stat value={`₱${overdueAmount.toLocaleString()}`} sub="Overdue Payables" colorClass="text-red-500" />
                 <Stat value={`₱${outstandingAmount.toLocaleString()}`} sub="Outstanding Total" colorClass="text-fb-blue" />
                 <Stat value="₱0" sub="Drafted Bills" colorClass="text-gray-300" />
            </div>

            {/* Search & Actions Shelf */}
            <div className="pt-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 h-16 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-fb-navy tracking-tight">Accounts Payable</h2>
                        <div className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-xs font-black">{bills.length} Records</div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue transition-colors" size={20} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none w-full md:w-80 text-sm font-bold text-fb-navy shadow-sm transition-all" 
                                placeholder="Search vendors or bills..." 
                            />
                        </div>
                        <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} /> Filters
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-red-500">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <tr>
                                <th className="p-6 w-16"><input type="checkbox" className="rounded-lg border-gray-300 text-fb-blue w-5 h-5" /></th>
                                <th className="p-6">Vendor / Business</th>
                                <th className="p-6">Date / Due</th>
                                <th className="p-6">Details / Category</th>
                                <th className="p-6 text-right">Aggregate Amount</th>
                                <th className="p-6 w-32"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBills.map((bill) => (
                                <tr key={bill.id} className="transition-all duration-300 group cursor-pointer hover:bg-fb-gray" onClick={() => setIsModalOpen(true)}>
                                    <td className="p-6" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded-lg border-gray-300 text-fb-blue w-5 h-5" /></td>
                                    <td className="p-6 border-l-8 border-red-500/30 group-hover:border-red-500 transition-all">
                                        <div className="font-black text-fb-navy group-hover:text-fb-blue text-lg leading-tight mb-1">{bill.vendor}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">A/P Record</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-black text-fb-navy text-xs mb-1">{bill.date}</div>
                                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Standard Terms</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-gray-500 font-medium line-clamp-1 italic">"{bill.details}"</div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="font-black text-fb-navy text-xl leading-none mb-1">₱{bill.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest border ${bill.status === 'Overdue' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-fb-blue/5 text-fb-blue border-fb-blue/10'}`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-x-2">
                                            <button className="w-10 h-10 bg-fb-blue/5 text-fb-blue rounded-xl flex items-center justify-center hover:bg-fb-blue hover:text-white transition-all shadow-sm"><Pencil size={18} /></button>
                                            <button onClick={() => handleDelete(bill.id)} className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredBills.length === 0 && (
                        <div className="p-32 text-center bg-gray-50/30">
                            <div className="flex flex-col items-center">
                                <ShieldAlert size={64} className="text-gray-100 mb-6" />
                                <p className="text-gray-400 font-black text-2xl italic tracking-tight">No matching payables found</p>
                                <button onClick={() => setIsModalOpen(true)} className="bg-fb-blue text-white px-8 py-3 rounded-xl font-black mt-6 shadow-xl active:scale-95 transition-all">Record Your First Bill</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-fb-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[600px] animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-12">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                                        <Landmark size={24} />
                                     </div>
                                     <h2 className="text-3xl font-black text-fb-navy">New Payable Record</h2>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-fb-navy transition-colors"><X size={32} /></button>
                            </div>
                            
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Vendor / Supplier</label>
                                    <input 
                                        autoFocus
                                        className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy text-xl shadow-sm transition-all" 
                                        value={newBill.vendor}
                                        onChange={e => setNewBill({...newBill, vendor: e.target.value})}
                                        placeholder="e.g. AWS Marketplace"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Description of Goods/Services</label>
                                    <input 
                                        className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-bold text-gray-600 shadow-sm transition-all" 
                                        value={newBill.details}
                                        onChange={e => setNewBill({...newBill, details: e.target.value})}
                                        placeholder="What was this bill for?"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Issue Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-bold text-fb-navy shadow-sm transition-all"
                                            value={newBill.date}
                                            onChange={e => setNewBill({...newBill, date: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Amount (PHP)</label>
                                        <input 
                                            type="number" 
                                            className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy text-xl shadow-sm transition-all" 
                                            placeholder="0.00" 
                                            value={newBill.amount}
                                            onChange={e => setNewBill({...newBill, amount: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
    
                            <div className="flex justify-end items-center gap-10 mt-16 pt-10 border-t border-gray-50">
                                <button onClick={() => setIsModalOpen(false)} className="font-black text-gray-400 hover:text-fb-navy transition-colors uppercase tracking-[0.2em] text-xs">Cancel</button>
                                <button 
                                    onClick={handleSave}
                                    disabled={!newBill.vendor || !newBill.amount}
                                    className={`font-black py-5 px-12 rounded-2xl shadow-xl text-white transition-all transform active:scale-95 flex items-center gap-3 ${(!newBill.vendor || !newBill.amount) ? 'bg-gray-200 cursor-not-allowed' : 'bg-red-500 hover:brightness-110 shadow-red-200'}`}
                                >
                                    Record Bill <FileOutput size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}