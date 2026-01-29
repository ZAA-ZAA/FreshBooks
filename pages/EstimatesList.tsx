// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, ChevronDown, X, Plus, Filter, MoreHorizontal,
    Pencil, Archive, Trash2, ChevronRight, Calculator, FileCheck, 
    Copy, Send, FileText, CheckCircle2
} from 'lucide-react';

export default function EstimatesList() {
    const navigate = useNavigate();
    const [estimates, setEstimates] = useState<any[]>([]);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeToggle, setActiveToggle] = useState('From Me');
    const [createNewOpen, setCreateNewOpen] = useState(false);
    const createNewRef = useRef(null);

    const refreshData = () => {
        const stored = localStorage.getItem('fb_estimates');
        if (stored) {
            setEstimates(JSON.parse(stored));
        }
    };

    useEffect(() => {
        refreshData();
        const handleClickOutside = (event: MouseEvent) => {
            if (createNewRef.current && !createNewRef.current.contains(event.target)) {
                setCreateNewOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredEstimates = estimates.filter(est => 
        est.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        est.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredEstimates.length) setSelectedIds([]);
        else setSelectedIds(filteredEstimates.map(est => est.id));
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this estimate?')) {
            const updated = estimates.filter(est => est.id !== id);
            setEstimates(updated);
            localStorage.setItem('fb_estimates', JSON.stringify(updated));
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected estimates?`)) {
            const updated = estimates.filter(est => !selectedIds.includes(est.id));
            localStorage.setItem('fb_estimates', JSON.stringify(updated));
            setEstimates(updated);
            setSelectedIds([]);
        }
    };

    const handleConvertToInvoice = (est: any, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Convert estimate ${est.number} to a new invoice?`)) {
            const invoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
            const newInvoice = {
                ...est,
                id: Date.now().toString(),
                number: (invoices.length + 1).toString().padStart(7, '0'),
                status: 'Draft',
                date: new Date().toISOString().split('T')[0]
            };
            localStorage.setItem('fb_invoices', JSON.stringify([newInvoice, ...invoices]));
            
            // Mark estimate as converted
            const updatedEstimates = estimates.map(e => e.id === est.id ? { ...e, status: 'Invoiced' } : e);
            localStorage.setItem('fb_estimates', JSON.stringify(updatedEstimates));
            setEstimates(updatedEstimates);

            alert('Invoice created successfully!');
            navigate('/invoices');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-20 font-sans">
            <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-bold text-[#2d3a4b]">Estimates and Proposals</h1>
                    <div className="flex bg-white border border-gray-200 rounded-full p-1 w-fit shadow-sm">
                        <button 
                            onClick={() => setActiveToggle('From Me')}
                            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${activeToggle === 'From Me' ? 'bg-[#0075dd] text-white shadow-md' : 'text-gray-500 hover:text-[#0075dd]'}`}
                        >
                            From Me
                        </button>
                        <button 
                            onClick={() => setActiveToggle('To Me')}
                            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${activeToggle === 'To Me' ? 'bg-[#0075dd] text-white shadow-md' : 'text-gray-500 hover:text-[#0075dd]'}`}
                        >
                            To Me
                        </button>
                    </div>
                </div>
                <div className="relative" ref={createNewRef}>
                    <button 
                        onClick={() => setCreateNewOpen(!createNewOpen)}
                        className="bg-[#00a651] hover:bg-[#008541] text-white px-8 py-2.5 rounded font-black text-lg flex items-center shadow-md transition-all"
                    >
                        Create New... <ChevronDown size={22} className={`ml-2 transition-transform ${createNewOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {createNewOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded shadow-xl z-[100] py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div onClick={() => navigate('/estimates/new')} className="px-4 py-2 hover:bg-gray-50 text-sm font-bold text-[#002a63] cursor-pointer">New Estimate</div>
                            <div onClick={() => navigate('/estimates/new?type=proposal')} className="px-4 py-2 hover:bg-gray-50 text-sm font-bold text-[#002a63] cursor-pointer">New Proposal</div>
                        </div>
                    )}
                </div>
            </div>

            {showOnboarding && (
                <div className="bg-white border border-gray-200 rounded-lg p-10 relative shadow-sm animate-in zoom-in-95 duration-500 overflow-hidden">
                    <button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-[#0075dd] text-center mb-12 tracking-tight">Professional Estimates and Proposals that Streamline Your Invoicing</h2>
                    <div className="grid grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#fff9f1] rounded-full flex items-center justify-center mb-6 border border-[#fff2e0]">
                                <div className="w-12 h-12 bg-[#f9c80e] rounded-lg rotate-3 flex items-center justify-center text-white font-black text-xl shadow-sm">
                                    <FileText size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Get Going with Estimates</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Learn how Estimates and fast approvals get you paid.</p>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-gray-100 px-10">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-6 border border-[#e0f2fe]">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg -rotate-3 flex items-center justify-center text-white shadow-sm">
                                    <Calculator size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">One-Click Invoices</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Easily turn Estimates into Invoices with just a single click.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 border border-pink-100">
                                <div className="w-12 h-12 bg-pink-400 rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <FileCheck size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Winning Proposals</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Showcase your unique value to help win the work you deserve.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {selectedIds.length > 0 && (
                    <div className="bg-[#f0f9ff] px-6 py-3 border-b border-blue-100 flex items-center gap-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-1 text-[#0075dd] font-black text-xl">
                            <span>Selected</span>
                            <span className="ml-2 bg-[#0075dd] text-white text-xs px-2 py-0.5 rounded-full">{selectedIds.length}</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleBulkDelete}
                                className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded font-bold text-xs hover:bg-red-100"
                            >
                                Delete selected
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
                                className="pl-10 pr-4 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0075dd] outline-none transition-all w-72 bg-white" 
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
                                    checked={filteredEstimates.length > 0 && selectedIds.length === filteredEstimates.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="p-4">Client / Number</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Date <ChevronDown size={10} className="inline ml-1" /></th>
                            <th className="p-4 text-right">Amount / Status</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredEstimates.map(est => (
                            <tr 
                                key={est.id} 
                                className={`hover:bg-[#f0f9ff]/50 cursor-pointer group transition-colors ${selectedIds.includes(est.id) ? 'bg-[#f0f9ff]' : ''}`}
                                onClick={() => navigate(`/estimates/${est.id}`)}
                            >
                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-[#0075dd] focus:ring-[#0075dd] w-4 h-4 cursor-pointer" 
                                        checked={selectedIds.includes(est.id)}
                                        onChange={() => toggleSelect(est.id)}
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-[#2d3a4b] text-[13px]">{est.client}</div>
                                    <div className="text-xs text-gray-400 font-mono">{est.number}</div>
                                </td>
                                <td className="p-4">
                                    <span className="text-xs text-[#0075dd] font-medium hover:underline cursor-pointer">
                                        {est.description || 'No description'}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-gray-500">{est.date}</td>
                                <td className="p-4 text-right">
                                    <div className="font-bold text-[#2d3a4b] text-[13px]">₱{(est.amount || 0).toLocaleString()}</div>
                                    <div className={`bg-gray-100 px-2 py-0.5 rounded text-[10px] font-black uppercase inline-block mt-1 ${est.status === 'Invoiced' ? 'text-green-600 bg-green-50' : 'text-gray-500'}`}>{est.status}</div>
                                </td>
                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => navigate(`/estimates/${est.id}/edit`)} className="p-1.5 hover:bg-white rounded border border-gray-100 text-gray-400 hover:text-[#0075dd] shadow-sm transition-all" title="Edit"><Pencil size={14} /></button>
                                        <button onClick={(e) => handleConvertToInvoice(est, e)} className="p-1.5 hover:bg-white rounded border border-gray-100 text-gray-400 hover:text-green-500 shadow-sm transition-all" title="Convert to Invoice"><FileCheck size={14} /></button>
                                        <button onClick={(e) => handleDelete(est.id, e)} className="p-1.5 hover:bg-white rounded border border-gray-100 text-gray-400 hover:text-red-500 shadow-sm transition-all" title="Delete"><Trash2 size={14} /></button>
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
