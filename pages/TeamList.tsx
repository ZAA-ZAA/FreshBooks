// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Mail, Shield, CheckCircle2, X, MoreHorizontal, Filter, ShieldCheck, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import { teamApi, TeamMemberData } from '../api';

export default function TeamList() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [inviteData, setInviteData] = useState({ firstName: '', lastName: '', email: '', role: 'Employee' });
    const [team, setTeam] = useState<TeamMemberData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        setIsLoading(true);
        const response = await teamApi.getAll();
        if (response.success && response.data) {
            setTeam(response.data);
        }
        setIsLoading(false);
    };

    const filteredTeam = team.filter(member => 
        (member.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInvite = async () => {
        if (!inviteData.firstName) {
            setError('First name is required');
            return;
        }

        setIsSaving(true);
        setError(null);

        const response = await teamApi.create({
            first_name: inviteData.firstName,
            last_name: inviteData.lastName,
            email: inviteData.email,
            role: inviteData.role
        });

        if (response.success) {
            await loadTeam();
            setIsInviteModalOpen(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setInviteData({ firstName: '', lastName: '', email: '', role: 'Employee' });
        } else {
            setError(response.error || 'Failed to add team member');
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Remove this team member?')) {
            await teamApi.delete(id);
            await loadTeam();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#0075dd]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 relative">
             {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] bg-[#28303f] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-black/10">
                    <CheckCircle2 className="text-fb-green mr-3" size={24} />
                    <span className="font-bold">Team Member Added</span>
                </div>
            )}

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
                        Add Team Member
                    </button>
                </div>
            </div>

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
                        <div className="text-2xl font-black text-fb-navy">{team.length}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Members</div>
                     </div>
                </div>
            </div>

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
                                                {(member.name || 'U').split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-black text-fb-navy group-hover:text-fb-blue text-lg leading-tight mb-1">{member.name}</div>
                                                <div className="text-gray-400 font-bold text-xs flex items-center gap-2">
                                                    <Mail size={12} className="opacity-40" /> {member.email || 'No email'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-fb-blue rounded-xl"><Shield size={16} /></div>
                                            <span className="font-black text-fb-navy uppercase tracking-widest text-[10px]">{member.role || 'Member'}</span>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-fb-green animate-pulse"></div>
                                            <span className="text-fb-green font-black text-[10px] uppercase tracking-widest">Active</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <button 
                                            onClick={() => handleDelete(member.id!)}
                                            className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <X size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTeam.length === 0 && (
                        <div className="p-32 text-center bg-gray-50/30">
                            <div className="flex flex-col items-center">
                                <UserCheck size={64} className="text-gray-100 mb-6" />
                                <p className="text-gray-400 font-black text-2xl italic tracking-tight">No team members yet</p>
                                <button onClick={() => setIsInviteModalOpen(true)} className="bg-fb-blue text-white px-8 py-3 rounded-xl font-black mt-6 shadow-xl active:scale-95 transition-all">Add Your First Team Member</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isInviteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-fb-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[600px] animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-14">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-fb-blue rounded-2xl flex items-center justify-center text-white">
                                        <UserPlus size={24} />
                                     </div>
                                     <h2 className="text-3xl font-black text-fb-navy">Add Team Member</h2>
                                </div>
                                <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-300 hover:text-fb-navy transition-colors"><X size={32} /></button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">First Name <span className="text-red-500">*</span></label>
                                        <input 
                                            autoFocus
                                            className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy text-xl shadow-sm transition-all" 
                                            placeholder="John"
                                            value={inviteData.firstName}
                                            onChange={(e) => setInviteData({...inviteData, firstName: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Last Name</label>
                                        <input 
                                            className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy text-xl shadow-sm transition-all" 
                                            placeholder="Doe"
                                            value={inviteData.lastName}
                                            onChange={(e) => setInviteData({...inviteData, lastName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Email Address</label>
                                    <input 
                                        className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-bold text-fb-navy shadow-sm transition-all" 
                                        placeholder="colleague@business.com"
                                        value={inviteData.email}
                                        onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Assign Role</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none bg-white font-black text-fb-navy shadow-sm appearance-none cursor-pointer"
                                            value={inviteData.role}
                                            onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                                        >
                                            <option>Admin (Full Access)</option>
                                            <option>Manager</option>
                                            <option>Employee</option>
                                            <option>Contractor</option>
                                            <option>Accountant</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-fb-blue">
                                            <Shield size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-10 mt-16 pt-10 border-t border-gray-50">
                                <button onClick={() => setIsInviteModalOpen(false)} className="font-black text-gray-400 hover:text-fb-navy transition-colors uppercase tracking-[0.2em] text-xs">Cancel</button>
                                <button 
                                    onClick={handleInvite}
                                    disabled={!inviteData.firstName || isSaving}
                                    className={`font-black py-5 px-12 rounded-2xl shadow-xl text-white transition-all transform active:scale-95 flex items-center gap-3 ${!inviteData.firstName || isSaving ? 'bg-gray-200 cursor-not-allowed' : 'bg-fb-green hover:brightness-110 shadow-fb-green/20'}`}
                                >
                                    {isSaving ? 'Adding...' : 'Add Member'} <CheckCircle2 size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
