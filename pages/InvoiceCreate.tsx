import React, { useState, useEffect } from 'react';
import { InvoiceItem } from '../types';
import { Plus, Trash2, Settings, Download, Send, CreditCard, Calendar, ChevronDown, Image as ImageIcon, X, Mail, ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function InvoiceCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get ID from URL
  const isNew = location.pathname.includes('new');
  const isEstimate = location.pathname.includes('estimate');
  const documentType = isEstimate ? 'Estimate' : 'Invoice';
  
  // -- State --
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [reference, setReference] = useState('');
  const [client, setClient] = useState<any>(null); 
  const [items, setItems] = useState<InvoiceItem[]>(
      [{ id: '1', name: '', description: '', rate: 0, qty: 1, tax: false }]
  );
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  
  // Data State
  const [existingClients, setExistingClients] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);

  // Modals & Panels
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientForm, setClientForm] = useState({ firstName: '', lastName: '', company: '', email: '', phone: '' });
  
  // Toast
  const [showToast, setShowToast] = useState(false);

  // Init Data
  useEffect(() => {
    // 1. Load Global Data
    const storedClients = localStorage.getItem('fb_clients');
    let clientsList: any[] = [];
    if (storedClients) {
        clientsList = JSON.parse(storedClients);
        setExistingClients(clientsList);
    }

    const storedItems = localStorage.getItem('fb_items');
    if (storedItems) setSavedItems(JSON.parse(storedItems));

    // 2. Handle New vs Edit Mode
    if (isNew) {
        // Generate Next Number
        const storageKey = isEstimate ? 'fb_estimates' : 'fb_invoices';
        const documents = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const nextNum = (documents.length + 1).toString().padStart(7, '0');
        setDocNumber(nextNum);
        
        // Default Due Date (30 days)
        const d = new Date();
        d.setDate(d.getDate() + 30);
        setDueDate(d.toISOString().split('T')[0]);

    } else if (id) {
        // LOAD EXISTING DATA
        const storageKey = isEstimate ? 'fb_estimates' : 'fb_invoices';
        const documents = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const doc = documents.find((d: any) => d.id === id);

        if (doc) {
            setDocNumber(doc.number);
            setIssueDate(doc.date);
            setDueDate(doc.dateDue || '');
            setReference(doc.reference || '');
            setNotes(doc.notes || '');
            setTerms(doc.terms || '');
            
            // Restore Items
            if (doc.items && doc.items.length > 0) {
                setItems(doc.items);
            }

            // Restore Client (Match by company name string to full object)
            if (doc.client) {
                const matchedClient = clientsList.find((c: any) => c.company === doc.client);
                if (matchedClient) {
                    setClient(matchedClient);
                } else {
                    // Fallback if client was deleted but name remains on invoice
                    setClient({ company: doc.client, email: '', name: '' }); 
                }
            }
        }
    }
  }, [isNew, isEstimate, id]);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.rate * item.qty), 0);
  const discountAmount = 0; 
  const TAX_RATE = 0.12; 
  const taxTotal = items.reduce((acc, item) => acc + (item.tax ? (item.rate * item.qty * TAX_RATE) : 0), 0);
  const total = subtotal + taxTotal;
  
  // Handlers
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    let newItem = { ...items.find(i => i.id === id)!, [field]: value };
    
    // Autocomplete Logic for Name
    if (field === 'name') {
        const matched = savedItems.find(si => si.name.toLowerCase() === value.toLowerCase());
        if (matched) {
            newItem.description = matched.description;
            newItem.rate = matched.rate;
        }
    }

    setItems(items.map(item => item.id === id ? newItem : item));
  };

  const toggleTax = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, tax: !item.tax } : item));
  };
  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', description: '', rate: 0, qty: 1, tax: false }]);
  };
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleEditClient = () => {
      if (client) {
          const names = (client.name || '').split(' ');
          setClientForm({
              firstName: names[0] || '',
              lastName: names[1] || '',
              company: client.company || '',
              email: client.email || '',
              phone: client.phone || ''
          });
      } else {
          setClientForm({ firstName: '', lastName: '', company: '', email: '', phone: '' });
      }
      setIsClientModalOpen(true);
  };

  const handleSaveClient = () => {
      const displayName = clientForm.company || `${clientForm.firstName} ${clientForm.lastName}`;
      const newClient = {
          id: Date.now(),
          name: `${clientForm.firstName} ${clientForm.lastName}`,
          company: clientForm.company || displayName,
          email: clientForm.email,
          phone: clientForm.phone,
          balance: 0
      };
      
      const updatedClients = [...existingClients, newClient];
      setExistingClients(updatedClients);
      localStorage.setItem('fb_clients', JSON.stringify(updatedClients));
      
      setClient(newClient);
      setIsClientModalOpen(false);
  };

  const selectClient = (c: any) => {
      setClient(c);
      setIsClientDropdownOpen(false);
  };
  
  const handleSave = (status: string = 'Draft') => {
      const storageKey = isEstimate ? 'fb_estimates' : 'fb_invoices';
      const storedDocs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const docData = {
          id: id || Date.now().toString(), // Use existing ID if editing
          number: docNumber,
          client: client ? client.company : 'Unknown Client',
          date: issueDate,
          dateDue: dueDate,
          reference: reference,
          amount: total,
          status: status,
          description: items[0]?.name || documentType,
          items: items, // Save full items array
          notes: notes,
          terms: terms
      };

      let updatedDocs;
      if (id && !isNew) {
          // Update existing
          updatedDocs = storedDocs.map((d: any) => d.id === id ? docData : d);
      } else {
          // Create new
          updatedDocs = [...storedDocs, docData];
      }
      
      localStorage.setItem(storageKey, JSON.stringify(updatedDocs));

      setShowToast(true);
      setTimeout(() => {
          navigate(isEstimate ? '/estimates' : '/invoices');
      }, 1500);
  };

  return (
    // Replaced fixed height container with relative container to allow natural scrolling from parent
    <div className="relative min-h-full">
        {/* Background Overlay to match design color */}
        <div className="absolute inset-0 bg-[#d3dae3] -z-10 -m-8 min-h-[calc(100%+4rem)]"></div>

        {/* === TOAST NOTIFICATION === */}
        {showToast && (
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[60] bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                <CheckCircle2 className="text-fb-green mr-3" size={20} />
                <span className="font-bold">{documentType} Saved Successfully</span>
            </div>
        )}

        {/* === MAIN EDITOR AREA === */}
        <div className="flex justify-center pb-20 pt-4">
             <div className="w-full max-w-[900px]">
                
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center space-x-2">
                        <button onClick={() => navigate(-1)} className="md:hidden mr-2"><ArrowLeft /></button>
                        <h2 className="text-3xl font-bold text-fb-slate">{isNew ? `New ${documentType}` : `Edit ${documentType}`}</h2>
                    </div>
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                         <button onClick={() => navigate(isEstimate ? '/estimates' : '/dashboard')} className="font-bold text-gray-500 hover:text-gray-700 px-2 md:px-4 text-sm hidden md:block">Cancel</button>
                         <button 
                            onClick={() => handleSave('Draft')}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 rounded font-bold shadow-sm transition-all text-sm"
                         >
                            Save Draft
                         </button>
                         <button 
                            onClick={() => handleSave('Sent')}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-fb-green hover:bg-[#33c46b] text-white rounded font-bold shadow-sm transition-all flex items-center justify-center text-sm"
                         >
                            <Mail size={16} className="mr-2" /> Send To...
                         </button>
                    </div>
                </div>

                {/* INVOICE PAPER */}
                <div className="bg-white rounded-lg shadow-xl min-h-[1000px] p-6 md:p-12 relative animate-in zoom-in-95 duration-300">
                    
                    {/* Top Row: Logo & Address */}
                    <div className="flex flex-col md:flex-row justify-between mb-12">
                        {/* Logo Zone */}
                        <div className="w-full md:w-[300px] h-[180px] border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-gray-100 transition-colors group mb-6 md:mb-0">
                            <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <ImageIcon className="text-gray-400" />
                            </div>
                            <p className="font-bold text-sm text-fb-slate">Drag your logo here,</p>
                            <p className="text-sm text-gray-500">or <span className="text-fb-blue">select a file</span></p>
                        </div>
                        
                        {/* My Address Mock */}
                        <div className="text-left md:text-right text-sm">
                            <p className="font-bold text-gray-800 text-lg">Demo Company</p>
                            <p className="text-gray-500">123 Business Rd</p>
                            <p className="text-gray-500">Tech City, 10001</p>
                            <button className="text-fb-blue text-xs mt-1 hover:underline">Edit Business Information</button>
                        </div>
                    </div>

                    {/* Meta Row: Billed To | Dates | Amounts */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                        {/* Billed To */}
                        <div className="col-span-12 md:col-span-4 relative">
                            <label className="text-gray-500 text-xs block mb-1">Billed To</label>
                            {client ? (
                                <div className="group relative">
                                    <p className="font-bold text-fb-slate text-lg">{client.company || `${client.firstName} ${client.lastName}`}</p>
                                    <p className="text-sm text-gray-600">{client.email}</p>
                                    <div className="mt-2 text-xs space-x-2">
                                        <button onClick={handleEditClient} className="text-fb-blue hover:underline">Edit Client</button>
                                        <button onClick={() => setClient(null)} className="text-red-500 hover:underline">Remove Client</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div 
                                        onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                                        className="border border-gray-300 rounded p-3 bg-white cursor-pointer hover:border-gray-400 transition-colors flex justify-between items-center group"
                                    >
                                        <span className="text-gray-400 text-sm group-hover:text-gray-600">Select a Client</span>
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </div>
                                    
                                    {/* Client Dropdown */}
                                    {isClientDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl rounded-b z-20 mt-1 animate-in fade-in zoom-in-95 duration-100">
                                            <div className="p-2 border-b border-gray-100">
                                                <div className="flex items-center bg-gray-50 p-2 rounded">
                                                    <Search size={14} className="text-gray-400 mr-2" />
                                                    <input className="bg-transparent text-sm outline-none w-full" placeholder="Search clients..." autoFocus />
                                                </div>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto">
                                                {existingClients.map(c => (
                                                    <div key={c.id} onClick={() => selectClient(c)} className="p-3 hover:bg-blue-50 cursor-pointer text-sm">
                                                        <div className="font-bold text-fb-slate">{c.company}</div>
                                                        <div className="text-xs text-gray-500">{c.email}</div>
                                                    </div>
                                                ))}
                                                {existingClients.length === 0 && (
                                                    <div className="p-3 text-xs text-gray-500 italic">No clients found.</div>
                                                )}
                                            </div>
                                            <div 
                                                onClick={() => { 
                                                    setIsClientDropdownOpen(false); 
                                                    setClientForm({ firstName: '', lastName: '', company: '', email: '', phone: '' }); 
                                                    setIsClientModalOpen(true); 
                                                }}
                                                className="p-3 border-t border-gray-100 text-fb-green font-bold text-sm cursor-pointer hover:bg-green-50 flex items-center"
                                            >
                                                <Plus size={14} className="mr-2" /> Create New Client
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Invoice Details */}
                        <div className="col-span-12 md:col-span-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-500 text-xs block mb-1">Date of Issue</label>
                                    <input 
                                        type="date" 
                                        value={issueDate} 
                                        onChange={(e) => setIssueDate(e.target.value)}
                                        className="w-full font-medium text-fb-slate bg-transparent outline-none hover:bg-gray-50 p-1 rounded transition-colors cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-500 text-xs block mb-1">{documentType} Number</label>
                                    <input 
                                        type="text" 
                                        value={docNumber} 
                                        onChange={(e) => setDocNumber(e.target.value)}
                                        className="w-full font-medium text-fb-slate bg-transparent outline-none hover:bg-gray-50 p-1 rounded transition-colors"
                                    />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                {isEstimate && (
                                    <div>
                                        <label className="text-gray-500 text-xs block mb-1">Valid Until</label>
                                        <input 
                                            type="date" 
                                            value={dueDate} 
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full font-medium text-fb-slate bg-transparent outline-none hover:bg-gray-50 p-1 rounded transition-colors cursor-pointer"
                                        />
                                    </div>
                                )}
                                {!isEstimate && (
                                    <div>
                                        <label className="text-gray-500 text-xs block mb-1">Due Date</label>
                                        <input 
                                            type="date" 
                                            value={dueDate} 
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full font-medium text-fb-slate bg-transparent outline-none hover:bg-gray-50 p-1 rounded transition-colors cursor-pointer"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="text-gray-500 text-xs block mb-1">Reference</label>
                                    <input 
                                        type="text" 
                                        value={reference} 
                                        onChange={(e) => setReference(e.target.value)}
                                        placeholder="Enter value (e.g. PO #)"
                                        className="w-full font-medium text-gray-600 placeholder-gray-300 bg-transparent outline-none hover:bg-gray-50 p-1 rounded transition-colors text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Amount Due Big */}
                        <div className="col-span-12 md:col-span-4 md:text-right">
                             <label className="text-gray-500 text-xs block mb-1">Amount Due (PHP)</label>
                             <div className="text-5xl font-bold text-fb-slate">₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-800 mb-2" />

                    {/* Items Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 mb-4 px-2">
                        <div className="col-span-6">Description</div>
                        <div className="col-span-2 text-right">Rate</div>
                        <div className="col-span-2 text-right">Qty</div>
                        <div className="col-span-2 text-right">Line Total</div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1 mb-8">
                         {items.map((item) => (
                             <div key={item.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-2 hover:bg-gray-50 rounded px-2 relative border border-transparent hover:border-gray-200 transition-all">
                                 <div className="col-span-1 md:col-span-6 space-y-1 relative">
                                     <input 
                                        value={item.name}
                                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                        className="w-full font-bold text-fb-slate bg-transparent outline-none placeholder-gray-300 focus:text-fb-blue"
                                        placeholder="Enter an Item Name"
                                        list={`items-list-${item.id}`} // Auto-complete
                                     />
                                     <datalist id={`items-list-${item.id}`}>
                                        {savedItems.map(si => (
                                            <option key={si.id} value={si.name} />
                                        ))}
                                     </datalist>

                                     <textarea 
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                        className="w-full text-sm text-gray-600 bg-transparent outline-none resize-none overflow-hidden placeholder-gray-300"
                                        rows={1}
                                        placeholder="Enter an Item Description"
                                     />
                                 </div>
                                 <div className="col-span-1 md:col-span-2 text-right flex md:block items-center justify-between">
                                      <span className="md:hidden text-xs font-bold text-gray-500">Rate:</span>
                                      <div className="w-1/2 md:w-full">
                                          <input 
                                            type="number"
                                            value={item.rate}
                                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                            className="w-full text-right bg-transparent outline-none font-medium"
                                         />
                                         <button 
                                            onClick={() => toggleTax(item.id)}
                                            className={`text-[10px] hover:underline block ml-auto mt-1 transition-opacity ${item.tax ? 'text-fb-green opacity-100 font-bold' : 'text-fb-blue opacity-100 md:opacity-0 group-hover:opacity-100'}`}
                                        >
                                            {item.tax ? 'VAT (12%)' : 'Add Taxes'}
                                         </button>
                                      </div>
                                 </div>
                                 <div className="col-span-1 md:col-span-2 text-right flex md:block items-center justify-between">
                                      <span className="md:hidden text-xs font-bold text-gray-500">Qty:</span>
                                      <input 
                                        type="number"
                                        value={item.qty}
                                        onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                        className="w-1/2 md:w-full text-right bg-transparent outline-none font-medium"
                                     />
                                 </div>
                                 <div className="col-span-1 md:col-span-2 text-right font-bold text-fb-slate flex md:block items-center justify-between">
                                     <span className="md:hidden text-xs font-bold text-gray-500">Total:</span>
                                     ₱{(item.rate * item.qty).toFixed(2)}
                                 </div>

                                 {/* Trash Icon */}
                                 <button 
                                    onClick={() => removeItem(item.id)}
                                    className="absolute right-0 top-0 md:right-[-30px] md:top-3 p-2 text-gray-300 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                     <Trash2 size={16} />
                                 </button>
                             </div>
                         ))}
                    </div>

                    {/* Add Line */}
                    <div 
                        onClick={addItem}
                        className="border-2 border-dashed border-gray-300 rounded p-4 flex items-center justify-center text-fb-slate font-bold cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors mb-12"
                    >
                        <Plus size={20} className="mr-2" /> Add a Line
                    </div>

                    {/* Footer Totals */}
                    <div className="flex justify-end mb-12">
                        <div className="w-full md:w-1/3 space-y-3">
                             <div className="flex justify-between text-sm">
                                 <span>Subtotal</span>
                                 <span>{subtotal.toFixed(2)}</span>
                             </div>
                             {taxTotal > 0 && (
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Taxes</span>
                                    <span>{taxTotal.toFixed(2)}</span>
                                </div>
                             )}
                             <div className="flex justify-between text-sm text-fb-blue cursor-pointer hover:underline">
                                 <span>Add a Discount</span>
                                 <span>hidden (2%) {discountAmount.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-sm border-b border-gray-200 pb-3">
                                 <span>Total</span>
                                 <span>{total.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between font-bold text-fb-slate pt-1">
                                 <span>Amount Paid</span>
                                 <span>0.00</span>
                             </div>
                             <div className="flex justify-between font-bold text-fb-slate text-lg border-t border-gray-300 pt-3 mt-3">
                                 <span>Amount Due (PHP)</span>
                                 <span>₱{total.toFixed(2)}</span>
                             </div>
                             
                             {!isEstimate && (
                                <div className="pt-4 space-y-2 text-right">
                                    <div className="text-fb-blue text-sm cursor-pointer hover:underline">Request a Deposit</div>
                                    <div className="text-fb-blue text-sm cursor-pointer hover:underline">Add a Payment Schedule</div>
                                </div>
                             )}
                        </div>
                    </div>

                    {/* Notes & Terms */}
                    <div className="mb-12 space-y-6">
                        <div>
                            <label className="text-xs text-gray-500 block mb-2">Notes</label>
                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-2 border border-transparent hover:border-gray-300 rounded bg-transparent focus:border-fb-blue outline-none transition-colors text-sm"
                                placeholder="Enter notes (optional)"
                                rows={2}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-2">Terms</label>
                            <textarea 
                                value={terms}
                                onChange={(e) => setTerms(e.target.value)}
                                className="w-full p-2 border border-transparent hover:border-gray-300 rounded bg-transparent focus:border-fb-blue outline-none transition-colors text-sm"
                                placeholder="Enter your terms and conditions..."
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Attachments */}
                    <div>
                        <h3 className="font-bold text-fb-slate mb-4">Attachments</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded bg-gray-50 p-6 flex items-center justify-center text-sm font-bold text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors group">
                            <Plus size={16} className="mr-2 group-hover:text-fb-blue" /> Add an attachment
                        </div>
                    </div>

                </div>
             </div>
        </div>

        {/* === CREATE CLIENT MODAL === */}
        {isClientModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-[600px] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-fb-slate">Add New Client</h2>
                            <button onClick={() => setIsClientModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">First Name</label>
                                <input 
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                    value={clientForm.firstName}
                                    onChange={e => setClientForm({...clientForm, firstName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Last Name</label>
                                <input 
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                    value={clientForm.lastName}
                                    onChange={e => setClientForm({...clientForm, lastName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Company Name</label>
                            <input 
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                value={clientForm.company}
                                onChange={e => setClientForm({...clientForm, company: e.target.value})}
                            />
                        </div>

                        <div className="mb-4">
                             <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                            <input 
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                value={clientForm.email}
                                onChange={e => setClientForm({...clientForm, email: e.target.value})}
                            />
                        </div>

                        <div className="flex justify-end space-x-4 mt-8">
                            <button 
                                onClick={() => setIsClientModalOpen(false)}
                                className="font-bold text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveClient}
                                className="bg-fb-green hover:bg-[#33c46b] text-white font-bold py-2 px-6 rounded shadow-sm"
                            >
                                Save Client
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}