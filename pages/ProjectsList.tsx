import React, { useState, useEffect } from 'react';
import { Plus, Users, Clock, Folder, X, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ProjectsList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    // Data State
    const [projects, setProjects] = useState<any[]>([]);
    
    // Form State
    const [projectTitle, setProjectTitle] = useState('');
    const [clientName, setClientName] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('fb_projects');
        if (stored) {
            setProjects(JSON.parse(stored));
        }
    }, []);

    const handleSave = () => {
        const project = {
            id: Date.now(),
            title: projectTitle,
            client: clientName || 'Unknown Client',
            status: 'Active',
            hours: 0,
            team: 1,
            dueDate: dueDate || 'No due date'
        };
        const updated = [...projects, project];
        setProjects(updated);
        localStorage.setItem('fb_projects', JSON.stringify(updated));

        setIsModalOpen(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        // Reset
        setProjectTitle('');
        setClientName('');
        setDueDate('');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Toast */}
             {showToast && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="text-fb-green mr-3" size={20} />
                    <span className="font-bold">Project Created Successfully</span>
                </div>
            )}

             {/* Top Action */}
             <div className="absolute top-[-50px] right-0">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-fb-green hover:bg-[#33c46b] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                >
                    Create New Project
                </button>
            </div>

            <div className="flex items-center space-x-6 border-b border-gray-200 pb-4 mb-6">
                <div className="text-fb-blue font-bold border-b-2 border-fb-blue pb-4 -mb-4 cursor-pointer">Active Projects ({projects.length})</div>
                <div className="text-gray-500 hover:text-gray-700 cursor-pointer font-medium">Archived</div>
                <div className="text-gray-500 hover:text-gray-700 cursor-pointer font-medium">Deleted</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {projects.map((proj) => (
                    <div key={proj.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-64">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-fb-blue">
                                <Folder size={20} />
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">{proj.status}</span>
                        </div>
                        <h3 className="text-lg font-bold text-fb-slate mb-1 group-hover:text-fb-blue truncate">{proj.title}</h3>
                        <p className="text-sm text-gray-500 mb-6 truncate">{proj.client}</p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
                            <div className="flex items-center">
                                <Clock size={16} className="mr-2 text-gray-400" /> {proj.hours} hrs
                            </div>
                            <div className="flex items-center">
                                <Users size={16} className="mr-2 text-gray-400" /> {proj.team} Team
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Card */}
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors h-64 text-gray-400 hover:text-fb-blue group"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                        <Plus size={24} className="group-hover:text-fb-blue" />
                    </div>
                    <span className="font-bold text-sm">Create a Project</span>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[600px] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-fb-slate">Create New Project</h2>
                                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Project Title</label>
                                    <input 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                        placeholder="e.g. Website Redesign"
                                        value={projectTitle}
                                        onChange={(e) => setProjectTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Client</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none bg-white"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                    >
                                        <option value="">Select a Client</option>
                                        <option value="Acme Corp">Acme Corp</option>
                                        <option value="Design Studio">Design Studio</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="block text-xs font-bold text-gray-500 mb-1">Due Date (Optional)</label>
                                         <input 
                                            type="date" 
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                        />
                                     </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                    <h4 className="font-bold text-sm text-fb-slate mb-2">Billing Method</h4>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <label className="flex items-center cursor-pointer">
                                            <input type="radio" name="billing" className="mr-2" defaultChecked /> Hourly Rate
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input type="radio" name="billing" className="mr-2" /> Flat Rate
                                        </label>
                                    </div>
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
                                    disabled={!projectTitle}
                                    className={`font-bold py-2 px-6 rounded shadow-sm text-white transition-colors ${!projectTitle ? 'bg-gray-300 cursor-not-allowed' : 'bg-fb-green hover:bg-[#33c46b]'}`}
                                >
                                    Save Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}