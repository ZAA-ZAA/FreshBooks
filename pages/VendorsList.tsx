import React, { useState, useEffect } from 'react';
import { Plus, Search, Store, Mail, Phone, MoreHorizontal, X, CheckCircle2 } from 'lucide-react';

export default function VendorsList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [vendors, setVendors] = useState<any[]>([]);
    const [newVendor, setNewVendor] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        const stored = localStorage.getItem('fb_vendors');
        if (stored) {
            setVendors(JSON.parse(stored));
        }
    }, []);

    const handleSave = () => {
        const vendor = {
            id: Date.now(),
            name: newVendor.name,
            email: newVendor.email,
            phone: newVendor.phone,
            balance: 0.00
        };
        const updated = [...vendors, vendor];
        setVendors(updated);
        localStorage.setItem('fb_vendors', JSON.stringify(updated));

        setIsModalOpen(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setNewVendor({ name: '', email: '', phone: '' });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Vendor Created Successfully</span>
                </div>
            )}

             {/* Top Action */}
             <div className="absolute top-[-50px] right-0">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-fb-green hover:bg-[#33c46b] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                >
                    New Vendor
                </button>
            </div>

            {/* List Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-fb-slate">All Vendors</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Vendors" 
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-fb-blue w-64 focus:ring-1 focus:ring-fb-blue"
                        />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-normal text-gray-500">Vendor</th>
                                <th className="p-4 font-normal text-gray-500">Contact</th>
                                <th className="p-4 font-normal text-gray-500 text-right">Outstanding Balance</th>
                                <th className="p-4 font-normal text-gray-500 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((vendor) => (
                                <tr 
                                    key={vendor.id}
                                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors group"
                                >
                                    <td className="p-4">
                                        <div className="font-bold text-fb-slate text-lg group-hover:text-fb-blue">{vendor.name}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center text-gray-600 mb-1">
                                            <Mail size={14} className="mr-2 text-gray-400" /> {vendor.email}
                                        </div>
                                        {vendor.phone && (
                                            <div className="flex items-center text-gray-600">
                                                <Phone size={14} className="mr-2 text-gray-400" /> {vendor.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className={`font-bold ${vendor.balance > 0 ? 'text-fb-slate' : 'text-gray-400'}`}>
                                            ₱{vendor.balance.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-gray-400 hover:text-fb-blue p-2">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[600px] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-fb-slate">New Vendor</h2>
                                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                            </div>
    
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Vendor Name</label>
                                <input 
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                    placeholder="e.g. Supplier Inc" 
                                    value={newVendor.name}
                                    onChange={e => setNewVendor({...newVendor, name: e.target.value})}
                                />
                            </div>
    
                            <div className="mb-4">
                                 <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                                <input 
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                    value={newVendor.email}
                                    onChange={e => setNewVendor({...newVendor, email: e.target.value})}
                                />
                            </div>

                            <div className="mb-4">
                                 <label className="block text-xs font-bold text-gray-500 mb-1">Phone</label>
                                <input 
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                    value={newVendor.phone}
                                    onChange={e => setNewVendor({...newVendor, phone: e.target.value})}
                                />
                            </div>
    
                            <div className="flex justify-end space-x-4 mt-8">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="font-bold text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="bg-fb-green hover:bg-[#33c46b] text-white font-bold py-2 px-6 rounded shadow-sm"
                                >
                                    Create Vendor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}