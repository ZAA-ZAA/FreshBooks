// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, ChevronDown, X, Play, Landmark, Settings, 
    Filter, MoreHorizontal, Pencil, Trash2, Copy, Paperclip,
    Home, Receipt, Info, CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';
import { expensesApi, ExpenseData } from '../api';

export default function ExpensesList() {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState<ExpenseData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

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
        const response = await expensesApi.getAll();
        if (response.success && response.data) {
            setExpenses(response.data);
        } else {
            showNotification(response.error || 'Failed to load expenses', 'error');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const filteredExpenses = expenses.filter(exp => 
        (exp.merchant || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredExpenses.length) setSelectedIds([]);
        else setSelectedIds(filteredExpenses.map(exp => exp.id!));
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this expense?')) {
            const response = await expensesApi.delete(id);
            if (response.success) {
                setExpenses(expenses.filter(exp => exp.id !== id));
                setSelectedIds(prev => prev.filter(i => i !== id));
                showNotification('Expense deleted successfully');
            } else {
                showNotification(response.error || 'Failed to delete expense', 'error');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected expenses?`)) {
            let successCount = 0;
            for (const id of selectedIds) {
                const response = await expensesApi.delete(id);
                if (response.success) successCount++;
            }
            await refreshData();
            showNotification(`${successCount} expenses deleted`);
            setSelectedIds([]);
        }
    };

    const totalAmount = filteredExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#0075dd]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 font-sans">
            {toast && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-black/10 ${toast.type === 'error' ? 'bg-red-500 text-white ring-red-600/30' : 'bg-fb-slate text-white ring-fb-green/30'}`}>
                    {toast.type === 'error' ? <AlertCircle size={22} /> : <CheckCircle2 className="text-fb-green" size={22} />}
                    <span className="font-bold text-sm">{toast.message}</span>
                </div>
            )}

            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Expenses</h1>
                <button 
                    onClick={() => navigate('/expenses/new')}
                    className="bg-[#00a651] hover:bg-[#008541] text-white px-8 py-2.5 rounded font-black text-lg shadow-md transition-all active:scale-95"
                >
                    New Expense
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {selectedIds.length > 0 && (
                    <div className="bg-[#f0f9ff] px-6 py-3 border-b border-blue-100 flex items-center gap-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-1 text-[#0075dd] font-black text-xl">
                            <span>Selected</span>
                            <span className="ml-2 bg-[#0075dd] text-white text-xs px-2 py-0.5 rounded-full">{selectedIds.length}</span>
                        </div>
                        <button onClick={handleBulkDelete} className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded font-bold text-xs hover:bg-red-100">Delete selected</button>
                    </div>
                )}

                <div className="p-4 border-b border-gray-100 flex justify-end items-center bg-gray-50/20">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-1.5 border border-gray-300 rounded text-xs outline-none w-64 bg-white" 
                            placeholder="Search expenses..." 
                        />
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="p-4 w-10">
                                <input type="checkbox" className="rounded border-gray-300 text-[#0075dd]" checked={filteredExpenses.length > 0 && selectedIds.length === filteredExpenses.length} onChange={toggleSelectAll} />
                            </th>
                            <th className="p-4">Merchant / Category</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Client / Description</th>
                            <th className="p-4 text-right">Amount / Status</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredExpenses.map(exp => (
                            <tr key={exp.id} className={`hover:bg-[#f0f9ff]/50 transition-colors group cursor-pointer ${selectedIds.includes(exp.id!) ? 'bg-[#f0f9ff]' : ''}`} onClick={() => navigate(`/expenses/${exp.id}/edit`)}>
                                <td className="p-4" onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-gray-300 text-[#0075dd]" checked={selectedIds.includes(exp.id!)} onChange={() => toggleSelect(exp.id!)} />
                                </td>
                                <td className="p-4 border-l-4 border-l-[#5cb85c]">
                                    <div className="font-bold text-[#002a63] text-[13px]">{exp.merchant}</div>
                                    <div className="text-[11px] text-gray-400 font-bold uppercase">{exp.category}</div>
                                </td>
                                <td className="p-4 text-gray-600">{exp.date}</td>
                                <td className="p-4">
                                    <div className="text-[13px] font-bold text-[#0075dd]">{exp.client || 'Internal'}</div>
                                    <div className="text-[11px] text-gray-400 italic line-clamp-1">{exp.description || 'No description'}</div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="font-bold text-[#2d3a4b]">₱{(exp.amount || 0).toLocaleString()}</div>
                                    <div className="bg-gray-100 text-gray-500 text-[10px] font-black uppercase px-2 py-0.5 rounded border mt-1 inline-block">{exp.status}</div>
                                </td>
                                <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => navigate(`/expenses/${exp.id}/edit`)} className="p-1.5 text-gray-400 hover:text-[#0075dd]"><Pencil size={14} /></button>
                                        <button onClick={(e) => handleDelete(exp.id!, e)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-16 text-center">
                                    <Receipt size={48} className="text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold">No expenses found</p>
                                    <button onClick={() => navigate('/expenses/new')} className="text-[#0075dd] font-bold text-sm mt-2 hover:underline">Record your first expense</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
