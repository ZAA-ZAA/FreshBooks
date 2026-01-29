// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, ChevronDown, Filter, MoreHorizontal, Pencil, Archive, 
    Trash2, Mail, Phone, Plus, X, UserPlus, Info, CheckCircle2,
    Users, DollarSign, List, History
} from 'lucide-react';

const StatBox = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col items-center flex-1">
        <div className="text-4xl font-black text-[#0075dd] mb-2">₱{value}</div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</div>
    </div>
);

export default function ClientsList() {
    const navigate = useNavigate();
    const [clients, setClients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [moreActionsOpen, setMoreActionsOpen] = useState(false);
    const moreActionsRef = useRef(null);

    useEffect(() => {
        const storedClients = localStorage.getItem('fb_clients');
        if (storedClients) setClients(JSON.parse(storedClients));

        const handleClickOutside = (event: MouseEvent) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
                setMoreActionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredClients.length) setSelectedIds([]);
        else setSelectedIds(filteredClients.map(c => c.id));
    };

    const totalOutstanding = clients.reduce((acc, curr) => acc + (curr.balance || 0), 0);

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 font-sans">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Clients</h1>
                <div className="flex items-center gap-4">
                    <div className="relative" ref={moreActionsRef}>
                        <button 
                            onClick={() => setMoreActionsOpen(!moreActionsOpen)}
                            className="flex items-center gap-2 text-[15px] font-bold text-[#556d82] hover:text-[#0075dd] transition-colors"
                        >
                            More Actions <ChevronDown size={20} className={`transition-transform ${moreActionsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {moreActionsOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded shadow-xl z-[100] py-1">
                                <div className="px-4 py-2 hover:bg-gray-50 text-sm font-bold text-[#002a63] cursor-pointer">Import Clients</div>
                                <div className="px-4 py-2 hover:bg-gray-50 text-sm font-bold text-[#002a63] cursor-pointer">Export Clients</div>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => navigate('/clients/new')}
                        className="bg-[#00a651] hover:bg-[#008541] text-white px-8 py-2.5 rounded font-black text-lg shadow-md transition-all active:scale-95"
                    >
                        New Client
                    </button>
                </div>
            </div>

            {/* Onboarding Banner */}
            {showOnboarding && (
                <div className="bg-white border border-gray-200 rounded-lg p-10 relative shadow-sm animate-in zoom-in-95 duration-500 overflow-hidden">
                    <button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-[#0075dd] text-center mb-10 tracking-tight">Make Billing a Breeze with Client Info at Your Fingertips</h2>
                    <div className="grid grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f1fcf1] rounded-full flex items-center justify-center mb-4 border border-[#e0f5e0]">
                                <div className="w-12 h-12 bg-[#5cb85c] rounded-lg rotate-3 flex items-center justify-center text-white font-black text-xl shadow-sm">f</div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">It All Starts with Clients</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Get yourself up and running with organized clients. <span className="text-[#0075dd] cursor-pointer hover:underline">Learn more</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-gray-100">
                            <div className="w-20 h-20 bg-[#fff9f1] rounded-full flex items-center justify-center mb-4 border border-[#fff2e0]">
                                <div className="w-12 h-12 bg-[#f9c80e] rounded-lg -rotate-3 flex items-center justify-center text-white shadow-sm">
                                    <DollarSign size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Outstanding Client Revenue</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Know exactly where your client stands with any outstanding invoices. <span className="text-[#0075dd] cursor-pointer hover:underline">See how</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-4 border border-[#e0f2fe]">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Users size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Have Lots of Clients?</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Automatically import your clients from a .csv file. <span className="text-[#0075dd] cursor-pointer hover:underline">Import now</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats area */}
            <div className="flex items-center justify-center py-10 px-4">
                 <StatBox label="overdue" value="0" />
                 <div className="h-10 w-[1px] bg-gray-100"></div>
                 <StatBox label="total outstanding" value={totalOutstanding.toLocaleString()} />
                 <div className="h-10 w-[1px] bg-gray-100"></div>
                 <StatBox label="in draft" value="0" />
            </div>

            {/* Recently Active Shelf */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#2d3a4b]">Recently Active</h3>
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {/* New Client Card */}
                    <div 
                        onClick={() => navigate('/clients/new')}
                        className="flex-none w-64 h-48 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#0075dd] transition-all group"
                    >
                        <Plus size={32} className="text-[#00a651] mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[#002a63]">New Client</span>
                    </div>
                    {/* Client Cards */}
                    {clients.slice(0, 5).map(client => (
                        <div 
                            key={client.id}
                            onClick={() => navigate(`/clients/${client.id}`)}
                            className="flex-none w-64 h-48 bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md cursor-pointer transition-all border-t-4 border-t-purple-400 group"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center font-black text-[#002a63] text-lg uppercase">
                                    {client.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[#2d3a4b] truncate text-[13px]">{client.name}</div>
                                    <div className="text-xs text-gray-400 truncate">{client.company}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mb-4 truncate">
                                <Mail size={12} className="opacity-50" /> {client.email}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* List and Tabs */}
            <div className="space-y-4">
                <div className="flex items-center gap-10 border-b border-gray-100">
                    <button className="text-sm font-bold text-[#0075dd] border-b-4 border-[#0075dd] pb-3 transition-all px-4">Clients</button>
                    <button className="text-sm font-bold text-gray-400 hover:text-[#002a63] pb-3 transition-all px-4">Sent Emails</button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    {/* Selection Header */}
                    {selectedIds.length > 0 && (
                        <div className="bg-[#f0f9ff] px-6 py-3 border-b border-blue-100 flex items-center gap-6 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center gap-1 text-[#0075dd] font-black text-xl">
                                <span>Clients</span>
                                <ChevronRight size={20} />
                                <span>Selected</span>
                                <span className="ml-2 bg-[#0075dd] text-white text-xs px-2 py-0.5 rounded-full">{selectedIds.length}</span>
                            </div>
                            <div className="relative group">
                                <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 rounded font-bold text-xs text-[#002a63] hover:bg-gray-50">
                                    Bulk Actions <ChevronDown size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="p-4 border-b border-gray-100 flex justify-end items-center bg-gray-50/20">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0075dd] outline-none transition-all w-64 bg-white" 
                                    placeholder="Search" 
                                />
                            </div>
                            <button className="flex items-center gap-1 px-4 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-600 bg-white hover:bg-gray-50">
                                <Filter size={14} /> Advanced Search <ChevronDown size={14} className="ml-1 opacity-50" />
                            </button>
                        </div>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <tr>
                                <th className="p-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-[#0075dd] focus:ring-[#0075dd] w-4 h-4 cursor-pointer" 
                                        checked={filteredClients.length > 0 && selectedIds.length === filteredClients.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4">Client Name <ChevronDown size={10} className="inline ml-1" /> / Primary Contact</th>
                                <th className="p-4">Internal Note</th>
                                <th className="p-4 text-right">Credit</th>
                                <th className="p-4 text-right">Total Outstanding</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredClients.map(client => (
                                <tr 
                                    key={client.id} 
                                    className={`hover:bg-[#f0f9ff]/50 cursor-pointer group transition-colors ${selectedIds.includes(client.id) ? 'bg-[#f0f9ff]' : ''}`}
                                    onClick={() => navigate(`/clients/${client.id}`)}
                                >
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-[#0075dd] focus:ring-[#0075dd] w-4 h-4 cursor-pointer" 
                                            checked={selectedIds.includes(client.id)}
                                            onChange={() => toggleSelect(client.id)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-[#0075dd] text-[13px]">{client.company}</div>
                                        <div className="text-xs text-gray-400">{client.name}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs text-gray-300 italic">No notes</span>
                                    </td>
                                    <td className="p-4 text-right font-medium text-gray-400">₱0.00</td>
                                    <td className="p-4 text-right">
                                        <div className="font-bold text-[#2d3a4b] text-[13px]">Total Outstanding: ₱{(client.balance || 0).toLocaleString()}</div>
                                    </td>
                                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => navigate(`/clients/${client.id}/edit`)} className="p-1.5 hover:bg-white rounded border border-gray-100 text-gray-400 hover:text-[#0075dd] shadow-sm transition-all"><Pencil size={14} /></button>
                                            <button className="p-1.5 hover:bg-white rounded border border-gray-100 text-gray-400 hover:text-[#0075dd] shadow-sm transition-all"><Archive size={14} /></button>
                                            <button className="p-1.5 hover:bg-white rounded border border-gray-100 text-gray-400 hover:text-red-500 shadow-sm transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/20 text-xs font-bold text-gray-400">
                        <div>1-{filteredClients.length} of {filteredClients.length}</div>
                        <div className="flex items-center gap-2">
                            <span>Items per page:</span>
                            <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer">
                                30 <ChevronDown size={14} className="opacity-40" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
