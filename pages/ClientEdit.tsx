// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ChevronRight, Bell, Clock, Globe, Paperclip, Save, Plus } from 'lucide-react';

export default function ClientEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (isEdit) {
            const stored = JSON.parse(localStorage.getItem('fb_clients') || '[]');
            const found = stored.find(c => c.id === id);
            if (found) {
                const names = found.name.split(' ');
                setFormData({
                    firstName: names[0] || '',
                    lastName: names.slice(1).join(' ') || '',
                    company: found.company || '',
                    email: found.email || '',
                    phone: found.phone || ''
                });
            }
        }
    }, [id, isEdit]);

    const handleSave = () => {
        const stored = JSON.parse(localStorage.getItem('fb_clients') || '[]');
        const clientData = {
            id: isEdit ? id : Math.floor(Math.random() * 1000000).toString(),
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            company: formData.company,
            email: formData.email,
            phone: formData.phone,
            balance: 0
        };

        let updated;
        if (isEdit) {
            updated = stored.map(c => c.id === id ? clientData : c);
        } else {
            updated = [clientData, ...stored];
        }

        localStorage.setItem('fb_clients', JSON.stringify(updated));
        navigate(`/clients/${clientData.id}`);
    };

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-black text-fb-navy">{isEdit ? 'Edit Client' : 'New Client'}</h1>
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="font-bold text-fb-navy hover:underline">Cancel</button>
                    <button 
                        onClick={handleSave}
                        className="bg-fb-green hover:brightness-110 text-white px-10 py-3 rounded-lg font-black text-xl shadow-lg transition-all"
                    >
                        Save
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Form */}
                <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl shadow-sm p-12">
                    <div className="flex items-start gap-2 mb-8 text-gray-500 text-sm">
                        <span>ℹ️</span> 
                        <span>Either First and Last Name or Company Name is required to save this Client.</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-2">First Name</label>
                            <input 
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-fb-blue outline-none transition-all" 
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-2">Last Name</label>
                            <input 
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-fb-blue outline-none transition-all" 
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-500 mb-2">Company Name</label>
                        <input 
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-fb-blue outline-none transition-all" 
                            value={formData.company}
                            onChange={e => setFormData({...formData, company: e.target.value})}
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-500 mb-2">Email Address</label>
                        <input 
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-fb-blue outline-none transition-all" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="mb-10">
                        <label className="block text-sm font-bold text-gray-500 mb-2">Phone Number</label>
                        <input 
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-fb-blue outline-none transition-all" 
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>

                    <div className="space-y-6">
                        <button className="flex items-center text-fb-blue font-bold hover:underline">
                            <Plus size={18} className="mr-2" /> Add Business Phone
                        </button>
                        <button className="flex items-center text-fb-blue font-bold hover:underline">
                            <Plus size={18} className="mr-2" /> Add Mobile Phone
                        </button>
                        <hr className="border-gray-100" />
                        <button className="flex items-center text-fb-blue font-bold hover:underline">
                            <Plus size={18} className="mr-2" /> Add Address
                        </button>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="lg:col-span-5 space-y-8">
                    <h2 className="text-2xl font-black text-fb-navy px-2">Client Settings</h2>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
                        <div className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer group transition-colors">
                            <div className="flex items-center gap-4">
                                <Bell className="text-gray-400 group-hover:text-fb-blue" size={20} />
                                <div>
                                    <div className="font-bold text-fb-navy">Send Reminders</div>
                                    <div className="text-xs text-gray-500">At Customizable Intervals</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-fb-navy">NO</span>
                                <ChevronRight className="text-gray-300" size={18} />
                            </div>
                        </div>

                        <div className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer group transition-colors">
                            <div className="flex items-center gap-4">
                                <Clock className="text-gray-400 group-hover:text-fb-blue" size={20} />
                                <div>
                                    <div className="font-bold text-fb-navy">Charge Late Fees</div>
                                    <div className="text-xs text-gray-500">Percentage or Flat-Rate Fees</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-fb-navy">NO</span>
                                <ChevronRight className="text-gray-300" size={18} />
                            </div>
                        </div>

                        <div className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer group transition-colors">
                            <div className="flex items-center gap-4">
                                <Globe className="text-gray-400 group-hover:text-fb-blue" size={20} />
                                <div>
                                    <div className="font-bold text-fb-navy">Currency & Language</div>
                                    <div className="text-xs text-gray-500">PHP, English (United States)</div>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-300" size={18} />
                        </div>

                        <div className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer group transition-colors">
                            <div className="flex items-center gap-4">
                                <Paperclip className="text-gray-400 group-hover:text-fb-blue" size={20} />
                                <div>
                                    <div className="font-bold text-fb-navy">Invoice Attachments</div>
                                    <div className="text-xs text-gray-500">Attach PDF copy to emails</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-fb-navy">NO</span>
                                <ChevronRight className="text-gray-300" size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
