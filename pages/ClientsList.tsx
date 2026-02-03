// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, ChevronDown, Filter, MoreHorizontal, Pencil, Archive, 
    Trash2, Mail, Phone, Plus, X, UserPlus, Info, CheckCircle2,
    Users, DollarSign, List, History, ChevronRight, AlertCircle, Loader2
} from 'lucide-react';
import { clientsApi, ClientData } from '../api';

const StatBox = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col items-center flex-1">
        <div className="text-4xl font-black text-[#0075dd] mb-2">₱{value}</div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</div>
    </div>
);

export default function ClientsList() {
    const navigate = useNavigate();
    const [clients, setClients] = useState<ClientData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const moreActionsRef = useRef(null);

    const TOAST_DURATION_MS = 4000;

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    };

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), TOAST_DURATION_MS);
        return () => clearTimeout(t);
    }, [toast]);

    const refreshData = async () => {
        setIsLoading(true);
        const response = await clientsApi.getAll();
        if (response.success && response.data) {
            setClients(response.data);
        } else {
            showNotification(response.error || 'Failed to load clients', 'error');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const filteredClients = clients.filter(c => 
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.company || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredClients.length) setSelectedIds([]);
        else setSelectedIds(filteredClients.map(c => c.id!));
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this client? All associated records will be detached.')) {
            const response = await clientsApi.delete(id);
            if (response.success) {
                setClients(clients.filter(c => c.id !== id));
                setSelectedIds(prev => prev.filter(i => i !== id));
                showNotification('Client successfully removed.');
            } else {
                showNotification(response.error || 'Failed to delete client', 'error');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected clients?`)) {
            let successCount = 0;
            for (const id of selectedIds) {
                const response = await clientsApi.delete(id);
                if (response.success) successCount++;
            }
            await refreshData();
            showNotification(`${successCount} clients removed.`);
            setSelectedIds([]);
        }
    };

    const totalOutstanding = clients.reduce((acc, curr) => acc + (curr.balance || 0), 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#0075dd]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 font-sans relative">
            {toast && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-black/10 ${toast.type === 'error' ? 'bg-red-500 text-white ring-red-600/30' : 'bg-fb-slate text-white ring-fb-green/30'}`}>
                    {toast.type === 'error' ? <AlertCircle size={22} /> : <CheckCircle2 className="text-fb-green" size={22} />}
                    <span className="font-bold text-sm">{toast.message}</span>
                </div>
            )}

            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Clients</h1>
                <button 
                    onClick={() => navigate('/clients/new')}
                    className="bg-[#00a651] hover:bg-[#008541] text-white px-8 py-2.5 rounded font-black text-lg shadow-md transition-all active:scale-95"
                >
                    New Client
                </button>
            </div>

            <div className="flex items-center justify-center py-10 px-4">
                 <StatBox label="overdue" value="0" />
                 <div className="h-10 w-[1px] bg-gray-100"></div>
                 <StatBox label="total outstanding" value={totalOutstanding.toLocaleString()} />
                 <div className="h-10 w-[1px] bg-gray-100"></div>
                 <StatBox label="in draft" value="0" />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {selectedIds.length > 0 && (
                    <div className="bg-[#f0f9ff] px-6 py-3 border-b border-blue-100 flex items-center gap-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-1 text-[#0075dd] font-black text-xl">
                            <span>Selected</span>
                            <span className="ml-2 bg-[#0075dd] text-white text-xs px-2 py-0.5 rounded-full">{selectedIds.length}</span>
                        </div>
                        <button onClick={handleBulkDelete} className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded font-bold text-xs hover:bg-red-100 transition-colors">Delete</button>
                    </div>
                )}

                <div className="p-4 border-b border-gray-100 flex justify-end items-center bg-gray-50/20">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0075dd] outline-none w-64 bg-white" placeholder="Search" />
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="p-4 w-10">
                                <input type="checkbox" className="rounded border-gray-300 text-[#0075dd] w-4 h-4" checked={filteredClients.length > 0 && selectedIds.length === filteredClients.length} onChange={toggleSelectAll} />
                            </th>
                            <th className="p-4">Client Name / Primary Contact</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Total Outstanding</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredClients.map(client => (
                            <tr key={client.id} className={`hover:bg-[#f0f9ff]/50 cursor-pointer group transition-colors ${selectedIds.includes(client.id!) ? 'bg-[#f0f9ff]' : ''}`} onClick={() => navigate(`/clients/${client.id}`)}>
                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-gray-300 text-[#0075dd] w-4 h-4" checked={selectedIds.includes(client.id!)} onChange={() => toggleSelect(client.id!)} />
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-[#0075dd] text-[13px]">{client.company}</div>
                                    <div className="text-xs text-gray-400">{client.name}</div>
                                </td>
                                <td className="p-4">
                                    <span className="text-[10px] font-bold uppercase text-gray-400 px-2 py-1 bg-gray-50 rounded border border-gray-100">Active</span>
                                </td>
                                <td className="p-4 text-right font-black text-fb-navy">
                                    ₱{(client.balance || 0).toLocaleString()}
                                </td>
                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                                        <button onClick={() => navigate(`/clients/${client.id}/edit`)} className="p-1.5 text-gray-400 hover:text-[#0075dd]"><Pencil size={14} /></button>
                                        <button onClick={(e) => handleDelete(client.id!, e)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredClients.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-16 text-center">
                                    <Users size={48} className="text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold">No clients found</p>
                                    <button onClick={() => navigate('/clients/new')} className="text-[#0075dd] font-bold text-sm mt-2 hover:underline">Add your first client</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
