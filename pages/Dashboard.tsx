import React, { useState, useEffect } from 'react';
import { Pencil, Truck, Users, FileText, ChevronDown, Plus, X, CheckCircle2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ActionCard = ({ 
    icon: Icon, 
    title, 
    description, 
    buttonText, 
    onClick,
    illustrationClass,
    iconBg
}: { 
    icon: any, 
    title: string, 
    description: string, 
    buttonText: string,
    onClick?: () => void,
    illustrationClass: string,
    iconBg?: string
}) => (
    <div className="bg-white rounded border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full group hover:shadow-md transition-shadow">
        {/* Mock Illustration Area */}
        <div className={`h-40 ${illustrationClass} flex items-center justify-center relative border-b border-gray-100`}>
             <div className="bg-white p-6 rounded shadow-sm border border-gray-200 flex items-center space-x-4 w-3/4 max-w-[220px]">
                <div className={`p-3 rounded-full ${iconBg || 'bg-gray-100'}`}>
                    <Icon size={24} className="text-fb-slate" />
                </div>
                <div className="space-y-2 flex-1">
                     <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                     <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                </div>
             </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
            <h3 className="font-bold text-fb-slate text-lg mb-3 leading-tight">{title}</h3>
            <p className="text-sm text-gray-500 mb-6 flex-1 leading-relaxed">{description}</p>
            <button 
                onClick={onClick}
                className="w-full py-2.5 border border-gray-300 rounded font-bold text-fb-slate hover:bg-gray-50 hover:border-gray-400 transition-all text-sm"
            >
                {buttonText}
            </button>
        </div>
    </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [createNewOpen, setCreateNewOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteToast, setShowInviteToast] = useState(false);
  
  // Real-time metrics state
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [outstandingInvoices, setOutstandingInvoices] = useState<any[]>([]);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // 1. Calculate Revenue (Sum of all invoices created, regardless of status for "Billed" revenue)
    const invoices = JSON.parse(localStorage.getItem('fb_invoices') || '[]');
    const revenue = invoices.reduce((acc: number, inv: any) => acc + (inv.amount || 0), 0);
    setTotalRevenue(revenue);

    // 2. Calculate Outstanding (Status is not Paid)
    const outstanding = invoices.filter((inv: any) => inv.status !== 'Paid');
    setOutstandingInvoices(outstanding);
    const outAmount = outstanding.reduce((acc: number, inv: any) => acc + (inv.amount || 0), 0);
    setOutstandingAmount(outAmount);

    // 3. Calculate Expenses
    const expenses = JSON.parse(localStorage.getItem('fb_expenses') || '[]');
    const expenseTotal = expenses.reduce((acc: number, exp: any) => acc + (exp.amount || 0), 0);
    setTotalExpenses(expenseTotal);

    // 4. Generate Chart Data
    const generateChartData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = months.map(m => ({ name: m, revenue: 0, expenses: 0 }));

        invoices.forEach((inv: any) => {
            const d = new Date(inv.date);
            const mIndex = d.getMonth(); // 0-11
            data[mIndex].revenue += inv.amount || 0;
        });

        expenses.forEach((exp: any) => {
            const d = new Date(exp.date);
            const mIndex = d.getMonth();
            data[mIndex].expenses += exp.amount || 0;
        });

        // Filter to current year logic simulated by just returning all data for this demo, 
        // or slicing to relevant months if we had date filters. 
        // For simplicity, we just show the whole year distribution.
        setChartData(data);
    };
    generateChartData();

  }, []);

  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  const handleInvite = () => {
      setIsInviteModalOpen(false);
      setShowInviteToast(true);
      setTimeout(() => setShowInviteToast(false), 3000);
      setInviteEmail('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 relative">
      
      {/* Toast */}
      {showInviteToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#28303f] text-white px-6 py-3 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="text-fb-green mr-3" size={20} />
            <span className="font-bold">Invitation Sent Successfully</span>
        </div>
      )}

      {/* Dashboard Header Actions */}
      <div className="absolute top-[-54px] right-0 flex items-center space-x-6 z-20">
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="text-fb-blue font-bold text-sm hover:underline"
          >
              Add Team Member
          </button>
          <div className="relative">
              <button 
                onClick={() => setCreateNewOpen(!createNewOpen)}
                className="bg-fb-green hover:bg-[#33c46b] text-white px-4 py-2.5 rounded font-bold text-sm flex items-center shadow-sm transition-colors"
              >
                  Create New... <ChevronDown size={16} className="ml-2" />
              </button>

              {/* Create New Dropdown */}
              {createNewOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      {[
                        { label: 'Client', path: '/clients' },
                        { label: 'Retainer', path: '/invoices' },
                        { label: 'Invoice', path: '/invoices/new' },
                        { label: 'Other Income', path: '/accounting' },
                        { label: 'Expense', path: '/expenses' },
                        { label: 'Estimate', path: '/estimates' },
                        { label: 'Credit', path: '/payments' },
                        { label: 'Project', path: '/projects' },
                      ].map((item) => (
                          <div 
                            key={item.label}
                            onClick={() => {
                                setCreateNewOpen(false);
                                navigate(item.path);
                            }}
                            className="px-4 py-2 text-sm text-fb-slate hover:bg-fb-blue hover:text-white cursor-pointer"
                          >
                              {item.label}
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </div>

      {/* Welcome Title */}
      <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-fb-slate">Welcome, John! Here's how to get the most out of FreshBooks.</h2>
      </div>

      {/* Revenue Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded p-6 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-fb-slate">Revenue & Expenses (This Year)</h3>
                 <select className="border border-gray-300 rounded text-sm p-1 text-gray-600 bg-white outline-none cursor-pointer hover:border-gray-400">
                     <option>This Year</option>
                     <option>Last Year</option>
                 </select>
             </div>
             <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `₱${value}`} />
                        <Tooltip 
                            cursor={{fill: '#f3f4f6'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                        />
                        <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                        <Bar dataKey="revenue" name="Revenue" fill="#3fd071" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar dataKey="expenses" name="Expenses" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                 </ResponsiveContainer>
             </div>
        </div>

        {/* Profit Card */}
        <div className="bg-white border border-gray-200 rounded p-6 shadow-sm flex flex-col justify-center">
             <h3 className="font-bold text-lg text-fb-slate mb-6">Total Profit</h3>
             <div className={`text-4xl font-bold mb-2 ${totalProfit >= 0 ? 'text-fb-slate' : 'text-red-500'}`}>
                 ₱{totalProfit.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
             </div>
             <p className="text-sm text-gray-500 mb-8">Total Profit for all time</p>
             <div className="space-y-4">
                 <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                     <span className="text-gray-600">Total Billed</span>
                     <span className="font-bold text-fb-green">₱{totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                 </div>
                 <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                     <span className="text-gray-600">Total Expenses</span>
                     <span className="font-bold text-red-400">-₱{totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                 </div>
                 <div className="pt-4">
                    <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Profit Margin</p>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-fb-blue h-2 rounded-full" style={{width: `${profitMargin > 0 ? profitMargin : 0}%`}}></div>
                    </div>
                    <p className="text-right text-xs font-bold text-fb-blue mt-1">{profitMargin}%</p>
                 </div>
             </div>
        </div>
      </div>

      {/* Getting Started Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard 
             icon={Truck}
             title="Get Started With Items and Services"
             description="No matter what you sell, add your items or services to easily include on an invoice or track inventory."
             buttonText="Add an Item or Service"
             onClick={() => navigate('/items')}
             illustrationClass="bg-blue-50"
             iconBg="bg-blue-100"
          />
          <ActionCard 
             icon={Users}
             title="Managing Clients Has Never Been Easier"
             description="Keep track of invoices, refunds, and payments for each and every client."
             buttonText="Add a Client"
             onClick={() => navigate('/clients')}
             illustrationClass="bg-indigo-50"
             iconBg="bg-indigo-100"
          />
          <ActionCard 
             icon={FileText}
             title="Wow Clients With Professional Invoices That Take Seconds to Make"
             description="Impress clients with a professional invoice customized with your logo and brand colors."
             buttonText="Create an Invoice"
             onClick={() => navigate('/invoices/new')}
             illustrationClass="bg-yellow-50"
             iconBg="bg-yellow-100"
          />
      </div>

      {/* Outstanding Invoices Section */}
      <div className="pt-8 relative">
          <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-fb-slate">Outstanding Invoices</h3>
              <p className="text-xl text-fb-blue font-handwriting transform -rotate-1 absolute right-0 -top-1 hidden md:block">see who owes you, and who's late to pay</p>
          </div>
          
          <div className="bg-[#fffbf2] border border-[#e8dfc8] rounded p-12 text-center">
              <div className="max-w-md mx-auto">
                   {outstandingInvoices.length > 0 ? (
                       <div className="text-center">
                           <div className="text-5xl font-bold text-fb-slate mb-2">₱{outstandingAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                           <p className="text-gray-500 text-sm mb-6">Total outstanding from {outstandingInvoices.length} invoice(s)</p>
                           <button 
                                onClick={() => navigate('/invoices')}
                                className="text-fb-blue font-bold text-sm hover:underline"
                           >
                               View All Invoices
                           </button>
                       </div>
                   ) : (
                       <>
                           {/* Custom SVG Empty State */}
                           <div className="mb-6 flex justify-center opacity-40">
                               <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="20" y="20" width="80" height="60" rx="4" fill="#fff" stroke="#94a3b8" strokeWidth="2"/>
                                    <path d="M30 35H90" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M30 45H70" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M30 55H60" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
                                    <rect x="80" y="60" width="10" height="10" fill="#cbd5e1"/>
                               </svg>
                           </div>
                           <p className="text-gray-500 text-sm mb-4">You have no outstanding invoices.</p>
                           <button 
                                onClick={() => navigate('/invoices/new')}
                                className="text-fb-blue font-bold text-sm hover:underline"
                           >
                               Create an Invoice
                           </button>
                       </>
                   )}
              </div>
          </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center">
                            <UserPlus className="mr-3 text-fb-blue" />
                            <h2 className="text-2xl font-bold text-fb-slate">Invite Your Team</h2>
                        </div>
                        <button onClick={() => setIsInviteModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-6">
                        Collaborate with your accountant, employees, or contractors. They'll get their own login.
                    </p>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                        <input 
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none" 
                            placeholder="colleague@example.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-6">
                         <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
                         <select className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-fb-blue outline-none bg-white">
                             <option>Admin</option>
                             <option>Manager</option>
                             <option>Employee</option>
                             <option>Contractor</option>
                             <option>Accountant</option>
                         </select>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button 
                            onClick={() => setIsInviteModalOpen(false)}
                            className="font-bold text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleInvite}
                            disabled={!inviteEmail}
                            className={`font-bold py-2 px-6 rounded shadow-sm text-white transition-colors ${!inviteEmail ? 'bg-gray-300 cursor-not-allowed' : 'bg-fb-green hover:bg-[#33c46b]'}`}
                        >
                            Send Invitation
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}