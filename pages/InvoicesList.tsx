import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, ChevronDown, Calendar, User, MoreHorizontal, Copy, Trash, Send, CheckCircle2 } from 'lucide-react';

const Stat = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
    <div className="text-center flex-1 border-r border-gray-200 last:border-0 py-2">
        <div className="text-3xl font-bold text-fb-blue mb-1">{value}</div>
        <div className="text-sm text-gray-500 font-medium">{sub}</div>
    </div>
);

export default function InvoicesList() {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [actionOpenId, setActionOpenId] = useState<string | null>(null);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    
    // Filter State
    const [filterStatus, setFilterStatus] = useState('Any Status');
    const [filterClient, setFilterClient] = useState('All Clients');
    const [searchTerm, setSearchTerm] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const storedInv = localStorage.getItem('fb_invoices');
        if (storedInv) setInvoices(JSON.parse(storedInv));

        const storedClients = localStorage.getItem('fb_clients');
        if (storedClients) setClients(JSON.parse(storedClients));
    }, []);

    const toggleAction = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setActionOpenId(actionOpenId === id ? null : id);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = invoices.filter(inv => inv.id !== id);
        setInvoices(updated);
        localStorage.setItem('fb_invoices', JSON.stringify(updated));
        setActionOpenId(null);
    };

    const handleSend = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = invoices.map(inv => inv.id === id ? { ...inv, status: 'Sent' } : inv);
        setInvoices(updated);
        localStorage.setItem('fb_invoices', JSON.stringify(updated));
        setActionOpenId(null);
        setToastMessage('Invoice Sent Successfully');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleDuplicate = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const original = invoices.find(inv => inv.id === id);
        if (original) {
            const newId = Date.now().toString();
            // Simple increment for demo number
            const nextNum = (invoices.length + 1).toString().padStart(7, '0');
            
            const duplicate = {
                ...original,
                id: newId,
                number: nextNum,
                status: 'Draft',
                date: new Date().toISOString().split('T')[0]
            };
            
            const updated = [duplicate, ...invoices];
            setInvoices(updated);
            localStorage.setItem('fb_invoices', JSON.stringify(updated));
            setActionOpenId(null);
            setToastMessage('Invoice Duplicated');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    // --- FILTER LOGIC ---
    const filteredInvoices = invoices.filter(inv => {
        const matchesStatus = filterStatus === 'Any Status' || inv.status === filterStatus;
        const matchesClient = filterClient === 'All Clients' || inv.client === filterClient;
        const matchesSearch = inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              inv.number.includes(searchTerm) || 
                              (inv.amount && inv.amount.toString().includes(searchTerm));
        
        return matchesStatus && matchesClient && matchesSearch;
    });

    const totalOutstanding = invoices.filter(i => i.status !== 'Paid').reduce((acc, inv) => acc + (inv.amount || 0), 0);
    const overdue = invoices.filter(i => i.status === 'Overdue').reduce((acc, inv) => acc + (inv.amount || 0), 0);
    const draft = invoices.filter(i => i.status === 'Draft').reduce((acc, inv) => acc + (inv.amount || 0), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-20 relative">
             {/* Toast */}
             {showToast && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[60] bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">{toastMessage}</span>
                </div>
            )}

            {/* Top Action */}
            <div className="absolute top-[-50px] right-0">
                <button 
                    onClick={() => navigate('/invoices/new')}
                    className="bg-fb-green hover:bg-[#33c46b] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                >
                    New Invoice
                </button>
            </div>

            {/* Toggle */}
            <div className="flex justify-center mb-8 relative">
                <div className="bg-white border border-gray-300 rounded-full p-1 flex relative z-10">
                    <button className="px-6 py-1.5 rounded-full bg-fb-blue text-white font-bold text-xs shadow-sm">From Me</button>
                    <button className="px-6 py-1.5 rounded-full text-gray-500 font-bold text-xs hover:bg-gray-50 transition-colors">To Me</button>
                </div>
                <div className="absolute top-1/2 w-full border-b border-gray-200 z-0"></div>
            </div>

            {/* Stats Header */}
            <div className="flex justify-between items-start mb-10 px-8 relative">
                 <Stat value={`₱${overdue.toFixed(0)}`} sub="overdue" label="" />
                 <Stat value={`₱${totalOutstanding.toFixed(0)}`} sub="total outstanding" label="" />
                 <Stat value={`₱${draft.toFixed(0)}`} sub="in draft" label="" />

                 {/* Handwriting annotations */}
                 <div className="absolute left-[35%] top-[80%] text-fb-blue font-handwriting italic text-sm transform -rotate-2 hidden md:block">
                     <span className="text-xl mr-2">↖</span> See everything you're <br/> owed at a glance
                 </div>
            </div>

            {/* Recently Updated */}
            <div className="mb-8">
                <h3 className="font-bold text-lg text-fb-slate mb-4">Recently Updated</h3>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    <div 
                        onClick={() => navigate('/invoices/new')}
                        className="min-w-[200px] w-[200px] h-[260px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-fb-green transition-colors"
                    >
                        <Plus size={32} className="mb-2" />
                        <span className="font-bold">New Invoice</span>
                    </div>
                    
                    {/* Invoice Cards */}
                    {invoices.slice(0, 5).map(inv => (
                        <div 
                            key={inv.id}
                            onClick={() => navigate(`/invoices/${inv.id}`)}
                            className="min-w-[200px] w-[200px] h-[260px] bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative cursor-pointer hover:shadow-md transition-shadow group flex-shrink-0"
                        >
                             <div className="text-xs text-gray-400 mb-2">{inv.number}</div>
                             <div className="font-bold text-sm mb-1 text-fb-blue group-hover:underline truncate">{inv.client}</div>
                             <div className="text-xs text-gray-500 mb-8">{inv.date}</div>
                             <div className="absolute bottom-10 right-4 font-bold text-fb-slate">₱{inv.amount ? inv.amount.toFixed(2) : '0.00'}</div>
                             <div className="absolute bottom-0 left-0 w-full bg-gray-200 text-center py-2 text-xs font-bold text-gray-600 rounded-b-lg">
                                 {inv.status}
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* List Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-xl text-fb-slate">All Invoices</h3>
                        <button 
                            onClick={() => navigate('/invoices/new')}
                            className="bg-fb-green text-white p-1 rounded hover:bg-[#33c46b] transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:border-fb-blue w-64 focus:ring-1 focus:ring-fb-blue"
                            />
                        </div>
                        <button 
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`px-4 py-2 border border-l-0 rounded-r text-sm font-medium flex items-center transition-colors ${isSearchOpen ? 'bg-gray-100 border-gray-400 text-fb-slate' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <SlidersHorizontal size={14} className="mr-2" /> Advanced Search <ChevronDown size={14} className="ml-1" />
                        </button>
                    </div>
                </div>

                {/* Advanced Search Panel */}
                {isSearchOpen && (
                    <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm focus:border-fb-blue outline-none"
                            >
                                <option>Any Status</option>
                                <option>Draft</option>
                                <option>Sent</option>
                                <option>Paid</option>
                                <option>Overdue</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Client</label>
                            <select 
                                value={filterClient}
                                onChange={(e) => setFilterClient(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm focus:border-fb-blue outline-none"
                            >
                                <option>All Clients</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.company}>{c.company}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Date Range</label>
                            <select className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-400" disabled>
                                <option>Any Time (Pro)</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-visible">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="p-4 w-10"><input type="checkbox" className="rounded border-gray-300 focus:ring-fb-blue" /></th>
                                <th className="p-4 font-normal text-gray-500">Client / Invoice Number</th>
                                <th className="p-4 font-normal text-gray-500">Description</th>
                                <th className="p-4 font-normal text-gray-500">
                                    <span className="font-bold text-fb-slate">Issued Date</span> / Due Date
                                </th>
                                <th className="p-4 font-normal text-gray-500 text-right">Amount / Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((inv) => (
                                <tr 
                                    key={inv.id}
                                    onClick={() => navigate(`/invoices/${inv.id}`)}
                                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors group relative z-0"
                                >
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" className="rounded border-gray-300 focus:ring-fb-blue" />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-fb-slate group-hover:text-fb-blue group-hover:underline">{inv.client}</div>
                                        <div className="text-gray-500 text-xs">{inv.number}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">{inv.description || 'No description'}</td>
                                    <td className="p-4">
                                        <div className="text-gray-800">{inv.date}</div>
                                        <div className="text-gray-400 text-xs">Due in 30 days</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-bold text-fb-slate">₱{inv.amount ? inv.amount.toFixed(2) : '0.00'}</div>
                                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${inv.status === 'Paid' ? 'bg-green-100 text-fb-green' : 'bg-gray-200 text-gray-600'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="p-4 relative">
                                        <button 
                                            onClick={(e) => toggleAction(e, inv.id)}
                                            className="p-2 text-gray-400 hover:text-fb-blue rounded hover:bg-blue-100 transition-colors"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                        
                                        {/* Action Dropdown */}
                                        {actionOpenId === inv.id && (
                                            <div className="absolute right-8 top-10 w-48 bg-white border border-gray-200 rounded shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                                                <div className="py-1">
                                                    <button 
                                                        onClick={(e) => handleSend(e, inv.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-fb-blue hover:text-white flex items-center"
                                                    >
                                                        <Send size={14} className="mr-2" /> Mark as Sent
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleDuplicate(e, inv.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-fb-blue hover:text-white flex items-center"
                                                    >
                                                        <Copy size={14} className="mr-2" /> Duplicate
                                                    </button>
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    <button 
                                                        onClick={(e) => handleDelete(e, inv.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                                    >
                                                        <Trash size={14} className="mr-2" /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No invoices found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td colSpan={6} className="p-4 text-right font-medium text-gray-600 text-sm">
                                    Grand Total (Visible): <span className="font-bold text-fb-slate ml-2">₱{filteredInvoices.reduce((acc, i) => acc + (i.amount || 0), 0).toFixed(2)} PHP</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div className="flex justify-between items-center mt-4 pb-12">
                     <div className="text-sm font-bold text-fb-slate">1-{filteredInvoices.length} <span className="font-normal text-gray-500">of {invoices.length}</span></div>
                     
                     <div className="flex flex-col items-center">
                         <button className="border border-gray-300 px-4 py-2 rounded text-sm font-bold text-fb-slate hover:bg-gray-50">View Archived Invoices</button>
                         <button className="text-xs text-gray-400 mt-2 underline hover:text-gray-600">or deleted</button>
                     </div>

                     <div className="flex items-center text-sm text-gray-500">
                         Items per page: 
                         <select className="ml-2 border border-gray-300 rounded p-1 bg-white">
                             <option>30</option>
                         </select>
                     </div>
                </div>
            </div>
        </div>
    );
}