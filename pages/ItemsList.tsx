import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, X, CheckCircle2, MoreHorizontal } from 'lucide-react';

export default function ItemsList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', description: '', rate: '' });
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('fb_items');
        if (stored) {
            setItems(JSON.parse(stored));
        }
    }, []);

    const handleSave = () => {
        const item = {
            id: Date.now(),
            name: newItem.name,
            description: newItem.description,
            rate: parseFloat(newItem.rate) || 0,
            qty: 1
        };
        const updated = [...items, item];
        setItems(updated);
        localStorage.setItem('fb_items', JSON.stringify(updated));

        setIsModalOpen(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setNewItem({ name: '', description: '', rate: '' });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Item Saved Successfully</span>
                </div>
            )}

             {/* Top Action */}
             <div className="absolute top-[-50px] right-0">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-fb-green hover:bg-[#33c46b] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                >
                    Create New Item
                </button>
            </div>

            {/* List Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-fb-slate">Items & Services</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Items" 
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-fb-blue w-64 focus:ring-1 focus:ring-fb-blue"
                        />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-normal text-gray-500">Item Name</th>
                                <th className="p-4 font-normal text-gray-500">Description</th>
                                <th className="p-4 font-normal text-gray-500 text-right">Rate (PHP)</th>
                                <th className="p-4 font-normal text-gray-500 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr 
                                    key={item.id}
                                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors group"
                                >
                                    <td className="p-4">
                                        <div className="font-bold text-fb-slate">{item.name}</div>
                                    </td>
                                    <td className="p-4 text-gray-600 max-w-md truncate">
                                        {item.description}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-bold text-fb-slate">₱{item.rate.toLocaleString()}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-gray-400 hover:text-fb-blue p-2">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">No items found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-fb-slate">New Item</h2>
                                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Item Name</label>
                                    <input 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                        value={newItem.name}
                                        onChange={e => setNewItem({...newItem, name: e.target.value})}
                                        placeholder="e.g. Consulting"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                                    <textarea 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none resize-none" 
                                        rows={3}
                                        value={newItem.description}
                                        onChange={e => setNewItem({...newItem, description: e.target.value})}
                                        placeholder="Description visible on invoices..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Rate (PHP)</label>
                                    <input 
                                        type="number"
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                        value={newItem.rate}
                                        onChange={e => setNewItem({...newItem, rate: e.target.value})}
                                        placeholder="0.00"
                                    />
                                </div>
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
                                    disabled={!newItem.name}
                                    className={`font-bold py-2 px-6 rounded shadow-sm text-white transition-colors ${!newItem.name ? 'bg-gray-300 cursor-not-allowed' : 'bg-fb-green hover:bg-[#33c46b]'}`}
                                >
                                    Save Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}