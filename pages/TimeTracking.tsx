// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
    Play, Calendar, Clock, Square, CheckCircle2, 
    ChevronDown, Plus, Search, Filter, MoreHorizontal, 
    Trash2, Pencil, Timer, TimerReset, Zap
} from 'lucide-react';

export default function TimeTracking() {
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [entries, setEntries] = useState<any[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [taskName, setTaskName] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('fb_time_entries');
        if (stored) setEntries(JSON.parse(stored));
    }, []);

    useEffect(() => {
        let interval: any;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    
    const handleToggleTimer = () => {
        if (isRunning) {
            const newEntry = {
                id: Date.now(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                task: taskName || 'Development & Consulting',
                client: 'General Business',
                duration: formatTime(seconds),
                durationSec: seconds
            };
            const updated = [newEntry, ...entries];
            setEntries(updated);
            localStorage.setItem('fb_time_entries', JSON.stringify(updated));
            setSeconds(0);
            setTaskName('');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
        setIsRunning(!isRunning);
    };

    const totalSecondsLogged = entries.reduce((acc, curr) => acc + (curr.durationSec || 0), 0);

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 relative">
            {showToast && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-[#28303f] text-white px-8 py-3 rounded-xl shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={24} />
                    <span className="font-bold">Entry Logged</span>
                </div>
            )}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-fb-navy tracking-tighter">Time Tracking</h1>
                    <p className="text-gray-400 font-bold mt-2">Log every billable minute with precision</p>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-fb-navy font-black text-lg hover:underline transition-all">Download Extension</button>
                    <button className="bg-fb-navy hover:bg-fb-slate text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 flex items-center gap-3">
                         Review History <ChevronDown size={20} />
                    </button>
                </div>
            </div>

            {/* Floating Timer Console */}
            <div className="bg-white border-4 border-fb-blue rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="flex-1 w-full">
                        <label className="text-[10px] font-black text-fb-blue uppercase tracking-[0.2em] mb-3 block">What are you working on?</label>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-fb-blue transition-transform group-hover:scale-110">
                                <Zap size={24} />
                            </div>
                            <input 
                                value={taskName}
                                onChange={e => setTaskName(e.target.value)}
                                placeholder="Enter project or task name..." 
                                className="text-2xl font-black text-fb-navy border-none p-0 outline-none w-full placeholder:text-gray-200"
                            />
                        </div>
                    </div>
                    <div className="h-20 w-[2px] bg-gray-100 hidden md:block"></div>
                    <div className="text-center px-8">
                        <div className={`text-5xl font-mono font-black tracking-tighter ${isRunning ? 'text-fb-blue' : 'text-gray-300'}`}>
                            {formatTime(isRunning ? seconds : 0)}
                        </div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Duration</div>
                    </div>
                    <button 
                        onClick={handleToggleTimer}
                        className={`${isRunning ? 'bg-red-500 shadow-red-200' : 'bg-fb-green shadow-fb-green/20'} text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-90`}
                    >
                        {isRunning ? <Square className="fill-current" size={32} /> : <Play className="fill-current ml-1" size={40} />}
                    </button>
                </div>
                <div className="absolute top-1/2 right-40 -translate-y-1/2 pointer-events-none opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <TimerReset size={180} />
                </div>
            </div>

            {/* Quick Stats Shelf */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-fb-gray border border-gray-100 rounded-3xl p-8 hover:shadow-lg transition-all border-b-8 border-b-fb-blue">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Daily Velocity</h4>
                    <div className="text-3xl font-black text-fb-navy">0h 00m</div>
                    <div className="mt-2 text-xs font-bold text-fb-blue bg-blue-50 w-fit px-3 py-1 rounded-full">Today's Total</div>
                </div>
                <div className="bg-fb-gray border border-gray-100 rounded-3xl p-8 hover:shadow-lg transition-all border-b-8 border-b-fb-green">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Aggregate Logged</h4>
                    <div className="text-3xl font-black text-fb-navy">{formatTime(totalSecondsLogged)}</div>
                    <div className="mt-2 text-xs font-bold text-fb-green bg-fb-green/10 w-fit px-3 py-1 rounded-full">Historical All-time</div>
                </div>
                <div className="bg-fb-gray border border-gray-100 rounded-3xl p-8 hover:shadow-lg transition-all border-b-8 border-b-fb-yellow">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Pending Accruals</h4>
                    <div className="text-3xl font-black text-fb-navy">₱0.00</div>
                    <div className="mt-2 text-xs font-bold text-fb-yellow bg-amber-50 w-fit px-3 py-1 rounded-full">Unbilled Value</div>
                </div>
            </div>

            {/* Entries List */}
            <div className="pt-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-fb-navy tracking-tight">Recent Ledger</h2>
                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue" size={18} />
                            <input className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm font-bold w-64 focus:ring-4 focus:ring-fb-blue/5 outline-none" placeholder="Search tasks..." />
                        </div>
                        <button className="p-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-fb-gray transition-colors">
                            <Filter size={18} className="text-fb-navy" />
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-fb-blue">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                            <tr>
                                <th className="p-8">Work Description / Details</th>
                                <th className="p-8">Timeline</th>
                                <th className="p-8 text-right">Elapsed</th>
                                <th className="p-8 w-32"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isRunning && (
                                <tr className="bg-green-50/50 animate-pulse">
                                    <td className="p-8">
                                        <div className="font-black text-fb-navy text-lg">{taskName || 'Timer Running...'}</div>
                                        <div className="text-[10px] font-black text-fb-green uppercase tracking-widest mt-1">Active Now</div>
                                    </td>
                                    <td className="p-8">
                                        <div className="font-bold text-fb-navy text-sm uppercase">Current Session</div>
                                    </td>
                                    <td className="p-8 text-right font-mono font-black text-fb-navy text-xl">
                                        {formatTime(seconds)}
                                    </td>
                                    <td className="p-8"></td>
                                </tr>
                            )}
                            {entries.map(entry => (
                                <tr key={entry.id} className="hover:bg-fb-gray transition-all group cursor-default">
                                    <td className="p-8">
                                        <div className="font-black text-fb-navy group-hover:text-fb-blue text-lg leading-tight mb-1">{entry.task}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{entry.client}</div>
                                    </td>
                                    <td className="p-8">
                                        <div className="font-black text-fb-navy text-xs uppercase mb-1">{entry.date}</div>
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Entry Verified</div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="font-mono font-black text-fb-navy text-xl">{entry.duration}</div>
                                        <div className="text-[9px] font-black text-fb-green uppercase tracking-widest mt-1">Logged</div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-x-2">
                                            <button className="w-10 h-10 bg-fb-blue/5 text-fb-blue rounded-xl flex items-center justify-center hover:bg-fb-blue hover:text-white transition-all shadow-sm"><Pencil size={18} /></button>
                                            <button onClick={() => {
                                                if(window.confirm('Delete entry?')) {
                                                    const updated = entries.filter(e => e.id !== entry.id);
                                                    setEntries(updated);
                                                    localStorage.setItem('fb_time_entries', JSON.stringify(updated));
                                                }
                                            }} className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {entries.length === 0 && !isRunning && (
                        <div className="p-32 text-center bg-gray-50/30">
                            <div className="flex flex-col items-center">
                                <Timer size={64} className="text-gray-100 mb-6" />
                                <p className="text-gray-400 font-black text-2xl italic tracking-tight">No billable hours logged yet</p>
                                <button onClick={() => setIsRunning(true)} className="bg-fb-blue text-white px-8 py-3 rounded-xl font-black mt-6 shadow-xl active:scale-95 transition-all">Start Your First Timer</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}