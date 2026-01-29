// @ts-nocheck
import React, { useState } from 'react';
import { Plug, Search, ExternalLink, CheckCircle2, ChevronRight, Filter, Zap, LayoutGrid, List } from 'lucide-react';

const AppCard = ({ name, category, color, description, onConnect }: { name: string, category: string, color: string, description: string, onConnect: (name: string) => void }) => (
    <div className="bg-white border border-gray-100 rounded-[32px] p-10 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden border-b-8 border-b-fb-blue shadow-sm">
        <div className="flex justify-between items-start mb-10 relative z-10">
             <div className={`w-16 h-16 rounded-[20px] ${color} flex items-center justify-center text-white font-black text-3xl shadow-xl group-hover:scale-110 transition-transform`}>
                {name[0]}
            </div>
            <div className="bg-gray-50 px-3 py-1 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">{category}</div>
        </div>
        
        <div className="relative z-10 flex-1">
            <h4 className="font-black text-fb-navy text-2xl mb-3 group-hover:text-fb-blue transition-colors">{name}</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">{description}</p>
        </div>

        <div className="mt-auto relative z-10">
            <button 
                onClick={() => onConnect(name)}
                className="w-full py-4 border-2 border-fb-blue/10 rounded-xl font-black text-fb-blue text-sm hover:bg-fb-blue hover:text-white hover:border-fb-blue transition-all uppercase tracking-widest"
            >
                Authorize Link
            </button>
        </div>
        
        <div className="absolute -bottom-4 -right-4 opacity-[0.01] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
            <Plug size={180} />
        </div>
    </div>
);

export default function AppsList() {
    const [showToast, setShowToast] = useState(false);
    const [connectedApp, setConnectedApp] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Apps');

    const handleConnect = (name: string) => {
        setConnectedApp(name);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const categories = ['All Apps', 'Payments', 'Payroll', 'Communication', 'CRM', 'E-Commerce', 'Automation'];
    
    const apps = [
        { name: 'Stripe', category: 'Payments', color: 'bg-indigo-600', desc: 'Securely accept credit cards and ACH payments directly on your invoices.' },
        { name: 'Gusto', category: 'Payroll', color: 'bg-orange-500', desc: 'Sync your payroll data and pay your team without ever leaving FreshBooks.' },
        { name: 'Slack', category: 'Communication', color: 'bg-purple-600', desc: 'Get instant notifications for invoice updates and project milestones in your workspace.' },
        { name: 'Shopify', category: 'E-Commerce', color: 'bg-emerald-500', desc: 'Automatically import orders and sync inventory for seamless bookkeeping.' },
        { name: 'HubSpot', category: 'CRM', color: 'bg-orange-600', desc: 'Maintain unified client data across marketing and accounting workflows.' },
        { name: 'Zapier', category: 'Automation', color: 'bg-orange-400', desc: 'Connect to over 5,000+ apps and automate almost any repetitive task.' },
        { name: 'PayPal', category: 'Payments', color: 'bg-blue-600', desc: 'Offer your clients the flexibility to pay with the worlds most popular digital wallet.' },
        { name: 'Square', category: 'Payments', color: 'bg-zinc-800', desc: 'Sync physical sales and digital invoices into one consolidated revenue stream.' },
    ];

    const filteredApps = activeCategory === 'All Apps' ? apps : apps.filter(a => a.category === activeCategory);

    return (
        <div className="space-y-12 animate-in fade-in duration-300 pb-20 relative">
             {/* Toast */}
             {showToast && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-[#28303f] text-white px-8 py-3 rounded-xl shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={24} />
                    <span className="font-bold">Integration Authenticated: {connectedApp}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                     <h1 className="text-5xl font-black text-fb-navy tracking-tighter">Integrations</h1>
                     <p className="text-gray-400 font-bold mt-2">Scale your capabilities with 100+ professional app connections</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search App Marketplace" 
                            className="pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none w-80 text-sm font-bold shadow-sm transition-all" 
                        />
                    </div>
                    <button className="bg-fb-navy hover:bg-fb-slate text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-fb-navy/20 transition-all flex items-center gap-3 active:scale-95">
                         My Connections <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Featured Banner */}
            <div className="bg-[#002a63] rounded-[40px] p-16 text-white relative overflow-hidden group shadow-2xl shadow-fb-navy/30">
                 <div className="relative z-10 max-w-xl">
                    <div className="bg-fb-blue px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-8 shadow-lg">New Integration</div>
                    <h2 className="text-5xl font-black mb-8 leading-tight tracking-tighter">Supercharge with Stripe Connect</h2>
                    <p className="text-xl text-blue-100 mb-10 leading-relaxed font-medium">Experience faster settlements and instant bank transfers by enabling the advanced Stripe processing engine.</p>
                    <button className="bg-white text-fb-navy px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl shadow-white/10 active:scale-95">Link Stripe Account</button>
                 </div>
                 <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000 hidden lg:block">
                     <Zap size={320} strokeWidth={1} className="text-blue-300" />
                 </div>
            </div>

            {/* Categories Shelf */}
            <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide border-b border-gray-100">
                {categories.map((cat) => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)}
                        className={`px-8 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-fb-blue text-white shadow-lg' : 'bg-fb-gray text-gray-400 hover:text-fb-navy'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {filteredApps.map((app, i) => (
                    <AppCard 
                        key={i} 
                        name={app.name} 
                        category={app.category} 
                        color={app.color} 
                        description={app.desc}
                        onConnect={handleConnect} 
                    />
                ))}
                {filteredApps.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300"><Search size={32} /></div>
                        <p className="text-gray-400 font-black text-2xl italic tracking-tight">No apps matching this category yet</p>
                        <button onClick={() => setActiveCategory('All Apps')} className="text-fb-blue font-bold text-sm mt-4 hover:underline">View All Apps</button>
                    </div>
                )}
            </div>
            
            <div className="text-center py-10">
                <button className="text-fb-navy font-black text-lg flex items-center justify-center mx-auto hover:underline underline-offset-8 decoration-fb-blue decoration-2 group">
                    Explore Advanced Developer API <ExternalLink size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}