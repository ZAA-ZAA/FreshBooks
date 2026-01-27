import React, { useState, useEffect } from 'react';
import { User, Building, CreditCard, Bell, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState<any>({ firstName: '', lastName: '', email: '', phone: '', company: '' });
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('fb_user_profile');
        if (stored) {
            setProfile(JSON.parse(stored));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('fb_user_profile', JSON.stringify(profile));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="animate-in fade-in duration-300 relative">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Settings Saved</span>
                </div>
            )}

            <h2 className="text-2xl font-bold text-fb-slate mb-6">Settings</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 rounded-l-lg">
                    <div className="p-4 space-y-1">
                        {[
                            { id: 'profile', label: 'My Profile', icon: User },
                            { id: 'business', label: 'Business Profile', icon: Building },
                            { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                            { id: 'security', label: 'Security', icon: Lock },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === tab.id 
                                    ? 'bg-white text-fb-blue shadow-sm border border-gray-200' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <tab.icon size={18} className="mr-3" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    {activeTab === 'profile' && (
                        <div className="max-w-xl animate-in fade-in slide-in-from-right-2 duration-300">
                            <h3 className="text-xl font-bold text-fb-slate mb-6">My Profile</h3>
                            
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">First Name</label>
                                    <input 
                                        type="text" 
                                        value={profile.firstName}
                                        onChange={e => setProfile({...profile, firstName: e.target.value})}
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:border-fb-blue outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Last Name</label>
                                    <input 
                                        type="text" 
                                        value={profile.lastName}
                                        onChange={e => setProfile({...profile, lastName: e.target.value})}
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:border-fb-blue outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={profile.email}
                                    readOnly
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-fb-blue outline-none bg-gray-50 text-gray-500"
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={profile.phone}
                                    onChange={e => setProfile({...profile, phone: e.target.value})}
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-fb-blue outline-none"
                                />
                            </div>

                            <button onClick={handleSave} className="bg-fb-green hover:bg-[#33c46b] text-white font-bold py-2.5 px-6 rounded shadow-sm transition-colors">
                                Save Changes
                            </button>
                        </div>
                    )}

                    {activeTab === 'business' && (
                         <div className="max-w-xl animate-in fade-in slide-in-from-right-2 duration-300">
                            <h3 className="text-xl font-bold text-fb-slate mb-6">Business Profile</h3>
                             <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Company Name</label>
                                <input 
                                    type="text" 
                                    value={profile.company}
                                    onChange={e => setProfile({...profile, company: e.target.value})}
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-fb-blue outline-none"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Address</label>
                                <textarea 
                                    defaultValue="123 Business Rd, Tech City, 10001"
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-fb-blue outline-none h-24 resize-none"
                                />
                            </div>
                             <button onClick={handleSave} className="bg-fb-green hover:bg-[#33c46b] text-white font-bold py-2.5 px-6 rounded shadow-sm transition-colors">
                                Save Changes
                            </button>
                         </div>
                    )}

                    {activeTab === 'billing' && (
                         <div className="max-w-xl animate-in fade-in slide-in-from-right-2 duration-300">
                            <h3 className="text-xl font-bold text-fb-slate mb-4">Billing & Subscription</h3>
                            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                                <p className="text-fb-blue font-bold mb-1">Current Plan: Trial</p>
                                <p className="text-sm text-blue-800">You have 28 days remaining in your free trial.</p>
                            </div>
                            <button className="bg-fb-blue hover:bg-fb-darkBlue text-white font-bold py-2.5 px-6 rounded shadow-sm transition-colors">
                                Upgrade Plan
                            </button>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
}