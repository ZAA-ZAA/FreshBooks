// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, ChevronDown, X, Beaker, Users, 
    Zap, Calendar, Filter, MoreHorizontal, Pencil, Trash2
} from 'lucide-react';

export default function ProjectsList() {
    const navigate = useNavigate();
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 font-sans">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Projects</h1>
                <div className="flex items-center gap-4">
                    <div className="relative group mr-4 hidden md:block">
                        <div className="absolute -left-28 -top-8 pointer-events-none">
                            <div className="text-[#0075dd] font-handwriting text-lg leading-none transform -rotate-6">Create your first project</div>
                            <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="text-[#0075dd] ml-16 mt-1">
                                <path d="M5 5C5 5 15 25 35 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M30 20L35 25L30 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex">
                        <button 
                            className="bg-[#00a651] hover:bg-[#008541] text-white px-8 py-2.5 rounded-l font-black text-lg shadow-md transition-all active:scale-95"
                        >
                            Create New ...
                        </button>
                        <button className="bg-[#00a651] hover:bg-[#008541] text-white px-3 py-2.5 rounded-r border-l border-white/20 shadow-md">
                            <ChevronDown size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Onboarding Banner */}
            {showOnboarding && (
                <div className="bg-white border border-gray-200 rounded-lg p-10 relative shadow-sm animate-in zoom-in-95 duration-500 overflow-hidden">
                    <button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-[#0075dd] text-center mb-12 tracking-tight">Scope Projects, Track Time and Get Paid Accurately</h2>
                    <div className="grid grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f1fcf1] rounded-full flex items-center justify-center mb-6 border border-[#e0f5e0]">
                                <div className="w-12 h-12 bg-[#5cb85c] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Beaker size={24} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Get Started with Projects</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Set the budget for the project and track time against it. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">How It Works</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-gray-100 px-10">
                            <div className="w-20 h-20 bg-[#fff9f1] rounded-full flex items-center justify-center mb-6 border border-[#fff2e0]">
                                <div className="w-12 h-12 bg-[#f9c80e] rounded-full flex items-center justify-center text-white shadow-sm overflow-hidden border-2 border-white">
                                     <Users size={20} className="text-[#002a63]" />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Assign a Project Manager</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Bring your team on board and choose who's responsible for keeping an eye on project progress. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn More</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-6 border border-[#e0f2fe] relative">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Beaker size={24} />
                                </div>
                                <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full border border-gray-100 flex items-center justify-center text-[#0075dd] shadow-sm">
                                    <span className="text-[10px] font-black">$</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Easily Bill Your Client</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Create invoices in a few clicks to bill your client for time and expenses <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Create Invoices from Projects</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* List and Actions */}
            <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-[#2d3a4b]">All Projects</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-10 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0075dd] outline-none transition-all w-64 bg-white" 
                                placeholder="Search" 
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 border-l border-gray-200">
                                <Calendar size={14} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Table Placeholder (Matching Screenshot empty style) */}
                <div className="space-y-8 pt-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-10 opacity-10">
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-400 rounded-full w-3/4"></div>
                                <div className="h-3 bg-gray-300 rounded-full w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-400 rounded-full w-3/4"></div>
                                <div className="h-3 bg-gray-300 rounded-full w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-400 rounded-full w-3/4"></div>
                                <div className="h-3 bg-gray-300 rounded-full w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
