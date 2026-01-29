// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, Package, X, CheckCircle2, MoreHorizontal, 
    Pencil, Trash2, Filter, Settings, Box, Zap
} from 'lucide-react';

export default function ItemsList() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', description: '', rate: '' });
    const [items, setItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('fb_items');
        if (stored) setItems(JSON.parse(stored));
    }, []);

    const filteredItems = items.filter(i => 
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (i.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        let updated;
        if (editingItem) {
            updated = items.map(i => i.id === editingItem.id ? { ...i, ...newItem, rate: parseFloat(newItem.rate) || 0 } : i);
        } else {
            const item = { id: Date.now(), ...newItem, rate: parseFloat(newItem.rate) || 0, qty: 1 };
            updated = [item, ...items];
        }
        
        setItems(updated);
        localStorage.setItem('fb_items', JSON.stringify(updated));
        setIsModalOpen(false);
        setEditingItem(null);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setNewItem({ name: '', description: '', rate: '' });
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setNewItem({ name: item.name, description: item.description, rate: item.rate.toString() });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this item?')) {
            const updated = items.filter(i => i.id !== id);
            setItems(updated);
            localStorage.setItem('fb_items', JSON.stringify(updated));
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 relative">
             {showToast && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-[#28303f] text-white px-8 py-3 rounded-xl shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Catalog Synchronized</span>
                </div>
            )}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-fb-navy tracking-tighter">Items & Services</h1>
                    <p className="text-gray-400 font-bold mt-2">Manage your inventory and service catalog</p>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-fb-navy font-black text-lg hover:underline transition-all">Import Items</button>
                    <button 
                        onClick={() => { setEditingItem(null); setNewItem({ name: '', description: '', rate: '' }); setIsModalOpen(true); }}
                        className="bg-fb-green hover:brightness-110 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-fb-green/20 transition-all active:scale-95"
                    >
                        Create New Item
                    </button>
                </div>
            </div>

            {/* Featured Items Grid */}
            <div className="relative">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8 px-2 flex items-center gap-4">
                    Top Billed Items <div className="flex-1 h-[1px] bg-gray-100"></div>
                </h3>
                <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
                    {items.slice(0, 5).map(item => (
                        <div 
                            key={item.id}
                            onClick={() => handleEdit(item)}
                            className="flex-none w-72 bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl cursor-pointer transition-all border-t-8 border-t-fb-blue group relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-fb-blue flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Zap size={24} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-black text-fb-navy group-hover:text-fb-blue transition-colors truncate">{item.name}</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">Service</span>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1 relative z-10">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate</div>
                                <div className="text-2xl font-black text-fb-navy">₱{item.rate.toLocaleString()}</div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                                <Box size={140} />
                            </div>
                        </div>
                    ))}
                    <div 
                        onClick={() => setIsModalOpen(true)}
                        className="flex-none w-72 h-48 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-fb-blue transition-all group"
                    >
                        <div className="w-12 h-12 bg-fb-green/10 rounded-xl flex items-center justify-center text-fb-green mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={28} strokeWidth={3} />
                        </div>
                        <span className="font-black text-fb-navy text-[10px] uppercase tracking-widest">Add New Item</span>
                    </div>
                </div>
            </div>

            {/* Search & List */}
            <div className="pt-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 h-16 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-fb-navy tracking-tight">Catalog Ledger</h2>
                        <div className="bg-fb-blue/10 text-fb-blue px-3 py-1 rounded-lg text-xs font-black">{items.length} Entries</div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue transition-colors" size={20} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none w-full md:w-80 text-sm font-bold text-fb-navy shadow-sm transition-all" 
                                placeholder="Search items or descriptions..." 
                            />
                        </div>
                        <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} /> Filters
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-fb-blue">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                            <tr>
                                <th className="p-8 w-16"><input type="checkbox" className="rounded-lg border-gray-300 text-fb-blue w-5 h-5" /></th>
                                <th className="p-8">Item Identity & Details</th>
                                <th className="p-8">Description</th>
                                <th className="p-8 text-right">Standard Rate</th>
                                <th className="p-8 w-32"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="transition-all duration-300 group cursor-pointer hover:bg-fb-gray" onClick={() => handleEdit(item)}>
                                    <td className="p-8" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded-lg border-gray-300 text-fb-blue w-5 h-5" /></td>
                                    <td className="p-8 border-l-8 border-fb-blue/30 group-hover:border-fb-blue transition-all">
                                        <div className="font-black text-fb-navy group-hover:text-fb-blue text-lg leading-tight mb-1">{item.name}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU: {item.id.toString().slice(-6)}</div>
                                    </td>
                                    <td className="p-8">
                                        <div className="text-gray-500 font-medium line-clamp-2 max-w-sm italic">"{item.description || 'No description provided'}"</div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="font-black text-fb-navy text-xl leading-none mb-1">₱{item.rate.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                        <span className="text-[10px] font-black text-fb-blue bg-fb-blue/5 px-2 py-1 rounded uppercase tracking-widest border border-fb-blue/10">Standard</span>
                                    </td>
                                    <td className="p-8 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-x-2">
                                            <button onClick={() => handleEdit(item)} className="w-10 h-10 bg-fb-blue/5 text-fb-blue rounded-xl flex items-center justify-center hover:bg-fb-blue hover:text-white transition-all shadow-sm">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredItems.length === 0 && (
                        <div className="p-32 text-center bg-gray-50/30">
                            <div className="flex flex-col items-center">
                                <Package size={64} className="text-gray-100 mb-6" />
                                <p className="text-gray-400 font-black text-2xl italic tracking-tight">No matching catalog items</p>
                                <button onClick={() => setSearchTerm('')} className="text-fb-blue font-bold text-sm mt-4 hover:underline">Clear Filters</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-fb-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[600px] animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-12">
                            <div className="flex justify-between items-start mb-10">
                                <h2 className="text-3xl font-black text-fb-navy">{editingItem ? 'Modify Identity' : 'New Catalog Entry'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-fb-navy transition-colors"><X size={32} /></button>
                            </div>
                            
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Item Name</label>
                                    <input 
                                        autoFocus
                                        className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy text-xl shadow-sm transition-all" 
                                        value={newItem.name}
                                        onChange={e => setNewItem({...newItem, name: e.target.value})}
                                        placeholder="e.g. Senior Strategy Consulting"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Description for Invoices</label>
                                    <textarea 
                                        className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none resize-none font-bold text-gray-600 shadow-sm transition-all" 
                                        rows={4}
                                        value={newItem.description}
                                        onChange={e => setNewItem({...newItem, description: e.target.value})}
                                        placeholder="Describe the service or product in detail..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Unit Price / Standard Rate (PHP)</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-300 text-2xl">₱</span>
                                        <input 
                                            type="number"
                                            className="w-full border border-gray-200 rounded-2xl pl-12 pr-6 py-5 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy text-3xl shadow-sm transition-all" 
                                            value={newItem.rate}
                                            onChange={e => setNewItem({...newItem, rate: e.target.value})}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
    
                            <div className="flex justify-end items-center gap-10 mt-16 pt-10 border-t border-gray-50">
                                <button onClick={() => setIsModalOpen(false)} className="font-black text-gray-400 hover:text-fb-navy transition-colors uppercase tracking-[0.2em] text-xs">Discard Changes</button>
                                <button 
                                    onClick={handleSave}
                                    disabled={!newItem.name}
                                    className={`font-black py-5 px-12 rounded-2xl shadow-xl text-white transition-all transform active:scale-95 flex items-center gap-3 ${!newItem.name ? 'bg-gray-200 cursor-not-allowed' : 'bg-fb-green hover:brightness-110 shadow-fb-green/20'}`}
                                >
                                    {editingItem ? 'Update Entry' : 'Add to Catalog'} <CheckCircle2 size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}