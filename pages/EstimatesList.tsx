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
    const [activeToggle, setActiveToggle] = useState('From Me');
    const [createNewOpen, setCreateNewOpen] = useState(false);
    const createNewRef = useRef(null);

    useEffect(() => {
        const stored = localStorage.getItem('fb_estimates');
        if (stored) {
            setEstimates(JSON.parse(stored));
        } else {
            const initial = [
                { id: 'est2', number: '0000002', client: 'ABC INC.', date: '2026-01-29', amount: 0, status: 'Draft', description: 'Proposal' },
                { id: 'est1', number: '0000001', client: 'ABC INC.', date: '2026-01-29', amount: 0, status: 'Draft', description: '' }
            ];
            setEstimates(initial);
            localStorage.setItem('fb_estimates', JSON.stringify(initial));
        }

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

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-20 font-sans">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-bold text-[#2d3a4b]">Estimates and Proposals</h1>
                    {/* Toggle Switch */}
                    <div className="flex bg-white border border-gray-200 rounded-full p-1 w-fit shadow-sm">
                        <button 
                            onClick={() => setActiveToggle('From Me')}
                            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${activeToggle === 'From Me' ? 'bg-[#0075dd] text-white' : 'text-gray-500 hover:text-[#0075dd]'}`}
                        >
                            From Me
                        </button>
                        <button 
                            onClick={() => setActiveToggle('To Me')}
                            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${activeToggle === 'To Me' ? 'bg-[#0075dd] text-white' : 'text-gray-500 hover:text-[#0075dd]'}`}
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

            {/* Onboarding Banner */}
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
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Learn how Estimates and fast approvals get you paid. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn more</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-gray-100 px-10">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-6 border border-[#e0f2fe]">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg -rotate-3 flex items-center justify-center text-white shadow-sm">
                                    <RotateCcw size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">One-Click Invoices</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Easily turn Estimates into Invoices with just a single click. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn more</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 border border-pink-100">
                                <div className="w-12 h-12 bg-pink-400 rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Calculator size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1">Client-Winning Proposals</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Showcase your unique value to help win the work you deserve. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Create now</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recently Updated Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2d3a4b]">Recently Updated</h3>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-[#556d82] hover:text-[#0075dd]">
                        Remove <X size={14} className="mt-0.5" />
                    </button>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {/* Create New Card */}
                    <div 
                        onClick={() => navigate('/estimates/new')}
                        className="flex-none w-52 h-64 border-2 border-dashed border-gray-200 rounded-lg bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#0075dd] transition-all group"
                    >
                        <Plus size={32} className="text-[#00a651] mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[#002a63] text-sm">Create New ...</span>
                    </div>
                    {/* Recent Estimate Cards */}
                    {estimates.slice(0, 4).map(est => (
                        <div 
                            key={est.id}
                            onClick={() => navigate(`/estimates/${est.id}`)}
                            className="flex-none w-52 h-64 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col overflow-hidden group"
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-[10px] font-mono text-gray-400 mb-1">{est.number}</div>
                                <div className="font-bold text-[#2d3a4b] text-[13px] mb-1">{est.client}</div>
                                <div className="text-[10px] text-gray-400 mb-auto">{est.date}</div>
                                <div className="w-full h-[1px] bg-gray-100 my-4"></div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-[#2d3a4b]">₱{est.amount}</div>
                                </div>
                            </div>
                            <div className="bg-gray-100 py-2.5 text-center text-xs font-bold text-[#2d3a4b] uppercase tracking-wider group-hover:bg-[#0075dd] group-hover:text-white transition-colors">
                                {est.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* List and Tabs */}
            <div className="space-y-6 pt-10">
                <h3 className="text-xl font-bold text-[#2d3a4b]">All Estimates and Proposals</h3>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
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
                                    className="hover:bg-[#f0f9ff]/50 cursor-pointer group transition-colors"
                                    onClick={() => navigate(`/estimates/${est.id}`)}
                                >
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-[#0075dd] focus:ring-[#0075dd] w-4 h-4 cursor-pointer" 
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-[#2d3a4b] text-[13px]">{est.client}</div>
                                        <div className="text-xs text-gray-400 font-mono">{est.number}</div>
                                    </td>
                                    <td className="p-4">
                                        {est.description && (
                                            <span className="text-xs text-[#0075dd] font-medium hover:underline cursor-pointer">
                                                {est.description}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-xs text-gray-500">{est.date}</td>
                                    <td className="p-4 text-right">
                                        <div className="font-bold text-[#2d3a4b] text-[13px]">₱{est.amount.toFixed(2)}</div>
                                        <div className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-black uppercase inline-block mt-1 text-gray-500">{est.status}</div>
                                    </td>
                                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-white rounded border border-gray-100 text-gray-400 hover:text-[#0075dd] shadow-sm transition-all"><Pencil size={14} /></button>
                                            <button className="p-1.5 hover:bg-white rounded border border-gray-100 text-gray-400 hover:text-red-500 shadow-sm transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/20 text-xs font-bold text-gray-400">
                        <div>1-{filteredEstimates.length} of {filteredEstimates.length}</div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="text-[#0075dd] hover:underline cursor-pointer">View Archived Estimates and Proposals</span>
                                <span className="text-gray-300">or</span>
                                <span className="text-[#0075dd] hover:underline cursor-pointer">deleted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Items per page:</span>
                                <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer text-gray-600">
                                    30 <ChevronDown size={14} className="opacity-40" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const RotateCcw = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);
