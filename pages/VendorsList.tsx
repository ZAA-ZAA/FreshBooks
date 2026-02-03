// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, Store, Mail, Phone, MoreHorizontal, X, 
    CheckCircle2, Pencil, Trash2, Filter, SlidersHorizontal, UserPlus, Loader2, AlertCircle
} from 'lucide-react';
import { vendorsApi, VendorData } from '../api';

export default function VendorsList() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [editingVendor, setEditingVendor] = useState<VendorData | null>(null);
    const [vendors, setVendors] = useState<VendorData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newVendor, setNewVendor] = useState({ company: '', email: '', phone: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const TOAST_DURATION_MS = 4000;

    useEffect(() => {
        loadVendors();
    }, []);

    useEffect(() => {
        if (!showToast) return;
        const t = setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
        return () => clearTimeout(t);
    }, [showToast]);

    const loadVendors = async () => {
        setIsLoading(true);
        const response = await vendorsApi.getAll();
        if (response.success && response.data) {
            setVendors(response.data);
        }
        setIsLoading(false);
    };

    const filteredVendors = vendors.filter(v => 
        (v.company || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (v.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async () => {
        if (!newVendor.company) {
            setError('Company name is required');
            return;
        }

        setIsSaving(true);
        setError(null);

        let response;
        if (editingVendor) {
            response = await vendorsApi.update(editingVendor.id!, newVendor);
        } else {
            response = await vendorsApi.create(newVendor);
        }
        
        if (response.success) {
            await loadVendors();
            setIsModalOpen(false);
            setEditingVendor(null);
            setShowToast(true);
            setNewVendor({ company: '', email: '', phone: '' });
        } else {
            setError(response.error || 'Failed to save vendor');
        }
        setIsSaving(false);
    };

    const handleEdit = (vendor: VendorData) => {
        setEditingVendor(vendor);
        setNewVendor({ company: vendor.company || '', email: vendor.email || '', phone: vendor.phone || '' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Archive this vendor relationship?')) {
            const response = await vendorsApi.delete(id);
            if (response.success) {
                await loadVendors();
            }
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
                    <span className="font-bold">Vendor Record Synchronized</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-fb-navy tracking-tighter">Vendors</h1>
                    <p className="text-gray-400 font-bold mt-2">Manage your suppliers and outgoing liabilities</p>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-fb-navy font-black text-lg hover:underline transition-all">Import Vendors</button>
                    <button 
                        onClick={() => { setEditingVendor(null); setNewVendor({ company: '', email: '', phone: '' }); setIsModalOpen(true); }}
                        className="bg-fb-green hover:brightness-110 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-fb-green/20 transition-all active:scale-95"
                    >
                        New Vendor
                    </button>
                </div>
            </div>

            <div className="pt-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 h-16 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-fb-navy tracking-tight">Supply Network</h2>
                        <div className="bg-fb-blue/10 text-fb-blue px-3 py-1 rounded-lg text-xs font-black">{vendors.length} Total</div>
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
                        <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} /> Advanced
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-fb-navy">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                            <tr>
                                <th className="p-8">Vendor Identity & Business</th>
                                <th className="p-8">Contact Channels</th>
                                <th className="p-8 text-right">Outstanding Balance</th>
                                <th className="p-8 w-32"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="transition-all duration-300 group cursor-pointer hover:bg-fb-gray" onClick={() => handleEdit(vendor)}>
                                    <td className="p-8 border-l-8 border-fb-navy/30 group-hover:border-fb-navy transition-all">
                                        <div className="font-black text-fb-navy group-hover:text-fb-blue text-lg leading-tight mb-1">{vendor.company}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Supplier Partner</div>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-gray-500 font-bold text-xs">
                                                <Mail size={14} className="mr-2 opacity-30" /> {vendor.email || 'N/A'}
                                            </div>
                                            <div className="flex items-center text-gray-500 font-bold text-xs">
                                                <Phone size={14} className="mr-2 opacity-30" /> {vendor.phone || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="text-xl font-black text-gray-300">
                                            ₱0.00
                                        </div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Aggregate Payables</div>
                                    </td>
                                    <td className="p-8 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-x-2">
                                            <button onClick={() => handleEdit(vendor)} className="w-10 h-10 bg-fb-blue/5 text-fb-blue rounded-xl flex items-center justify-center hover:bg-fb-blue hover:text-white transition-all shadow-sm">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(vendor.id!)} className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredVendors.length === 0 && (
                        <div className="p-32 text-center bg-gray-50/30">
                            <div className="flex flex-col items-center">
                                <Store size={64} className="text-gray-100 mb-6" />
                                <p className="text-gray-400 font-black text-2xl italic tracking-tight">No vendors found in network</p>
                                <button onClick={() => setIsModalOpen(true)} className="bg-fb-blue text-white px-8 py-3 rounded-xl font-black mt-6 shadow-xl active:scale-95 transition-all">Add Your First Vendor</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-fb-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[600px] animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-12">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-fb-navy rounded-2xl flex items-center justify-center text-white">
                                        <UserPlus size={24} />
                                     </div>
                                     <h2 className="text-3xl font-black text-fb-navy">{editingVendor ? 'Modify Vendor' : 'New Vendor Profile'}</h2>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-fb-navy transition-colors"><X size={32} /></button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}
                            
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Vendor / Business Name <span className="text-red-500">*</span></label>
                                    <input 
                                        autoFocus
                                        className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy text-xl shadow-sm transition-all" 
                                        value={newVendor.company}
                                        onChange={e => setNewVendor({...newVendor, company: e.target.value})}
                                        placeholder="e.g. Acme Logistics Group"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Email Contact</label>
                                        <input 
                                            className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-bold text-fb-navy shadow-sm transition-all"
                                            value={newVendor.email}
                                            onChange={e => setNewVendor({...newVendor, email: e.target.value})}
                                            placeholder="billing@acme.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Primary Phone</label>
                                        <input 
                                            className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-bold text-fb-navy shadow-sm transition-all" 
                                            placeholder="(555) 000-0000" 
                                            value={newVendor.phone}
                                            onChange={e => setNewVendor({...newVendor, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-10 mt-16 pt-10 border-t border-gray-50">
                                <button onClick={() => setIsModalOpen(false)} className="font-black text-gray-400 hover:text-fb-navy transition-colors uppercase tracking-[0.2em] text-xs">Discard</button>
                                <button 
                                    onClick={handleSave}
                                    disabled={!newVendor.company || isSaving}
                                    className={`font-black py-5 px-12 rounded-2xl shadow-xl text-white transition-all transform active:scale-95 flex items-center gap-3 ${!newVendor.company || isSaving ? 'bg-gray-200 cursor-not-allowed' : 'bg-fb-navy hover:brightness-110 shadow-fb-navy/20'}`}
                                >
                                    {isSaving ? 'Saving...' : (editingVendor ? 'Sync Changes' : 'Onboard Vendor')} <CheckCircle2 size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
