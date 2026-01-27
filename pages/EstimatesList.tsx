import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function EstimatesList() {
    const navigate = useNavigate();
    const [estimates, setEstimates] = useState<any[]>([]);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('fb_estimates');
        if (stored) {
            setEstimates(JSON.parse(stored));
        }
    }, []);

    const convertToInvoice = (e: React.MouseEvent, estimate: any) => {
        e.stopPropagation();
        
        // Load existing invoices to get next ID
        const storedInvoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
        const nextId = Date.now().toString(); // Simple ID generation
        const nextNum = (storedInvoices.length + 1).toString().padStart(7, '0');

        const newInvoice = {
            id: nextId,
            number: nextNum,
            client: estimate.client,
            date: new Date().toISOString().split('T')[0],
            amount: estimate.amount,
            status: 'Draft',
            description: estimate.description || 'Converted from Estimate'
        };

        const updatedInvoices = [...storedInvoices, newInvoice];
        localStorage.setItem('fb_invoices', JSON.stringify(updatedInvoices));

        // Mark estimate as Accepted? Optional, but good UX
        const updatedEstimates = estimates.map(est => 
            est.id === estimate.id ? { ...est, status: 'Accepted' } : est
        );
        setEstimates(updatedEstimates);
        localStorage.setItem('fb_estimates', JSON.stringify(updatedEstimates));

        setShowToast(true);
        setTimeout(() => {
            navigate(`/invoices/${nextId}`);
        }, 1000);
    };

    const acceptedAmount = estimates.filter(e => e.status === 'Accepted').reduce((acc, curr) => acc + curr.amount, 0);
    const sentAmount = estimates.filter(e => e.status === 'Sent' || e.status === 'Draft').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Converted to Invoice Successfully</span>
                </div>
            )}

             {/* Top Action */}
             <div className="absolute top-[-50px] right-0">
                <button 
                    onClick={() => navigate('/estimates/new')}
                    className="bg-fb-green hover:bg-[#33c46b] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                >
                    New Estimate
                </button>
            </div>

            {/* Stats Header */}
            <div className="grid grid-cols-3 gap-8 mb-8 px-4 border-b border-gray-200 pb-8">
                 <div className="text-center border-r border-gray-200">
                     <div className="text-3xl font-bold text-fb-blue mb-1">₱0</div>
                     <div className="text-sm text-gray-500 font-medium">Draft</div>
                 </div>
                 <div className="text-center border-r border-gray-200">
                     <div className="text-3xl font-bold text-fb-blue mb-1">₱{sentAmount.toLocaleString()}</div>
                     <div className="text-sm text-gray-500 font-medium">Sent</div>
                 </div>
                 <div className="text-center">
                     <div className="text-3xl font-bold text-fb-green mb-1">₱{acceptedAmount.toLocaleString()}</div>
                     <div className="text-sm text-gray-500 font-medium">Accepted</div>
                 </div>
            </div>

            {/* List Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-fb-slate">All Estimates</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Estimates" 
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-fb-blue w-64 focus:ring-1 focus:ring-fb-blue"
                        />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-normal text-gray-500">Date</th>
                                <th className="p-4 font-normal text-gray-500">Estimate Number</th>
                                <th className="p-4 font-normal text-gray-500">Client</th>
                                <th className="p-4 font-normal text-gray-500 text-right">Amount</th>
                                <th className="p-4 font-normal text-gray-500 text-right">Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {estimates.map((est) => (
                                <tr 
                                    key={est.id}
                                    onClick={() => navigate(`/estimates/${est.id}`)}
                                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors group"
                                >
                                    <td className="p-4 text-gray-600">{est.date}</td>
                                    <td className="p-4 text-fb-blue font-medium hover:underline">{est.number}</td>
                                    <td className="p-4 font-bold text-fb-slate">{est.client}</td>
                                    <td className="p-4 text-right font-bold text-fb-slate">₱{est.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    <td className="p-4 text-right">
                                        <span className={`font-bold text-xs uppercase ${est.status === 'Accepted' ? 'text-fb-green' : 'text-gray-500'}`}>
                                            {est.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {est.status !== 'Accepted' && (
                                            <button 
                                                onClick={(e) => convertToInvoice(e, est)}
                                                className="opacity-0 group-hover:opacity-100 text-xs bg-fb-blue text-white px-3 py-1 rounded font-bold hover:bg-fb-darkBlue transition-all flex items-center"
                                            >
                                                Convert <ArrowRight size={10} className="ml-1" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {estimates.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No estimates found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}