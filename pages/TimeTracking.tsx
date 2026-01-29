// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Play, Calendar, Clock, Square, CheckCircle2, 
    ChevronDown, Plus, Search, Filter, MoreHorizontal, 
    Trash2, Pencil, Timer, TimerReset, Zap, X, ChevronLeft, ChevronRight,
    FileText, Calculator, Users
} from 'lucide-react';

export default function TimeTracking() {
    const navigate = useNavigate();
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [activeTab, setActiveTab] = useState('Day');

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 font-sans">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl font-bold text-[#2d3a4b]">Time Tracking</h1>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[15px] font-bold text-[#556d82] hover:text-[#0075dd] cursor-pointer">
                        More Actions <ChevronDown size={20} className="text-gray-300" />
                    </div>
                    <button 
                        className="bg-[#00a651] hover:bg-[#008541] text-white px-8 py-2.5 rounded font-black text-lg shadow-md transition-all active:scale-95"
                    >
                        Generate Invoice
                    </button>
                </div>
            </div>

            {/* Nav Tabs */}
            <div className="flex justify-center">
                <div className="flex bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                    {['Day', 'Week', 'Month', 'All'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-10 py-1.5 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-[#0075dd] text-white shadow-md' : 'text-gray-500 hover:text-[#0075dd]'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Onboarding Banner */}
            {showOnboarding && (
                <div className="bg-white border border-gray-200 rounded-lg p-10 relative shadow-sm animate-in zoom-in-95 duration-500 overflow-hidden">
                    <button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-[#0075dd] text-center mb-12 tracking-tight">Track Time and Never Lose Another Billable Minute</h2>
                    <div className="grid grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-6 border border-[#e0f2fe] relative">
                                <div className="w-12 h-12 bg-[#0075dd] rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Clock size={24} />
                                </div>
                                <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full border border-gray-100 flex items-center justify-center text-[#0075dd] shadow-sm">
                                    <span className="text-[10px] font-black">$</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Get Paid for All Your Time</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">You can track time with the timer, or by logging time manually. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn More</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-gray-100 px-10">
                            <div className="w-20 h-20 bg-[#fff9f1] rounded-full flex items-center justify-center mb-6 border border-[#fff2e0]">
                                <div className="w-12 h-12 bg-[#f9c80e] rounded-lg flex items-center justify-center text-white shadow-sm relative">
                                    <FileText size={24} />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-400 rounded-full border border-white flex items-center justify-center text-white shadow-sm">
                                         <Clock size={10} />
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Convert Time into Invoices</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Accurately bill your clients for the time you've worked. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn More</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#fdf2f2] rounded-full flex items-center justify-center mb-6 border border-[#fee2e2] relative">
                                <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center text-white shadow-sm gap-0.5">
                                    <div className="flex flex-col gap-0.5">
                                        <Clock size={8} />
                                        <Clock size={8} />
                                    </div>
                                    <Clock size={12} />
                                </div>
                            </div>
                            <h3 className="font-bold text-[#2d3a4b] text-sm mb-1 uppercase tracking-tight">Track Everything for Everyone</h3>
                            <p className="text-xs text-gray-500 px-4 leading-relaxed">Don't miss a billable moment by staying on top of billable hours. <span className="text-[#0075dd] cursor-pointer hover:underline font-bold">Learn More</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar Strip Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-6">
                        <div className="flex gap-4">
                            <ChevronLeft className="text-gray-400 cursor-pointer hover:text-[#002a63]" size={20} />
                            <ChevronRight className="text-gray-400 cursor-pointer hover:text-[#002a63]" size={20} />
                        </div>
                        <div className="flex items-center gap-2 font-bold text-gray-500">
                             Thu, Jan 29th <Calendar size={18} className="text-gray-300" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400">Hours Logged By</span>
                        <div className="flex items-center gap-1 border border-gray-300 rounded px-4 py-1.5 bg-white cursor-pointer min-w-[200px] justify-between">
                            <span className="text-sm font-bold text-[#2d3a4b]">John Doe</span>
                            <ChevronDown size={18} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/20">
                         {[
                             { day: 'Mon', num: '26', hours: '-' },
                             { day: 'Tue', num: '27', hours: '-' },
                             { day: 'Wed', num: '28', hours: '10:00' },
                             { day: 'Thu', num: '29', hours: '-', active: true },
                             { day: 'Fri', num: '30', hours: '-' },
                             { day: 'Sat', num: '31', hours: '-' },
                             { day: 'Sun', num: '1', hours: '-' },
                         ].map(d => (
                            <div key={d.day} className={`p-4 border-r border-gray-100 last:border-0 flex flex-col items-center ${d.active ? 'bg-blue-50/50 relative' : ''}`}>
                                {d.active && <div className="absolute top-0 left-0 right-0 h-1 bg-[#0075dd]"></div>}
                                <div className="flex items-center gap-1 mb-2">
                                    <span className="text-xs font-black text-[#556d82] uppercase">{d.day}</span>
                                    <span className={`text-xs font-black px-1.5 py-0.5 rounded ${d.active ? 'bg-[#0075dd] text-white' : 'text-gray-400'}`}>{d.num}</span>
                                </div>
                                <div className="text-xs text-gray-400 font-bold">{d.hours}</div>
                            </div>
                         ))}
                    </div>
                    <div className="p-4 flex justify-end bg-gray-50/50">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-4">Total: 10:00</span>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-white border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <tr>
                                <th className="p-4">Team Member / Date <ChevronDown size={10} className="inline ml-1" /></th>
                                <th className="p-4">Client / Project / Service / Note</th>
                                <th className="p-4 text-right">Time / Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             <tr>
                                <td colSpan={3} className="p-4">
                                     <div className="flex items-center gap-4">
                                         <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg p-2 text-center text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer">
                                             <Plus size={16} className="text-[#00a651]" /> New Entry
                                         </div>
                                         <button className="flex items-center gap-2 px-8 py-2 border-2 border-[#17a2b8] text-[#17a2b8] rounded font-black text-sm hover:bg-[#17a2b8]/5">
                                             <Play size={14} className="fill-current" /> Start Timer
                                         </button>
                                     </div>
                                </td>
                             </tr>
                        </tbody>
                        <tfoot className="bg-gray-50/30">
                             <tr>
                                <td colSpan={3} className="p-6">
                                     <div className="flex justify-end">
                                         <div className="text-right">
                                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Daily Total:</span>
                                             <span className="text-xs font-black text-[#2d3a4b]">0:00</span>
                                         </div>
                                     </div>
                                </td>
                             </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
