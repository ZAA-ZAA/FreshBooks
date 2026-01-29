// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    X, CheckCircle2, ChevronDown, ChevronRight, Image as ImageIcon, 
    Calendar, Receipt, Tag, Briefcase, Smile, Home, Pizza,
    Clock, Globe, RotateCcw, UserPlus, Info, Users, AlertCircle, Loader2
} from 'lucide-react';
import { expensesApi, clientsApi, ExpenseData, ClientData } from '../api';

const CATEGORIES = [
    { name: 'Personal', icon: <Smile size={18} className="text-emerald-500" /> },
    { name: 'Professional Services', icon: <Briefcase size={18} className="text-fb-blue" />, sub: ['Accounting', 'Legal Fees'] },
    { name: 'Rent or Lease', icon: <Home size={18} className="text-amber-500" />, sub: ['Equipment', 'Machinery'] },
    { name: 'Operating Expenses', icon: <Receipt size={18} className="text-pink-500" />, sub: ['Advertising', 'Car & Truck Expenses'] }
];

export default function ExpenseCreate() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [merchant, setMerchant] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('0.00');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Rent or Lease');
    const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
    
    const [existingClients, setExistingClients] = useState<ClientData[]>([]);
    const [showClientMenu, setShowClientMenu] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const categoryRef = useRef(null);
    const clientRef = useRef(null);

    useEffect(() => {
        loadInitialData();
    }, [id, isEdit]);

    const loadInitialData = async () => {
        setIsLoading(true);
        
        // Load clients
        const clientsResponse = await clientsApi.getAll();
        if (clientsResponse.success && clientsResponse.data) {
            setExistingClients(clientsResponse.data);
        }

        if (isEdit) {
            const response = await expensesApi.getById(id!);
            if (response.success && response.data) {
                const exp = response.data;
                setMerchant(exp.merchant || '');
                setDate(exp.date || new Date().toISOString().split('T')[0]);
                setAmount(exp.amount?.toString() || '0.00');
                setCategory(exp.category || 'Rent or Lease');
                setDescription(exp.description || '');
                
                if (exp.client_id && clientsResponse.data) {
                    const matched = clientsResponse.data.find(c => c.id === exp.client_id);
                    if (matched) setSelectedClient(matched);
                }
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setShowCategoryMenu(false);
            }
            if (clientRef.current && !clientRef.current.contains(event.target)) {
                setShowClientMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        
        setIsLoading(false);
        
        return () => document.removeEventListener("mousedown", handleClickOutside);
    };

    const handleSave = async () => {
        // Validation
        if (!merchant) {
            setError('Merchant name is required');
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            setError('Valid amount is required');
            return;
        }

        setIsSaving(true);
        setError(null);

        const expenseData: ExpenseData = {
            merchant: merchant || 'New Merchant',
            date: date,
            amount: parseFloat(amount) || 0,
            category: category,
            description: description,
            client_id: selectedClient?.id || undefined,
            status: 'Draft'
        };

        let response;
        if (isEdit) {
            response = await expensesApi.update(id!, expenseData);
        } else {
            response = await expensesApi.create(expenseData);
        }

        if (response.success) {
            setShowToast(true);
            setTimeout(() => navigate('/expenses'), 1500);
        } else {
            setError(response.error || 'Failed to save expense');
        }

        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#0075dd]" size={32} />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 bg-[#d3dae3] -z-10 -m-8 min-h-[calc(100%+4rem)]"></div>

            {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] bg-[#28303f] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-black/10">
                    <CheckCircle2 className="text-fb-green mr-3" size={24} />
                    <span className="font-bold">Expense saved</span>
                </div>
            )}

            <div className="flex flex-col items-center pb-20 pt-4">
                <div className="w-full max-w-[1100px] px-4">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-4xl font-bold text-fb-navy">
                            {isEdit ? 'Edit Expense' : 'New Expense'}
                        </h2>
                        
                        <div className="flex items-center space-x-6">
                            <button onClick={() => navigate(-1)} className="font-bold text-fb-navy hover:underline">Cancel</button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-10 py-3 bg-fb-green hover:brightness-110 text-white rounded-lg font-black text-xl shadow-lg transition-all disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-red-700 text-sm">{error}</p>
                            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X size={18} /></button>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        <div className="flex-1 bg-white rounded-lg shadow-2xl p-16 relative animate-in zoom-in-95 duration-300 w-full min-h-[700px] border-t-8 border-t-fb-green">
                            
                            <div className="absolute top-10 right-16 w-44 h-56 bg-gray-50 border border-gray-100 rounded-sm shadow-sm rotate-3 flex flex-col items-center justify-center text-center p-4 group cursor-pointer hover:rotate-0 transition-transform">
                                <div className="text-gray-300 group-hover:text-fb-blue transition-colors">
                                    <ImageIcon size={32} />
                                    <p className="font-bold text-[10px] uppercase tracking-widest mt-2">Add Receipt</p>
                                </div>
                            </div>

                            <div className="space-y-12 max-w-lg">
                                <div className="relative" ref={categoryRef}>
                                    <div 
                                        onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                                        className="flex items-center gap-3 text-fb-navy font-bold cursor-pointer group"
                                    >
                                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-fb-blue/5">
                                            {CATEGORIES.find(c => c.name === category)?.icon || <Receipt size={18} className="text-fb-green" />}
                                        </div>
                                        <span className="text-xl underline decoration-dotted decoration-gray-300 underline-offset-8 group-hover:text-fb-blue group-hover:decoration-fb-blue">
                                            {category || 'Add category (required)'}
                                        </span>
                                    </div>
                                    {showCategoryMenu && (
                                        <div className="absolute top-12 left-0 w-80 bg-white border border-gray-200 rounded shadow-2xl z-[80] py-1 max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                            {CATEGORIES.map(cat => (
                                                <div key={cat.name} onClick={() => { setCategory(cat.name); setShowCategoryMenu(false); }} className="px-4 py-3 hover:bg-fb-gray cursor-pointer font-bold text-fb-navy flex items-center gap-3 transition-colors">
                                                    {cat.icon} {cat.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 group">
                                     <div className="flex items-center gap-2">
                                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="font-bold text-fb-navy border-none p-0 outline-none w-32 cursor-pointer" />
                                        <Calendar size={18} className="text-gray-300 group-hover:text-fb-blue" />
                                     </div>
                                </div>

                                <div>
                                    <input value={merchant} onChange={e => setMerchant(e.target.value)} placeholder="Add merchant *" className="text-5xl font-black text-fb-navy border-none p-0 w-full outline-none placeholder:text-gray-100" />
                                </div>

                                <div>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add description (optional)" className="w-full border-none p-0 text-lg text-gray-500 outline-none resize-none placeholder:text-gray-200 leading-relaxed" rows={3}></textarea>
                                </div>

                                <div className="pt-8 border-t border-fb-navy/10 flex items-center justify-between">
                                     <span className="text-gray-500 font-bold text-sm">Grand Total (PHP):</span>
                                     <div className="flex items-center gap-2">
                                         <span className="text-5xl font-black text-fb-navy">₱</span>
                                         <input value={amount} onChange={e => setAmount(e.target.value)} className="text-5xl font-black text-fb-navy border-none p-0 w-44 outline-none text-right" />
                                     </div>
                                </div>
                            </div>
                        </div>

                        <aside className="w-full lg:w-[320px] space-y-10">
                            <div>
                                <h3 className="text-2xl font-black text-fb-navy mb-6 uppercase tracking-tighter">Settings</h3>
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-50">
                                    <div className="relative" ref={clientRef}>
                                        <div onClick={() => setShowClientMenu(!showClientMenu)} className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer group transition-colors">
                                            <div className="flex items-start gap-4">
                                                <Users className="text-gray-400 group-hover:text-fb-blue mt-1" size={20} />
                                                <div>
                                                    <div className="font-bold text-[13px] text-fb-navy">Assign to Client</div>
                                                    <div className="text-[11px] text-fb-blue font-bold mt-1 uppercase tracking-widest">{selectedClient ? selectedClient.company : 'NONE (Internal)'}</div>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-gray-300" size={16} />
                                        </div>
                                        {showClientMenu && (
                                            <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-2xl z-[70] py-2 animate-in fade-in duration-200">
                                                {existingClients.map(c => (
                                                    <div key={c.id} onClick={() => { setSelectedClient(c); setShowClientMenu(false); }} className="px-5 py-3 hover:bg-fb-gray cursor-pointer font-bold text-sm text-fb-navy">
                                                        {c.company}
                                                    </div>
                                                ))}
                                                <div onClick={() => { setSelectedClient(null); setShowClientMenu(false); }} className="px-5 py-3 hover:bg-fb-gray cursor-pointer font-bold text-sm text-gray-400">Clear Assignment (Internal)</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer group transition-colors">
                                        <div className="flex items-start gap-4">
                                            <RotateCcw className="text-gray-400 group-hover:text-fb-blue mt-1" size={20} />
                                            <div className="font-bold text-[13px] text-fb-navy">Make Recurring</div>
                                        </div>
                                        <ChevronRight className="text-gray-300" size={16} />
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
