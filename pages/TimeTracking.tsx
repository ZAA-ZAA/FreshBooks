import React, { useState, useEffect } from 'react';
import { Play, Calendar, Clock, Square, CheckCircle2 } from 'lucide-react';

export default function TimeTracking() {
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [entries, setEntries] = useState<any[]>([]);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('fb_time_entries');
        if (stored) {
            setEntries(JSON.parse(stored));
        }
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
            // Stop logic: Save entry
            const newEntry = {
                id: Date.now(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                task: 'Unbilled Time',
                client: 'General',
                duration: formatTime(seconds),
                durationSec: seconds
            };
            const updated = [newEntry, ...entries];
            setEntries(updated);
            localStorage.setItem('fb_time_entries', JSON.stringify(updated));
            setSeconds(0);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
        setIsRunning(!isRunning);
    };

    const totalSecondsLogged = entries.reduce((acc, curr) => acc + (curr.durationSec || 0), 0) + seconds;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Time Entry Logged Successfully</span>
                </div>
            )}

             {/* Top Action */}
             <div className="absolute top-[-50px] right-0 flex items-center space-x-4">
                 {isRunning && (
                     <div className="text-2xl font-mono text-fb-slate font-bold animate-pulse">
                         {formatTime(seconds)}
                     </div>
                 )}
                <button 
                    onClick={handleToggleTimer}
                    className={`${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-fb-green hover:bg-[#33c46b]'} text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors flex items-center min-w-[140px] justify-center`}
                >
                    {isRunning ? (
                        <><Square size={14} className="mr-2 fill-current" /> Stop Timer</>
                    ) : (
                        <><Play size={16} className="mr-2 fill-current" /> Start Timer</>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8 px-4 border-b border-gray-200 pb-8">
                 <div className="text-center border-r border-gray-200">
                     <div className="text-3xl font-bold text-fb-slate mb-1">
                         {formatTime(totalSecondsLogged)}
                     </div>
                     <div className="text-sm text-gray-500 font-medium">Total Logged</div>
                 </div>
                 <div className="text-center">
                     <div className="text-3xl font-bold text-fb-blue mb-1">₱0.00</div>
                     <div className="text-sm text-gray-500 font-medium">Unbilled Amount</div>
                 </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-fb-slate">Time Entries</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 border border-gray-300 rounded px-3 py-2 bg-white">
                        <Calendar size={16} className="text-gray-400" />
                        <span>All Entries</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded shadow-sm">
                    {/* Active Timer Row */}
                    {isRunning && (
                        <div className="p-4 flex items-center justify-between bg-green-50 animate-in fade-in duration-300 border-b border-gray-100">
                             <div className="flex items-center">
                                 <div className="w-2 h-2 rounded-full bg-fb-green mr-3 animate-pulse"></div>
                                 <span className="font-bold text-fb-slate italic">Timer Running...</span>
                             </div>
                             <div className="font-mono text-fb-slate">{formatTime(seconds)}</div>
                        </div>
                    )}
                    
                    {entries.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {entries.map((entry) => (
                                <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer group">
                                    <div>
                                        <div className="font-bold text-fb-slate group-hover:text-fb-blue">{entry.task}</div>
                                        <div className="text-sm text-gray-500">{entry.client} • {entry.date}</div>
                                    </div>
                                    <div className="font-bold text-fb-slate font-mono">{entry.duration}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !isRunning && (
                            <div className="p-12 text-center text-gray-500">
                                <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="font-medium">No time logged yet.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}