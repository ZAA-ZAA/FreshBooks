// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Filter, MoreHorizontal, Pencil, Archive, Trash2, Mail, Phone, Plus } from 'lucide-react';

export default function ClientsList() {
    const navigate = useNavigate();
    const [clients, setClients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const storedClients = localStorage.getItem('fb_clients');
        if (storedClients) setClients(JSON.parse(storedClients));
    }, []);

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20">
            <div className="flex justify-between items-end mb-10">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Clients</h1>
                <div className="flex items-center gap-6">
                    <button className="text-[15px] font-bold text-[#556d82] hover:text-fb-blue">Import Clients</button>
                    <button 
                        onClick={() => navigate('/clients/new')}
                        className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-2.5 rounded font-bold text-lg shadow-md transition-all"
                    >
                        New Client
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-fb-blue outline-none transition-all w-64" 
                                placeholder="Search by name or company" 
                            />
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-600 bg-white">
                            <Filter size={12} /> Filter
                        </button>
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="p-4">Client Identity</th>
                            <th className="p-4">Contact Info</th>
                            <th className="p-4 text-right">Balance</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredClients.map(client => (
                            <tr key={client.id} className="hover:bg-fb-gray cursor-pointer group" onClick={() => navigate(`/clients/${client.id}`)}>
                                <td className="p-4">
                                    <div className="font-bold text-fb-navy">{client.company}</div>
                                    <div className="text-xs text-gray-400">{client.name}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-xs text-gray-500">{client.email}</div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="font-bold text-fb-navy">₱{(client.balance || 0).toLocaleString()}</div>
                                </td>
                                <td className="p-4 text-right">
                                    <MoreHorizontal size={18} className="text-gray-300" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
