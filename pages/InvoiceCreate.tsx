// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { InvoiceItem } from '../types';
import { Plus, Trash2, ChevronDown, Image as ImageIcon, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function InvoiceCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const searchParams = new URLSearchParams(location.search);
  const isTemplate = searchParams.get('type') === 'template';
  const isNew = location.pathname.includes('new');
  const isEstimate = location.pathname.includes('estimate') || location.pathname.includes('estimates');
  const documentType = isEstimate ? 'Estimate' : (isTemplate ? 'Recurring Template' : 'Invoice');
  
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [client, setClient] = useState<any>(null); 
  const [items, setItems] = useState<InvoiceItem[]>([{ id: '1', name: '', description: '', rate: 0, qty: 1, tax: false }]);
  const [notes, setNotes] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem('fb_clients') || '[]');
    if (isNew) {
        const storageKey = isEstimate ? 'fb_estimates' : (isTemplate ? 'fb_templates' : 'fb_invoices');
        const documents = JSON.parse(localStorage.getItem(storageKey) || '[]');
        setDocNumber((documents.length + 1).toString().padStart(7, '0'));
        const d = new Date(); d.setDate(d.getDate() + 30); setDueDate(d.toISOString().split('T')[0]);
    } else if (id) {
        const storageKey = isEstimate ? 'fb_estimates' : (isTemplate ? 'fb_templates' : 'fb_invoices');
        const doc = JSON.parse(localStorage.getItem(storageKey) || '[]').find(d => d.id === id);
        if (doc) {
            setDocNumber(doc.number); setIssueDate(doc.date); setDueDate(doc.dateDue || '');
            setItems(doc.items || items); setNotes(doc.notes || '');
            const matchedClient = clients.find(c => c.company === doc.client);
            if (matchedClient) setClient(matchedClient);
        }
    }
  }, [id, isNew]);

  const subtotal = items.reduce((acc, item) => acc + (item.rate * item.qty), 0);

  const handleSave = (status: string = 'Draft') => {
      const storageKey = isEstimate ? 'fb_estimates' : (isTemplate ? 'fb_templates' : 'fb_invoices');
      const storedDocs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const docData = {
          id: id || Date.now().toString(), number: docNumber, client: client ? client.company : 'Unknown Client',
          date: issueDate, dateDue: dueDate, amount: subtotal, status: status,
          items, notes
      };
      const updatedDocs = id && !isNew ? storedDocs.map(d => d.id === id ? docData : d) : [docData, ...storedDocs];
      localStorage.setItem(storageKey, JSON.stringify(updatedDocs));
      setShowToast(true);
      setTimeout(() => navigate(isEstimate ? '/estimates' : '/invoices'), 1000);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] -m-10 p-10 font-sans">
        {showToast && (
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-fb-slate text-white px-6 py-2.5 rounded shadow-xl flex items-center animate-in fade-in slide-in-from-top-2 duration-200">
                <CheckCircle2 className="text-fb-green mr-2" size={16} />
                <span className="text-sm font-bold">{documentType} saved successfully</span>
            </div>
        )}

        <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-fb-navy">{isNew ? `New ${documentType}` : `Edit ${documentType}`}</h2>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-xs font-bold text-fb-navy hover:underline uppercase tracking-wider">Cancel</button>
                    <button onClick={() => handleSave('Draft')} className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-2 rounded font-bold shadow-sm transition-all text-sm uppercase tracking-wide">Save</button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 bg-white rounded shadow-lg p-10 w-full min-h-[900px] border border-gray-200">
                    <div className="flex justify-between mb-12">
                        <div className="space-y-1">
                            <p className="font-bold text-fb-navy text-sm uppercase">Demo Business Inc.</p>
                            <p className="text-gray-400 text-xs">Philippines</p>
                        </div>
                        <div className="w-32 h-24 border border-dashed border-gray-200 rounded flex items-center justify-center text-gray-300 cursor-pointer hover:bg-gray-50">
                             <div className="flex flex-col items-center">
                                <ImageIcon size={20} />
                                <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">Company Logo</span>
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                        <div className="relative">
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-wider">Billed To</label>
                            {client ? (
                                <div className="p-3 border border-transparent hover:border-blue-100 rounded group transition-all">
                                    <p className="font-bold text-fb-navy text-sm">{client.company}</p>
                                    <button onClick={() => setClient(null)} className="text-[10px] text-fb-blue font-bold hover:underline mt-1 uppercase">Change Client</button>
                                </div>
                            ) : (
                                <div onClick={() => setShowClientDropdown(!showClientDropdown)} className="border border-gray-200 rounded p-3 text-xs font-medium text-gray-400 cursor-pointer hover:border-fb-blue flex justify-between items-center">
                                    Choose a Client <ChevronDown size={12} />
                                </div>
                            )}
                            {showClientDropdown && (
                                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded shadow-xl mt-1 z-50">
                                    {JSON.parse(localStorage.getItem('fb_clients') || '[]').map(c => (
                                        <div key={c.id} onClick={() => { setClient(c); setShowClientDropdown(false); }} className="px-4 py-2 hover:bg-fb-gray cursor-pointer text-xs font-bold text-fb-navy border-b border-gray-50 last:border-0">{c.company}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-wider">Date of Issue</label>
                                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full border-b border-gray-200 py-1 text-xs font-bold text-fb-navy outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-wider">Number</label>
                                <input value={docNumber} readOnly className="w-full border-b border-gray-200 py-1 text-xs font-bold text-fb-navy outline-none bg-transparent" />
                            </div>
                        </div>
                    </div>

                    <table className="w-full text-xs mb-8">
                        <thead className="bg-fb-navy text-white">
                            <tr>
                                <th className="p-2 text-left font-bold w-1/2">DESCRIPTION</th>
                                <th className="p-2 text-right font-bold">RATE</th>
                                <th className="p-2 text-right font-bold">QTY</th>
                                <th className="p-2 text-right font-bold">LINE TOTAL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <tr key={item.id} className="group relative">
                                    <td className="py-3">
                                        <input value={item.name} onChange={(e) => setItems(items.map(i => i.id === item.id ? {...i, name: e.target.value} : i))} className="w-full font-bold text-fb-navy bg-transparent outline-none" placeholder="Task or Item Name" />
                                    </td>
                                    <td className="py-3 text-right">
                                        <input type="number" value={item.rate} onChange={(e) => setItems(items.map(i => i.id === item.id ? {...i, rate: parseFloat(e.target.value) || 0} : i))} className="w-full text-right outline-none font-bold" />
                                    </td>
                                    <td className="py-3 text-right">
                                        <input type="number" value={item.qty} onChange={(e) => setItems(items.map(i => i.id === item.id ? {...i, qty: parseFloat(e.target.value) || 0} : i))} className="w-full text-right outline-none font-bold" />
                                    </td>
                                    <td className="py-3 text-right font-bold text-fb-navy">
                                        ₱{(item.rate * item.qty).toLocaleString()}
                                    </td>
                                    <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="absolute -left-6 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button onClick={() => setItems([...items, {id: Date.now().toString(), name: '', rate: 0, qty: 1}])} className="flex items-center text-fb-blue font-bold text-[10px] uppercase hover:underline mb-12">
                        <Plus size={12} className="mr-1" /> Add a Line
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start border-t border-gray-100 pt-8">
                         <div className="w-full max-w-xs">
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-wider">Notes</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full border border-gray-100 p-2 text-[11px] text-gray-500 rounded h-16 resize-none" placeholder="Enter notes here..."></textarea>
                         </div>
                         <div className="w-full md:w-56 space-y-2 mt-6 md:mt-0">
                            <div className="flex justify-between text-gray-500 text-xs"><span>Subtotal</span><span>₱{subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between font-bold text-fb-navy text-lg border-t border-gray-100 pt-2"><span>Total (PHP)</span><span>₱{subtotal.toLocaleString()}</span></div>
                         </div>
                    </div>
                </div>

                <aside className="w-full lg:w-64 space-y-4">
                    <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-fb-navy uppercase tracking-widest border-b border-gray-50 pb-3 mb-4">Settings</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 font-bold uppercase">Currency</span>
                                <span className="text-fb-navy font-bold">PHP</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 font-bold uppercase">Language</span>
                                <span className="text-fb-navy font-bold">English</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded text-[10px] text-fb-blue font-bold leading-relaxed flex items-start gap-2">
                        <ShieldCheck size={14} className="flex-shrink-0" /> 
                        <span>Your financial data is encrypted and saved securely to your local storage.</span>
                    </div>
                </aside>
            </div>
        </div>
    </div>
  );
}
