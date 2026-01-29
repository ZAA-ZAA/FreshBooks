// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, ChevronDown, X, Play, Landmark, Settings, 
    Filter, MoreHorizontal, Pencil, Trash2, Copy, Paperclip,
    Home, Receipt, Info, CheckCircle2
} from 'lucide-react';

export default function ExpensesList() {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showOnboarding, setShowOnboarding] = useState(true);

    const refreshData = () => {
        const stored = localStorage.getItem('fb_expenses');
        if (stored) setExpenses(JSON.parse(stored));
    };

    useEffect(() => {
        refreshData();
    }, []);

    const filteredExpenses = expenses.filter(exp => 
        exp.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredExpenses.length) setSelectedIds([]);
        else setSelectedIds(filteredExpenses.map(exp => exp.id));
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this expense?')) {
            const updated = expenses.filter(exp => exp.id !== id);
            setExpenses(updated);
            localStorage.setItem('fb_expenses', JSON.stringify(updated));
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected expenses?`)) {
            const updated = expenses.filter(exp => !selectedIds.includes(exp.id));
            setExpenses(updated);
            localStorage.setItem('fb_expenses', JSON.stringify(updated));
            setSelectedIds([]);
        }
    };

    const totalAmount = filteredExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 font-sans">
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
                            <tr key={exp.id} className={`hover:bg-[#f0f9ff]/50 transition-colors group cursor-pointer ${selectedIds.includes(exp.id) ? 'bg-[#f0f9ff]' : ''}`} onClick={() => navigate(`/expenses/${exp.id}/edit`)}>
                                <td className="p-4" onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-gray-300 text-[#0075dd]" checked={selectedIds.includes(exp.id)} onChange={() => toggleSelect(exp.id)} />
                                </td>
                                <td className="p-4 border-l-4 border-l-[#5cb85c]">
                                    <div className="font-bold text-[#002a63] text-[13px]">{exp.merchant}</div>
                                    <div className="text-[11px] text-gray-400 font-bold uppercase">{exp.category}</div>
                                </td>
                                <td className="p-4 text-gray-600">{exp.date}</td>
                                <td className="p-4">
                                    <div className="text-[13px] font-bold text-[#0075dd]">{exp.client}</div>
                                    <div className="text-[11px] text-gray-400 italic line-clamp-1">{exp.description || 'No description'}</div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="font-bold text-[#2d3a4b]">₱{exp.amount.toLocaleString()}</div>
                                    <div className="bg-gray-100 text-gray-500 text-[10px] font-black uppercase px-2 py-0.5 rounded border mt-1 inline-block">{exp.status}</div>
                                </td>
                                <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => navigate(`/expenses/${exp.id}/edit`)} className="p-1.5 text-gray-400 hover:text-[#0075dd]"><Pencil size={14} /></button>
                                        <button onClick={(e) => handleDelete(exp.id, e)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
