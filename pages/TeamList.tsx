import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Mail, Shield, CheckCircle2, X, MoreHorizontal } from 'lucide-react';

export default function TeamList() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [team, setTeam] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('fb_team');
        if (stored) {
            setTeam(JSON.parse(stored));
        }
    }, []);

    const handleInvite = () => {
        const newMember = {
            id: Date.now(),
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            role: 'Employee',
            status: 'Invited'
        };
        const updated = [...team, newMember];
        setTeam(updated);
        localStorage.setItem('fb_team', JSON.stringify(updated));

        setIsInviteModalOpen(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setInviteEmail('');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Invitation Sent Successfully</span>
                </div>
            )}

             {/* Top Action */}
             <div className="absolute top-[-50px] right-0">
                <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="bg-fb-green hover:bg-[#33c46b] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                >
                    Invite Team Member
                </button>
            </div>

            {/* List Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-fb-slate">Team Members</h3>
                </div>

                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-normal text-gray-500">Name</th>
                                <th className="p-4 font-normal text-gray-500">Email</th>
                                <th className="p-4 font-normal text-gray-500">Role</th>
                                <th className="p-4 font-normal text-gray-500">Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.map((member) => (
                                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-fb-slate">{member.name}</td>
                                    <td className="p-4 text-gray-600">{member.email}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {member.status === 'Active' ? (
                                            <span className="text-green-600 font-bold text-xs uppercase">Active</span>
                                        ) : (
                                            <span className="text-gray-500 font-bold text-xs uppercase">Pending</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <button className="text-gray-400 hover:text-fb-blue">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center">
                                    <UserPlus className="mr-3 text-fb-blue" />
                                    <h2 className="text-2xl font-bold text-fb-slate">Invite Your Team</h2>
                                </div>
                                <button onClick={() => setIsInviteModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-6">
                                Collaborate with your accountant, employees, or contractors. They'll get their own login.
                            </p>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                                <input 
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                    placeholder="colleague@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
                                <select className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none bg-white">
                                    <option>Admin</option>
                                    <option>Manager</option>
                                    <option>Employee</option>
                                    <option>Contractor</option>
                                    <option>Accountant</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button 
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="font-bold text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleInvite}
                                    disabled={!inviteEmail}
                                    className={`font-bold py-2 px-6 rounded shadow-sm text-white transition-colors ${!inviteEmail ? 'bg-gray-300 cursor-not-allowed' : 'bg-fb-green hover:bg-[#33c46b]'}`}
                                >
                                    Send Invitation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}