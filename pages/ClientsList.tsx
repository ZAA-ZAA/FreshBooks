import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Mail, Phone, MoreHorizontal, X, CheckCircle2 } from 'lucide-react';

export default function ClientsList() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [clientForm, setClientForm] = useState({ id: 0, firstName: '', lastName: '', company: '', email: '', phone: '' });
    
    // Data State
    const [clients, setClients] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        const storedClients = localStorage.getItem('fb_clients');
        if (storedClients) {
            setClients(JSON.parse(storedClients));
        }
        const storedInvoices = localStorage.getItem('fb_invoices');
        if (storedInvoices) {
            setInvoices(JSON.parse(storedInvoices));
        }
    }, []);

    const saveToLocalStorage = (newClients: any[]) => {
        localStorage.setItem('fb_clients', JSON.stringify(newClients));
        setClients(newClients);
    };

    const handleSave = () => {
        let updatedClients;
        const displayName = clientForm.company || `${clientForm.firstName} ${clientForm.lastName}`;
        
        if (isEdit) {
            updatedClients = clients.map(c => c.id === clientForm.id ? { ...c, name: `${clientForm.firstName} ${clientForm.lastName}`, company: clientForm.company, email: clientForm.email, phone: clientForm.phone } : c);
        } else {
            const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
            const newClient = {
                id: newId,
                name: `${clientForm.firstName} ${clientForm.lastName}`,
                company: clientForm.company || displayName,
                email: clientForm.email,
                phone: clientForm.phone,
            };
            updatedClients = [...clients, newClient];
        }
        
        saveToLocalStorage(updatedClients);
        setIsModalOpen(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setClientForm({ id: 0, firstName: '', lastName: '', company: '', email: '', phone: '' });
        setIsEdit(false);
    };

    const handleEdit = (client: any) => {
        const names = client.name.split(' ');
        setClientForm({
            id: client.id,
            firstName: names[0] || '',
            lastName: names[1] || '',
            company: client.company,
            email: client.email,
            phone: client.phone
        });
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setClientForm({ id: 0, firstName: '', lastName: '', company: '', email: '', phone: '' });
        setIsEdit(false);
        setIsModalOpen(true);
    };

    // Calculate Balances dynamically
    const getClientBalance = (clientName: string) => {
        return invoices
            .filter(inv => inv.client === clientName && inv.status !== 'Paid')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const totalOutstanding = clients.reduce((acc, client) => acc + getClientBalance(client.company), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Client {isEdit ? 'Updated' : 'Created'} Successfully</span>
                </div>
            )}

             {/* Top Action */}
             <div className="absolute top-[-50px] right-0">
                <button 
                    onClick={handleNew}
                    className="bg-fb-green hover:bg-[#33c46b] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                >
                    New Client
                </button>
            </div>

            {/* Stats Header */}
            <div className="grid grid-cols-3 gap-8 mb-8 px-4">
                 <div className="text-center border-r border-gray-200">
                     <div className="text-3xl font-bold text-fb-blue mb-1">{clients.length}</div>
                     <div className="text-sm text-gray-500 font-medium">Active Clients</div>
                 </div>
                 <div className="text-center border-r border-gray-200">
                     <div className="text-3xl font-bold text-fb-blue mb-1">₱{totalOutstanding.toLocaleString()}</div>
                     <div className="text-sm text-gray-500 font-medium">Outstanding Revenue</div>
                 </div>
                 <div className="text-center">
                     <div className="text-3xl font-bold text-fb-blue mb-1">0</div>
                     <div className="text-sm text-gray-500 font-medium">Overdue</div>
                 </div>
            </div>

            {/* List Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-fb-slate">All Clients</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Clients" 
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-fb-blue w-64 focus:ring-1 focus:ring-fb-blue"
                        />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-normal text-gray-500">Client</th>
                                <th className="p-4 font-normal text-gray-500">Contact</th>
                                <th className="p-4 font-normal text-gray-500 text-right">Outstanding Balance</th>
                                <th className="p-4 font-normal text-gray-500 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => {
                                const balance = getClientBalance(client.company);
                                return (
                                    <tr 
                                        key={client.id}
                                        onClick={() => handleEdit(client)}
                                        className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors group"
                                    >
                                        <td className="p-4">
                                            <div className="font-bold text-fb-slate text-lg group-hover:text-fb-blue">{client.company}</div>
                                            <div className="text-gray-500">{client.name}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-gray-600 mb-1">
                                                <Mail size={14} className="mr-2 text-gray-400" /> {client.email}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Phone size={14} className="mr-2 text-gray-400" /> {client.phone}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className={`font-bold ${balance > 0 ? 'text-fb-slate' : 'text-gray-400'}`}>
                                                ₱{balance.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="text-gray-400 hover:text-fb-blue p-2">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No clients found. Click "New Client" to add one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[600px] animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-fb-slate">{isEdit ? 'Edit Client' : 'New Client'}</h2>
                                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-6 flex items-center">
                                <span className="mr-1">ℹ️</span> Either First and Last Name or Company Name is required to save this Client.
                            </p>
    
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

                            <div className="mb-4">
                                 <label className="block text-xs font-bold text-gray-500 mb-1">Phone</label>
                                <input 
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                    value={clientForm.phone}
                                    onChange={e => setClientForm({...clientForm, phone: e.target.value})}
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
                                    {isEdit ? 'Save Changes' : 'Create Client'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}