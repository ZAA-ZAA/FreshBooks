// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Mail, Shield, CheckCircle2, X, MoreHorizontal, Filter, ShieldCheck, UserCheck } from 'lucide-react';

export default function TeamList() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [team, setTeam] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('fb_team');
        if (stored) setTeam(JSON.parse(stored));
        else {
            const seeds = [
                { id: 't1', name: 'John Doe', email: 'john.doe@demo.com', role: 'Owner', status: 'Active' },
                { id: 't2', name: 'Sarah Accountant', email: 'sarah@ledger.pro', role: 'Accountant', status: 'Active' },
            ];
            setTeam(seeds);
            localStorage.setItem('fb_team', JSON.stringify(seeds));
        }
    }, []);

    const filteredTeam = team.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInvite = () => {
        const newMember = {
            id: Date.now().toString(),
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            role: 'Employee',
            status: 'Invited'
        };
        const updated = [newMember, ...team];
        setTeam(updated);
        localStorage.setItem('fb_team', JSON.stringify(updated));

        setIsInviteModalOpen(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setInviteEmail('');
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 relative">
             {/* Toast */}
             {showToast && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-[#28303f] text-white px-8 py-3 rounded-xl shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={24} />
                    <span className="font-bold">Credential Invitation Sent</span>
                </div>
            )}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-fb-navy tracking-tighter">My Team</h1>
                    <p className="text-gray-400 font-bold mt-2">Collaborate with employees, contractors, and accountants</p>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-fb-navy font-black text-lg hover:underline transition-all">Manage Permissions</button>
                    <button 
                        onClick={() => setIsInviteModalOpen(true)}
                        className="bg-fb-green hover:brightness-110 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-fb-green/20 transition-all active:scale-95"
                    >
                        Invite Team Member
                    </button>
                </div>
            </div>

            {/* Quick Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex items-center gap-5 border-l-8 border-l-fb-blue">
                     <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-fb-blue"><UserCheck size={28} /></div>
                     <div>
                        <div className="text-2xl font-black text-fb-navy">{team.length}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Staff</div>
                     </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex items-center gap-5 border-l-8 border-l-fb-green">
                     <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-fb-green"><ShieldCheck size={28} /></div>
                     <div>
                        <div className="text-2xl font-black text-fb-navy">{team.filter(m => m.status === 'Active').length}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Licenses</div>
                     </div>
                </div>
            </div>

            {/* Directory Section */}
            <div className="pt-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 h-16 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-fb-navy tracking-tight">Staff Directory</h2>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue transition-colors" size={20} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none w-full md:w-80 text-sm font-bold text-fb-navy shadow-sm transition-all" 
                                placeholder="Search by name or email..." 
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-fb-blue">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                            <tr>
                                <th className="p-8">Member Identity</th>
                                <th className="p-8">Access Level</th>
                                <th className="p-8">Connection Status</th>
                                <th className="p-8 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTeam.map((member) => (
                                <tr key={member.id} className="transition-all duration-300 group cursor-default hover:bg-fb-gray">
                                    <td className="p-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-fb-navy text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform uppercase">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-black text-fb-navy group-hover:text-fb-blue text-lg leading-tight mb-1">{member.name}</div>
                                                <div className="text-gray-400 font-bold text-xs flex items-center gap-2">
                                                    <Mail size={12} className="opacity-40" /> {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-fb-blue rounded-xl"><Shield size={16} /></div>
                                            <span className="font-black text-fb-navy uppercase tracking-widest text-[10px]">{member.role}</span>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        {member.status === 'Active' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-fb-green animate-pulse"></div>
                                                <span className="text-fb-green font-black text-[10px] uppercase tracking-widest">Connected Now</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                                <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Invitation Sent</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-8 text-right">
                                        <button className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-fb-navy hover:text-white transition-all shadow-sm">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-fb-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[600px] animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-14">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-fb-blue rounded-2xl flex items-center justify-center text-white">
                                        <UserPlus size={24} />
                                     </div>
                                     <h2 className="text-3xl font-black text-fb-navy">Invite Your Team</h2>
                                </div>
                                <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-300 hover:text-fb-navy transition-colors"><X size={32} /></button>
                            </div>
                            
                            <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-sm">
                                Collaborate with your accountant, employees, or contractors. They'll get their own unique secure login.
                            </p>

                            <div className="space-y-10">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Official Email Address</label>
                                    <input 
                                        autoFocus
                                        className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy text-2xl shadow-sm transition-all" 
                                        placeholder="colleague@business.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Assign Operational Role</label>
                                    <div className="relative">
                                        <select className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none bg-white font-black text-fb-navy shadow-sm appearance-none cursor-pointer">
                                            <option>Admin (Full Access)</option>
                                            <option>Manager (Billing & Staff)</option>
                                            <option>Employee (Time Tracking)</option>
                                            <option>Contractor (Projects Only)</option>
                                            <option>External Accountant</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-fb-blue">
                                            <Shield size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-10 mt-16 pt-10 border-t border-gray-50">
                                <button onClick={() => setIsInviteModalOpen(false)} className="font-black text-gray-400 hover:text-fb-navy transition-colors uppercase tracking-[0.2em] text-xs">Discard</button>
                                <button 
                                    onClick={handleInvite}
                                    disabled={!inviteEmail}
                                    className={`font-black py-5 px-12 rounded-2xl shadow-xl text-white transition-all transform active:scale-95 flex items-center gap-3 ${!inviteEmail ? 'bg-gray-200 cursor-not-allowed' : 'bg-fb-green hover:brightness-110 shadow-fb-green/20'}`}
                                >
                                    Launch Invitation <CheckCircle2 size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}