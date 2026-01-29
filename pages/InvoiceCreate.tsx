// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronDown, ChevronLeft, ChevronRight, Image as ImageIcon, CheckCircle2, X, Info, Calendar as CalendarIcon, Search } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const THEME_COLORS = [
  { id: 'purple', value: '#6d28d9' },
  { id: 'red', value: '#dc2626' },
  { id: 'blue', value: '#0075dd' },
  { id: 'green', value: '#00a651' },
  { id: 'gray', value: '#4b5563' },
  { id: 'gradient', value: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)' },
];

const FONTS = [
  { id: 'Modern', value: 'Inter, sans-serif' },
  { id: 'Classic', value: 'Georgia, serif' },
];

const TEMPLATES = [
  { id: 'Classic', label: 'Classic', preview: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi5JfQo76F8meoJCcn4DRJfC2Dg-4qMsiOVJElMKKjEO6wpCEHFZZi4gBVSqxQC4TRcpOMYJztFVQVMV6UesABEFTy7VgfpLiQ4iEtcfIQ6MP_9bKljvZVhk-MUkjrpwYF1hZiw3_qxkyVeU9ZPWrHaH5mcpJNYEEF0cKfnZAt_WZgGvVfxEJJ2gppV_pTMx9Pn3kIp2c8W02rvgw2Xj8LR4AdWFustOctDryoR2rwlVDRQSZDtr5SLmSUh906P8eJpcS29HhkgNNN' },
  { id: 'Modern', label: 'Modern', preview: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtFRYrPNjBU-3qjeXLMZotapgtSrqPcItiAlRM7TKXaikAtOjZOey-eGkv7zHHAjBovuOOHmi3bmcmGrho0rkV3yL3JF4aE-eCJC97tgeN35HqGuA8udNc6NNnXtzg4OX7fsEq-FpK22Rka2aYccVijTq_1yuITy_5vdwjTNehTkhi-9zScH3-mAPVBAhNEwI74nLapGDr4b2ddjkhR-CbnkbthByOWGcOrkmEauwsBjf7rdQ-O2tKzcYs5axR7e5e5bc1tpOAxYrS' },
  { id: 'Simple', label: 'Simple', preview: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjUO2o_XfUlegnw4vREfRr_1SQzNK67ExMyBjPAGw6XeuaBtEvdFU6T-tExj3jJ4DK72-iLLYSWEeTpivDxV65dlEie951buEEW1-s23-3EIR0cFbPvKRez2UFphIF4zYad1bejrOctDryoR2rwlVDRQSZDtr5SLmSUh906P8eJpcS29HhkgNNN' }
];

export default function InvoiceCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const isNew = location.pathname.includes('new');
  const isEstimate = location.pathname.includes('estimate') || location.pathname.includes('estimates');
  const documentType = isEstimate ? 'Estimate' : 'Invoice';
  
  // Customization State
  const [template, setTemplate] = useState('Classic');
  const [themeColor, setThemeColor] = useState(THEME_COLORS[2].value);
  const [fontFamily, setFontFamily] = useState(FONTS[0].value);

  // Document State
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [client, setClient] = useState<any>(null); 
  const [items, setItems] = useState<any[]>([{ id: '1', name: '', description: '', rate: 0, qty: 1, tax: 0 }]);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [discount, setDiscount] = useState(0);

  // Modals / UI
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [activeTaxItem, setActiveTaxItem] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Business Info
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Demo',
    phone: '0912',
    country: 'Philippines',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postal: '',
    showPhone: true,
    showAddress: true
  });

  const clientDropdownRef = useRef(null);

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem('fb_clients') || '[]');
    if (isNew) {
        const storageKey = isEstimate ? 'fb_estimates' : 'fb_invoices';
        const documents = JSON.parse(localStorage.getItem(storageKey) || '[]');
        setDocNumber((documents.length + 1).toString().padStart(7, '0'));
    } else if (id) {
        const storageKey = isEstimate ? 'fb_estimates' : 'fb_invoices';
        const doc = JSON.parse(localStorage.getItem(storageKey) || '[]').find(d => d.id === id);
        if (doc) {
            setDocNumber(doc.number); setIssueDate(doc.date);
            setItems(doc.items || items); setNotes(doc.notes || '');
            setTerms(doc.terms || ''); setReference(doc.reference || '');
            setDiscount(doc.discount || 0);
            const matchedClient = clients.find(c => c.company === doc.client);
            if (matchedClient) setClient(matchedClient);
        }
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (clientDropdownRef.current && !clientDropdownRef.current.contains(e.target)) {
            setShowClientDropdown(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [id, isNew]);

  const subtotal = items.reduce((acc, item) => acc + (item.rate * item.qty), 0);
  const totalTax = items.reduce((acc, item) => acc + ((item.rate * item.qty) * (item.tax / 100)), 0);
  const discountAmount = (subtotal * (discount / 100));
  const total = subtotal + totalTax - discountAmount;

  const handleSave = (status: string = 'Draft') => {
      const storageKey = isEstimate ? 'fb_estimates' : 'fb_invoices';
      const storedDocs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const docData = {
          id: id || Date.now().toString(), number: docNumber, client: client ? client.company : 'Unknown Client',
          date: issueDate, amount: total, status: status,
          items, notes, terms, reference, discount
      };
      const updatedDocs = id && !isNew ? storedDocs.map(d => d.id === id ? docData : d) : [docData, ...storedDocs];
      localStorage.setItem(storageKey, JSON.stringify(updatedDocs));
      setShowToast(true);
      setTimeout(() => navigate(isEstimate ? '/estimates' : '/invoices'), 1000);
  };

  const handleCreateClient = (newClient) => {
    const clients = JSON.parse(localStorage.getItem('fb_clients') || '[]');
    const clientToAdd = { ...newClient, id: Date.now().toString(), balance: 0 };
    localStorage.setItem('fb_clients', JSON.stringify([clientToAdd, ...clients]));
    setClient(clientToAdd);
    setShowNewClientModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] -m-10 p-10 transition-all duration-500" style={{ fontFamily }}>
        {showToast && (
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] bg-fb-slate text-white px-6 py-2.5 rounded shadow-xl flex items-center animate-in fade-in slide-in-from-top-2 duration-200">
                <CheckCircle2 className="text-fb-green mr-2" size={16} />
                <span className="text-sm font-bold">{documentType} saved successfully</span>
            </div>
        )}

        <div className="max-w-[1240px] mx-auto flex gap-10">
            <div className="flex-1 min-w-0">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-black text-fb-navy tracking-tight">{isNew ? `New ${documentType}` : `Edit ${documentType}`}</h2>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="text-sm font-bold text-fb-navy hover:underline px-4">Cancel</button>
                        <button onClick={() => handleSave('Draft')} className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-2.5 rounded-lg font-black shadow-md transition-all text-base">Save</button>
                        <button onClick={() => handleSave('Sent')} className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-2.5 rounded-lg font-black shadow-md transition-all text-base">Send To...</button>
                    </div>
                </div>

                {/* Document Canvas */}
                <div className={`bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden relative min-h-[1000px] transition-all duration-500 ${template === 'Modern' ? 'pt-0' : 'p-16'}`}>
                    
                    {/* Modern Template Header */}
                    {template === 'Modern' && (
                        <div style={{ background: themeColor }} className="h-48 text-white p-16 flex justify-between items-end relative overflow-hidden">
                             <div className="z-10 flex-1">
                                <h3 className="text-4xl font-black mb-1">{businessInfo.name}</h3>
                                <p className="text-sm opacity-80 font-bold">{businessInfo.phone} • {businessInfo.country}</p>
                             </div>
                             <div className="z-10">
                                <button onClick={() => setShowBusinessModal(true)} className="text-xs font-black uppercase tracking-widest border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition-all">Edit Business Info</button>
                             </div>
                             <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-[-20deg] translate-x-20"></div>
                        </div>
                    )}

                    <div className={`${template === 'Modern' ? 'px-16 py-12' : ''}`}>
                        {/* Classic/Simple Branding */}
                        {template !== 'Modern' && (
                            <div className={`flex ${template === 'Classic' ? 'justify-between' : 'flex-col'} items-start mb-16`}>
                                <div className="space-y-1">
                                    <h3 className="font-black text-fb-navy text-xl uppercase tracking-tighter">{businessInfo.name}</h3>
                                    <p className="text-gray-400 text-sm font-medium">{businessInfo.country}</p>
                                    <p className="text-gray-400 text-sm font-medium">{businessInfo.phone}</p>
                                    <button onClick={() => setShowBusinessModal(true)} className="text-[11px] font-black text-fb-blue hover:underline uppercase tracking-widest mt-2">Edit Business Info</button>
                                </div>
                                <div className="w-44 h-28 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-300 cursor-pointer hover:bg-gray-50 transition-colors group">
                                    <ImageIcon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-center px-4">Upload Logo</p>
                                </div>
                            </div>
                        )}

                        {/* Prepared For & Meta */}
                        <div className="grid grid-cols-2 gap-20 mb-16">
                            <div className="relative" ref={clientDropdownRef}>
                                <label className="text-[10px] font-black text-red-500 uppercase block mb-4 tracking-[0.25em]">Prepared For</label>
                                {client ? (
                                    <div className="p-5 border border-blue-100 bg-blue-50/20 rounded-2xl group relative transition-all hover:border-fb-blue">
                                        <p className="font-black text-fb-navy text-2xl tracking-tighter mb-1">{client.company}</p>
                                        <p className="text-sm text-gray-500 font-bold">{client.name}</p>
                                        <button onClick={() => setClient(null)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><X size={18} /></button>
                                        <button onClick={() => setShowClientDropdown(true)} className="text-[10px] text-fb-blue font-black hover:underline mt-6 uppercase tracking-widest block">Change Client</button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div 
                                            onClick={() => setShowClientDropdown(!showClientDropdown)} 
                                            className={`border rounded-2xl px-5 py-4 text-sm font-bold transition-all flex justify-between items-center cursor-pointer ${showClientDropdown ? 'border-fb-blue ring-4 ring-blue-50' : 'border-gray-200 hover:border-fb-blue bg-white'}`}
                                        >
                                            <span className="text-gray-400">Select a Client</span>
                                            <ChevronDown size={20} className={`text-gray-300 transition-transform ${showClientDropdown ? 'rotate-180' : ''}`} />
                                        </div>
                                        <button onClick={() => setShowNewClientModal(true)} className="flex items-center text-fb-blue font-black text-[11px] uppercase tracking-widest hover:underline mt-4 ml-1">
                                            <Plus size={14} className="mr-1" /> Create a Client
                                        </button>
                                    </div>
                                )}
                                
                                {showClientDropdown && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 mt-1">
                                        <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                            <Search size={14} className="text-gray-400" />
                                            <input placeholder="Search clients..." className="bg-transparent border-none text-xs font-bold outline-none flex-1 focus:ring-0" />
                                        </div>
                                        <div className="max-h-64 overflow-y-auto py-2">
                                            {JSON.parse(localStorage.getItem('fb_clients') || '[]').map(c => (
                                                <div key={c.id} onClick={() => { setClient(c); setShowClientDropdown(false); }} className="px-5 py-3 hover:bg-fb-gray cursor-pointer border-b border-gray-50 last:border-0 group flex flex-col">
                                                    <span className="font-black text-fb-navy group-hover:text-fb-blue transition-colors">{c.company}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{c.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 pt-4">
                                <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{documentType} #</label>
                                    {/* Presentational: No border, padding, or ring */}
                                    <input value={docNumber} readOnly className="text-right text-sm font-black text-fb-navy bg-transparent outline-none w-32 border-none p-0 focus:ring-0" />
                                </div>
                                <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Issued</label>
                                    {/* Presentational: No border, padding, or ring */}
                                    <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="text-right text-sm font-black text-fb-navy bg-transparent cursor-pointer outline-none border-none p-0 focus:ring-0" />
                                </div>
                                <div className="flex justify-between items-end border-b border-gray-100 pb-3 group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference</label>
                                    {/* Presentational: No border, padding, or ring */}
                                    <input value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. PO #" className="text-right text-sm font-bold text-fb-navy bg-transparent placeholder:text-gray-100 outline-none border-none p-0 focus:ring-0 group-hover:placeholder:text-gray-300 transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Presentational Items Table */}
                        <div className="mt-16">
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr className="border-b-2" style={{ borderColor: themeColor }}>
                                        <th className="py-5 text-left font-black text-gray-400 uppercase tracking-widest w-[50%]">Description</th>
                                        <th className="py-5 text-right font-black text-gray-400 uppercase tracking-widest">Rate</th>
                                        <th className="py-5 text-right font-black text-gray-400 uppercase tracking-widest">Qty</th>
                                        <th className="py-5 text-right font-black text-gray-400 uppercase tracking-widest w-32">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="group relative border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-6 pr-10">
                                                <input 
                                                    value={item.name} 
                                                    onChange={(e) => setItems(items.map(i => i.id === item.id ? {...i, name: e.target.value} : i))} 
                                                    className="w-full font-black text-fb-navy bg-transparent outline-none text-base placeholder:text-gray-100 border-none p-0 focus:ring-0" 
                                                    placeholder="Item Name" 
                                                />
                                                <input 
                                                    value={item.description} 
                                                    onChange={(e) => setItems(items.map(i => i.id === item.id ? {...i, description: e.target.value} : i))} 
                                                    className="w-full font-bold text-gray-400 bg-transparent outline-none text-xs placeholder:text-gray-100 border-none p-0 focus:ring-0 mt-1" 
                                                    placeholder="Add a description" 
                                                />
                                            </td>
                                            <td className="py-6 text-right">
                                                <div className="flex items-center justify-end font-black text-fb-navy text-sm">
                                                    <span className="opacity-30 mr-1">₱</span>
                                                    <input 
                                                        type="number" 
                                                        value={item.rate} 
                                                        onChange={(e) => setItems(items.map(i => i.id === item.id ? {...i, rate: parseFloat(e.target.value) || 0} : i))} 
                                                        className="w-24 text-right bg-transparent outline-none p-0 border-none focus:ring-0" 
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-6 text-right">
                                                <input 
                                                    type="number" 
                                                    value={item.qty} 
                                                    onChange={(e) => setItems(items.map(i => i.id === item.id ? {...i, qty: parseFloat(e.target.value) || 0} : i))} 
                                                    className="w-16 text-right bg-transparent outline-none p-0 border-none focus:ring-0 font-black text-fb-navy text-sm" 
                                                />
                                            </td>
                                            <td className="py-6 text-right font-black text-fb-navy text-sm relative">
                                                ₱{(item.rate * item.qty).toLocaleString()}
                                                <div className="absolute right-[-60px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                    <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button onClick={() => setItems([...items, {id: Date.now().toString(), name: '', description: '', rate: 0, qty: 1, tax: 0}])} className="mt-8 flex items-center gap-3 text-fb-blue font-black text-sm uppercase tracking-widest hover:text-fb-navy transition-colors group">
                                <Plus size={18} className="text-fb-green group-hover:scale-110 transition-transform" /> Add a Line
                            </button>

                            {/* Totals Summary */}
                            <div className="mt-20 flex justify-end">
                                <div className="w-80 space-y-5">
                                    <div className="flex justify-between text-gray-500 font-bold text-sm">
                                        <span>Subtotal</span>
                                        <span className="font-black text-fb-navy">₱{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center relative">
                                        <button onClick={() => setShowDiscountModal(!showDiscountModal)} className="text-[10px] font-black text-fb-blue hover:underline uppercase tracking-widest">
                                            {discount > 0 ? `Discount (${discount}%)` : 'Add Discount'}
                                        </button>
                                        <span className="font-black text-fb-navy">-{discountAmount.toFixed(2)}</span>
                                        
                                        {showDiscountModal && (
                                            <div className="absolute bottom-full right-0 mb-4 bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 w-72 z-50 animate-in zoom-in-95">
                                                <h4 className="font-black text-fb-navy text-sm mb-4 uppercase tracking-widest">Set Discount</h4>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative flex-1">
                                                        <input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl px-4 py-3 font-black text-fb-navy outline-none focus:ring-4 ring-blue-50" />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-300">%</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => setShowDiscountModal(false)} className="w-full mt-4 bg-fb-green text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg">Apply</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-5 border-t border-gray-100 flex justify-between items-center" style={{ color: themeColor }}>
                                        <span className="font-black text-[11px] uppercase tracking-[0.25em]">Grand Total (PHP)</span>
                                        <span className="text-3xl font-black">₱{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Area */}
                            <div className="mt-32 grid grid-cols-2 gap-20 border-t border-gray-50 pt-16 pb-16">
                                 <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-gray-300 group-hover:text-gray-500 uppercase tracking-[0.3em] transition-colors">Notes</label>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any extra information for the client..." className="w-full border-none p-0 text-sm font-bold text-gray-500 outline-none resize-none placeholder:text-gray-100 focus:ring-0 h-24" />
                                 </div>
                                 <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-gray-300 group-hover:text-gray-500 uppercase tracking-[0.3em] transition-colors">Terms & Conditions</label>
                                    <textarea value={terms} onChange={e => setTerms(e.target.value)} placeholder="Terms of payment, deadlines, etc..." className="w-full border-none p-0 text-sm font-bold text-gray-500 outline-none resize-none placeholder:text-gray-100 focus:ring-0 h-24" />
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Customization */}
            <aside className="w-[340px] sticky top-10 h-fit bg-white border border-gray-200 rounded-[32px] shadow-2xl p-10 flex flex-col gap-10 animate-in slide-in-from-right-5 duration-500">
                <div className="space-y-12">
                    <div>
                        <h3 className="text-xl font-black text-fb-navy mb-8 tracking-tighter">Document Settings</h3>
                        
                        <div className="space-y-8">
                            {/* Template Carousel */}
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-5">Template Style</label>
                                <div className="flex items-center justify-between gap-4">
                                    <button 
                                        onClick={() => setTemplate(prev => TEMPLATES[(TEMPLATES.findIndex(t => t.id === prev) + 2) % TEMPLATES.length].id)}
                                        className="p-3 bg-gray-50 rounded-full hover:bg-fb-blue hover:text-white transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="flex-1 text-center">
                                        <div className="w-full aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4">
                                            <img src={TEMPLATES.find(t => t.id === template)?.preview} className="w-full h-full object-cover" alt={template} />
                                        </div>
                                        <span className="font-black text-xs uppercase tracking-widest text-fb-navy">{template}</span>
                                    </div>
                                    <button 
                                        onClick={() => setTemplate(prev => TEMPLATES[(TEMPLATES.findIndex(t => t.id === prev) + 1) % TEMPLATES.length].id)}
                                        className="p-3 bg-gray-50 rounded-full hover:bg-fb-blue hover:text-white transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Theme Color */}
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-5">Theme Color</label>
                                <div className="flex flex-wrap gap-4">
                                    {THEME_COLORS.map(c => (
                                        <button 
                                            key={c.id} 
                                            onClick={() => setThemeColor(c.value)}
                                            style={{ background: c.value }}
                                            className={`w-9 h-9 rounded-xl shadow-lg transition-all transform hover:scale-110 border-2 ${themeColor === c.value ? 'border-fb-navy scale-110' : 'border-white'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Font Choice */}
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-5">Typography</label>
                                <div className="relative">
                                    <select 
                                        value={FONTS.find(f => f.value === fontFamily)?.id} 
                                        onChange={e => setFontFamily(FONTS.find(f => f.id === e.target.value).value)} 
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-black text-fb-navy text-sm shadow-inner appearance-none cursor-pointer"
                                    >
                                        {FONTS.map(f => <option key={f.id} value={f.id}>{f.id} Serif</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-100 space-y-6">
                    <button onClick={() => handleSave('Draft')} className="w-full bg-fb-navy text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-fb-navy/20 hover:brightness-110 active:scale-95 transition-all">Save {documentType}</button>
                </div>
            </aside>
        </div>

        {/* Edit Business Info Modal */}
        {showBusinessModal && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-fb-navy/70 backdrop-blur-md p-4 animate-in fade-in">
                <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[640px] overflow-hidden">
                    <div className="p-16">
                        <div className="flex justify-between items-start mb-12">
                            <h2 className="text-4xl font-black text-fb-navy tracking-tighter">Business Identity</h2>
                            <button onClick={() => setShowBusinessModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={32} className="text-gray-300 hover:text-fb-navy" /></button>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Company Name</label>
                                <input value={businessInfo.name} onChange={e => setBusinessInfo({...businessInfo, name: e.target.value})} className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-black text-fb-navy text-xl focus:ring-4 ring-blue-50 transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Phone</label>
                                    <input value={businessInfo.phone} onChange={e => setBusinessInfo({...businessInfo, phone: e.target.value})} className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-bold text-fb-navy focus:ring-4 ring-blue-50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Location</label>
                                    <input value={businessInfo.country} onChange={e => setBusinessInfo({...businessInfo, country: e.target.value})} className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-bold text-fb-navy focus:ring-4 ring-blue-50 transition-all" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-10 mt-16 pt-10 border-t border-gray-100">
                             <button onClick={() => setShowBusinessModal(false)} className="text-xs font-black text-gray-400 hover:text-fb-navy uppercase tracking-[0.2em]">Cancel</button>
                             <button onClick={() => setShowBusinessModal(false)} className="bg-fb-green text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-fb-green/20 hover:brightness-110 transition-all">Apply Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* New Client Modal */}
        {showNewClientModal && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-fb-navy/70 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
                <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[640px] overflow-hidden">
                    <div className="p-16">
                        <div className="flex justify-between items-start mb-12">
                            <h2 className="text-4xl font-black text-fb-navy tracking-tighter">New Client</h2>
                            <button onClick={() => setShowNewClientModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={32} className="text-gray-300 hover:text-fb-navy" /></button>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Organization Name</label>
                                <input id="new-client-company" className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-black text-fb-navy text-xl focus:ring-4 ring-blue-50 transition-all" placeholder="Acme Corp" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">First Name</label>
                                    <input className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-bold text-fb-navy focus:ring-4 ring-blue-50" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Last Name</label>
                                    <input className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-bold text-fb-navy focus:ring-4 ring-blue-50" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-10 mt-16 pt-10 border-t border-gray-100">
                             <button onClick={() => setShowNewClientModal(false)} className="text-xs font-black text-gray-400 hover:text-fb-navy uppercase tracking-[0.2em]">Discard</button>
                             <button onClick={() => {
                                 const comp = document.getElementById('new-client-company')?.value;
                                 if (comp) handleCreateClient({ company: comp, name: comp, email: '' });
                             }} className="bg-fb-green text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-fb-green/20 hover:brightness-110 transition-all">Create Record</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
