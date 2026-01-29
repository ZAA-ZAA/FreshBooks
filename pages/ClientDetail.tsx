// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ChevronRight, ChevronDown, Plus, Clock, FileText, 
    DollarSign, Pencil, ScrollText, Trash2, RotateCcw, Calculator, 
    Briefcase, Landmark, Zap, Search
} from 'lucide-react';

export default function ClientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [clientInvoices, setClientInvoices] = useState([]);
    const [totalOutstanding, setTotalOutstanding] = useState(0);
    const [lifetimeValue, setLifetimeValue] = useState(0);

    useEffect(() => {
        const storedClients = JSON.parse(localStorage.getItem('fb_clients') || '[]');
        const found = storedClients.find(c => c.id === id);
        if (found) setClient(found);

        const allInvoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
        const filtered = allInvoices.filter(inv => inv.client === found?.company);
        setClientInvoices(filtered);

        setTotalOutstanding(filtered.filter(i => i.status !== 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0));
        setLifetimeValue(filtered.reduce((acc, curr) => acc + (curr.amount || 0), 0));
    }, [id]);

    if (!client) return <div className="p-32 text-center text-gray-300">Loading Client Profile...</div>;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center text-xs font-bold text-fb-blue uppercase tracking-widest mb-6">
                <Link to="/clients" className="hover:underline">Directory</Link>
                <ChevronRight size={14} className="mx-2 text-gray-300" />
                <span className="text-gray-400">{client.company}</span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-[#002a63] text-white flex items-center justify-center text-2xl font-bold">
                        {client.name[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-fb-navy">{client.company}</h1>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">{client.name}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate(`/clients/${id}/edit`)} className="bg-white border border-gray-300 px-4 py-2 rounded-lg font-bold text-fb-navy hover:bg-gray-50 flex items-center gap-2">
                        <Pencil size={16} /> Edit
                    </button>
                    <button onClick={() => navigate('/invoices/new', { state: { clientId: id } })} className="bg-fb-green text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-fb-darkGreen">
                        New Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Outstanding</p>
                    <p className="text-3xl font-bold text-fb-navy">₱{totalOutstanding.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Lifetime Value</p>
                    <p className="text-3xl font-bold text-fb-navy">₱{lifetimeValue.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Open Invoices</p>
                    <p className="text-3xl font-bold text-fb-navy">{clientInvoices.filter(i => i.status !== 'Paid').length}</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-fb-navy text-sm uppercase tracking-wider">Invoice History</h3>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Invoice #</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clientInvoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-fb-gray cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
                                <td className="p-4 font-mono text-xs">{inv.number}</td>
                                <td className="p-4 text-gray-500">{inv.date}</td>
                                <td className="p-4 text-right font-bold text-fb-navy">₱{inv.amount.toLocaleString()}</td>
                                <td className="p-4 text-right">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${inv.status === 'Paid' ? 'bg-fb-green/10 text-fb-green border-fb-green/20' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>{inv.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clientInvoices.length === 0 && (
                    <div className="p-20 text-center text-gray-400 text-sm">No invoice history found for this client.</div>
                )}
            </div>
        </div>
    );
}
