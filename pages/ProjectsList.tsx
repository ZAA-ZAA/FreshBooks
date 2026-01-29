// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Users, Clock, Folder, X, CheckCircle2, 
    MoreVertical, Trash2, Pencil, Search, Filter, 
    Zap, Calendar, LayoutGrid, List
} from 'lucide-react';

export default function ProjectsList() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [projectTitle, setProjectTitle] = useState('');
    const [clientName, setClientName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        const stored = localStorage.getItem('fb_projects');
        if (stored) setProjects(JSON.parse(stored));
    }, []);

    const handleSave = () => {
        let updated;
        if (editingProject) {
            updated = projects.map(p => p.id === editingProject.id ? { ...p, title: projectTitle, client: clientName, dueDate } : p);
        } else {
            const project = {
                id: Date.now(),
                title: projectTitle,
                client: clientName || 'General Internal',
                status: 'Active',
                hours: 0,
                team: 1,
                dueDate: dueDate || 'Flexible'
            };
            updated = [project, ...projects];
        }
        
        setProjects(updated);
        localStorage.setItem('fb_projects', JSON.stringify(updated));
        setIsModalOpen(false);
        setEditingProject(null);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setProjectTitle(''); setClientName(''); setDueDate('');
    };

    const handleEdit = (proj) => {
        setEditingProject(proj);
        setProjectTitle(proj.title);
        setClientName(proj.client);
        setDueDate(proj.dueDate);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Archive this project?')) {
            const updated = projects.filter(p => p.id !== id);
            setProjects(updated);
            localStorage.setItem('fb_projects', JSON.stringify(updated));
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-300 pb-20 relative">
             {showToast && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-[#28303f] text-white px-8 py-3 rounded-xl shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Project State Synchronized</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-fb-navy tracking-tighter">Projects</h1>
                    <p className="text-gray-400 font-bold mt-2">Oversee project scope, timeline, and profitability</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-fb-blue' : 'text-gray-400 hover:text-fb-navy'}`}><LayoutGrid size={20} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-fb-blue' : 'text-gray-400 hover:text-fb-navy'}`}><List size={20} /></button>
                    </div>
                    <button 
                        onClick={() => { setEditingProject(null); setProjectTitle(''); setIsModalOpen(true); }}
                        className="bg-fb-green hover:brightness-110 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-fb-green/20 transition-all active:scale-95"
                    >
                        New Project
                    </button>
                </div>
            </div>

            {/* Shelf & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center space-x-10 border-b border-gray-100 pb-2 flex-1">
                    <button className="text-fb-blue font-black border-b-4 border-fb-blue pb-4 -mb-3 transition-all">Active Profiles ({projects.length})</button>
                    <button className="text-gray-400 hover:text-fb-navy font-black text-sm pb-4 -mb-3 transition-all">Archived Archive</button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fb-blue" size={18} />
                        <input className="pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-fb-blue/5 outline-none w-80 text-sm font-bold shadow-sm" placeholder="Find project by title or client..." />
                    </div>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div 
                        onClick={() => { setEditingProject(null); setProjectTitle(''); setIsModalOpen(true); }}
                        className="border-4 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center cursor-pointer hover:bg-fb-gray hover:border-fb-blue/20 transition-all h-[360px] text-gray-300 hover:text-fb-blue group"
                    >
                        <div className="w-20 h-20 rounded-[30px] bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-sm">
                            <Plus size={40} strokeWidth={3} className="group-hover:text-fb-blue transition-colors" />
                        </div>
                        <span className="font-black text-xs uppercase tracking-[0.3em] text-center">Initiate<br/>Project Scope</span>
                    </div>

                    {projects.map((proj) => (
                        <div key={proj.id} className="bg-white border border-gray-200 rounded-[40px] p-10 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-[360px] relative border-b-8 border-b-fb-blue overflow-hidden">
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center text-fb-blue border border-blue-100 group-hover:scale-110 transition-transform">
                                    <Folder size={32} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(proj); }} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-fb-blue hover:text-white transition-all opacity-0 group-hover:opacity-100"><Pencil size={18} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(proj.id); }} className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                                </div>
                            </div>
                            
                            <div className="relative z-10 flex-1">
                                <div className="inline-block px-3 py-1 bg-fb-green/10 text-fb-green text-[10px] font-black uppercase tracking-widest rounded-full border border-fb-green/20 mb-4">{proj.status}</div>
                                <h3 className="text-2xl font-black text-fb-navy mb-2 group-hover:text-fb-blue truncate tracking-tight">{proj.title}</h3>
                                <p className="text-sm font-bold text-gray-400 mb-6 truncate">{proj.client}</p>
                            </div>
                            
                            <div className="mt-auto pt-8 border-t border-gray-50 flex justify-between items-center relative z-10">
                                <div className="flex items-center text-[10px] font-black text-fb-navy uppercase tracking-[0.2em]">
                                    <Clock size={16} className="mr-2 text-fb-blue" /> {proj.hours} HRS
                                </div>
                                <div className="flex -space-x-2">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-fb-gray border-2 border-white flex items-center justify-center text-[10px] font-black text-fb-navy">T{i+1}</div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                 <Zap size={240} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-fb-blue">
                     <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                            <tr>
                                <th className="p-8">Project Details</th>
                                <th className="p-8">Client Identity</th>
                                <th className="p-8 text-center">Hours</th>
                                <th className="p-8 text-right">Target Due</th>
                                <th className="p-8 w-32"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {projects.map(proj => (
                                <tr key={proj.id} className="hover:bg-fb-gray transition-all group">
                                    <td className="p-8">
                                        <div className="font-black text-fb-navy group-hover:text-fb-blue text-lg mb-1">{proj.title}</div>
                                        <span className="text-[10px] font-black text-fb-green uppercase tracking-widest bg-fb-green/5 px-2 py-0.5 rounded">{proj.status}</span>
                                    </td>
                                    <td className="p-8 font-bold text-gray-500">{proj.client}</td>
                                    <td className="p-8 text-center font-black text-fb-navy">{proj.hours} HRS</td>
                                    <td className="p-8 text-right font-black text-fb-navy uppercase text-xs">{proj.dueDate}</td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                             <button onClick={() => handleEdit(proj)} className="w-10 h-10 bg-fb-blue/5 text-fb-blue rounded-xl flex items-center justify-center hover:bg-fb-blue hover:text-white transition-all"><Pencil size={18} /></button>
                                             <button onClick={() => handleDelete(proj.id)} className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-fb-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[650px] animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-14">
                            <div className="flex justify-between items-start mb-12">
                                <h2 className="text-3xl font-black text-fb-navy">{editingProject ? 'Modify Scope' : 'Initialize Project'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-fb-navy transition-colors"><X size={32} /></button>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Project Identity / Title</label>
                                    <input 
                                        autoFocus
                                        className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy text-2xl shadow-sm transition-all" 
                                        placeholder="e.g. Enterprise Rebrand 2026"
                                        value={projectTitle}
                                        onChange={(e) => setProjectTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Assign Relationship</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none bg-white font-black text-fb-navy shadow-sm appearance-none cursor-pointer"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                        >
                                            <option value="">Internal Business Operations</option>
                                            <option value="Acme Corp">Acme Corp</option>
                                            <option value="Design Studio">Design Studio</option>
                                            <option value="ABC Inc.">ABC Inc.</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-fb-blue" size={24} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Targeted Deadline (Optional)</label>
                                    <div className="relative">
                                        <input 
                                           type="date" 
                                           className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy shadow-sm transition-all pr-12" 
                                           value={dueDate}
                                           onChange={(e) => setDueDate(e.target.value)}
                                       />
                                       <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-10 mt-16 pt-10 border-t border-gray-50">
                                <button onClick={() => setIsModalOpen(false)} className="font-black text-gray-400 hover:text-fb-navy transition-colors uppercase tracking-[0.2em] text-xs">Discard Changes</button>
                                <button 
                                    onClick={handleSave}
                                    disabled={!projectTitle}
                                    className={`font-black py-5 px-12 rounded-2xl shadow-xl text-white transition-all transform active:scale-95 flex items-center gap-3 ${!projectTitle ? 'bg-gray-200 cursor-not-allowed' : 'bg-fb-blue hover:brightness-110 shadow-blue-100'}`}
                                >
                                    {editingProject ? 'Sync Project' : 'Launch Project'} <Zap size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}