import React, { useState } from 'react';
import { Plug, Search, ExternalLink, CheckCircle2 } from 'lucide-react';

const AppCard = ({ name, category, color, onConnect }: { name: string, category: string, color: string, onConnect: (name: string) => void }) => (
    <div className="bg-white border border-gray-200 rounded p-6 hover:shadow-md transition-shadow cursor-pointer flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white font-bold text-xl`}>
            {name[0]}
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-fb-slate">{name}</h4>
            <p className="text-xs text-gray-500">{category}</p>
        </div>
        <button 
            onClick={() => onConnect(name)}
            className="text-fb-blue text-sm font-bold border border-fb-blue rounded px-3 py-1 hover:bg-blue-50"
        >
            Connect
        </button>
    </div>
);

export default function AppsList() {
    const [showToast, setShowToast] = useState(false);
    const [connectedApp, setConnectedApp] = useState('');

    const handleConnect = (name: string) => {
        setConnectedApp(name);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[60] bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Connected to {connectedApp} Successfully</span>
                </div>
            )}

             {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                     <h2 className="text-2xl font-bold text-fb-slate">Apps & Integrations</h2>
                     <p className="text-gray-500 mt-1">Supercharge your business with 100+ integrations</p>
                </div>
                <div className="relative mt-4 md:mt-0">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search Apps" 
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-fb-blue w-64 focus:ring-1 focus:ring-fb-blue"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex space-x-2 overflow-x-auto pb-4 border-b border-gray-200">
                {['All Apps', 'Payments', 'Payroll', 'Marketing', 'CRM', 'E-Commerce'].map((cat, i) => (
                    <button 
                        key={cat} 
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${i === 0 ? 'bg-fb-slate text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AppCard name="Stripe" category="Payments" color="bg-indigo-500" onConnect={handleConnect} />
                <AppCard name="Gusto" category="Payroll" color="bg-orange-500" onConnect={handleConnect} />
                <AppCard name="Slack" category="Communication" color="bg-purple-600" onConnect={handleConnect} />
                <AppCard name="Shopify" category="E-Commerce" color="bg-green-500" onConnect={handleConnect} />
                <AppCard name="HubSpot" category="CRM" color="bg-orange-600" onConnect={handleConnect} />
                <AppCard name="Mailchimp" category="Marketing" color="bg-yellow-400" onConnect={handleConnect} />
                <AppCard name="Zapier" category="Automation" color="bg-orange-500" onConnect={handleConnect} />
                <AppCard name="PayPal" category="Payments" color="bg-blue-600" onConnect={handleConnect} />
                <AppCard name="Square" category="Payments" color="bg-gray-800" onConnect={handleConnect} />
            </div>
            
            <div className="text-center py-8">
                <button className="text-fb-blue font-bold flex items-center justify-center mx-auto hover:underline">
                    View All Integrations <ExternalLink size={14} className="ml-1" />
                </button>
            </div>
        </div>
    );
}