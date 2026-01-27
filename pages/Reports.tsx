import React, { useState } from 'react';
import { BarChart3, PieChart, FileText, Clock, CreditCard, ArrowRight, Loader2, CheckCircle2, X, Download } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const ReportCard = ({ title, desc, icon: Icon, isFavorite, onClick }: { title: string, desc: string, icon: any, isFavorite?: boolean, onClick?: () => void }) => (
    <div 
        onClick={onClick}
        className="bg-white border border-gray-200 rounded p-6 hover:shadow-md transition-all cursor-pointer group h-full flex flex-col relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${isFavorite ? 'bg-blue-50 text-fb-blue' : 'bg-gray-50 text-gray-500'} group-hover:bg-blue-100 group-hover:text-fb-blue transition-colors`}>
                <Icon size={24} />
            </div>
            {isFavorite && <div className="text-yellow-400">★</div>}
        </div>
        <h3 className="font-bold text-fb-slate text-lg mb-2 group-hover:text-fb-blue">{title}</h3>
        <p className="text-sm text-gray-500 mb-4 flex-1">{desc}</p>
        <div className="text-fb-blue text-sm font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            View Report <ArrowRight size={14} className="ml-1" />
        </div>
    </div>
);

export default function Reports() {
    const [generating, setGenerating] = useState<string | null>(null);
    const [reportModalType, setReportModalType] = useState<string | null>(null);
    const [reportData, setReportData] = useState<any>(null);

    const handleReportClick = (title: string) => {
        setGenerating(title);
        setTimeout(() => {
            setGenerating(null);
            
            if (title === "Profit & Loss") {
                const payments = JSON.parse(localStorage.getItem('fb_payments') || '[]');
                const expenses = JSON.parse(localStorage.getItem('fb_expenses') || '[]');
                
                const totalIncome = payments.reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
                const totalExpenses = expenses.reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
                
                setReportData({
                    income: totalIncome,
                    expenses: totalExpenses,
                    net: totalIncome - totalExpenses
                });
                setReportModalType('P&L');
            } else if (title === "Expense Report") {
                const expenses = JSON.parse(localStorage.getItem('fb_expenses') || '[]');
                const categoryMap: Record<string, number> = {};
                
                expenses.forEach((exp: any) => {
                    if (categoryMap[exp.category]) {
                        categoryMap[exp.category] += exp.amount || 0;
                    } else {
                        categoryMap[exp.category] = exp.amount || 0;
                    }
                });

                const chartData = Object.keys(categoryMap).map(key => ({
                    name: key,
                    value: categoryMap[key]
                }));
                
                setReportData({
                    chartData,
                    total: expenses.reduce((acc: number, e: any) => acc + (e.amount || 0), 0)
                });
                setReportModalType('Expenses');
            }
        }, 800);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12 relative">
            
            {/* Loading Overlay */}
            {generating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center animate-in zoom-in-95 duration-200">
                        <Loader2 className="animate-spin text-fb-blue mb-4" size={48} />
                        <h3 className="font-bold text-lg text-fb-slate">Generating {generating}...</h3>
                        <p className="text-sm text-gray-500">Crunching the numbers for you.</p>
                    </div>
                </div>
            )}

            {/* General Report Modal Wrapper */}
            {reportModalType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-[800px] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-fb-slate">
                                    {reportModalType === 'P&L' ? 'Profit & Loss' : 'Expense Report'}
                                </h2>
                                <p className="text-sm text-gray-500">Jan 1, 2026 - Dec 31, 2026</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="flex items-center text-gray-600 hover:text-fb-blue text-sm font-bold">
                                    <Download size={16} className="mr-2" /> Export
                                </button>
                                <button onClick={() => setReportModalType(null)}><X className="text-gray-400 hover:text-gray-600" /></button>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            {reportModalType === 'P&L' && (
                                <div className="space-y-6">
                                    {/* Income Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-fb-slate mb-4 border-b border-gray-200 pb-2">Income</h3>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Sales</span>
                                            <span className="font-medium">₱{reportData.income.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 bg-gray-50 px-2 rounded font-bold mt-2">
                                        <span>Total Income</span>
                                        <span>₱{reportData.income.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    </div>
                                    </div>

                                    {/* Expenses Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-fb-slate mb-4 border-b border-gray-200 pb-2">Expenses</h3>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Operating Expenses</span>
                                            <span className="font-medium">₱{reportData.expenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 bg-gray-50 px-2 rounded font-bold mt-2">
                                            <span>Total Expenses</span>
                                            <span>₱{reportData.expenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                    </div>

                                    {/* Net Profit */}
                                    <div className="pt-6 border-t-2 border-gray-300">
                                        <div className="flex justify-between items-center text-xl font-bold text-fb-slate">
                                            <span>Net Profit</span>
                                            <span className={reportData.net >= 0 ? 'text-fb-green' : 'text-red-500'}>
                                                ₱{reportData.net.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {reportModalType === 'Expenses' && (
                                <div>
                                    <div className="h-[300px] w-full mb-8">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPie width={400} height={400}>
                                                <Pie
                                                    data={reportData.chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {reportData.chartData.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip formatter={(value) => `₱${value}`} />
                                                <Legend />
                                            </RechartsPie>
                                        </ResponsiveContainer>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-fb-slate mb-4">Breakdown by Category</h3>
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="p-3 text-left">Category</th>
                                                    <th className="p-3 text-right">Amount</th>
                                                    <th className="p-3 text-right">% of Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {reportData.chartData.map((item: any) => (
                                                    <tr key={item.name}>
                                                        <td className="p-3 font-medium">{item.name}</td>
                                                        <td className="p-3 text-right">₱{item.value.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="p-3 text-right">{((item.value / reportData.total) * 100).toFixed(1)}%</td>
                                                    </tr>
                                                ))}
                                                <tr className="font-bold bg-gray-50">
                                                    <td className="p-3">Total</td>
                                                    <td className="p-3 text-right">₱{reportData.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                    <td className="p-3 text-right">100%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold text-fb-slate mb-6">Favorite Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ReportCard 
                        title="Profit & Loss" 
                        desc="See exactly how much you're making. Income minus expenses equals profit." 
                        icon={BarChart3}
                        isFavorite={true}
                        onClick={() => handleReportClick("Profit & Loss")}
                    />
                    <ReportCard 
                        title="Sales Tax Summary" 
                        desc="Know exactly what you've collected and what you owe to the government." 
                        icon={FileText}
                        isFavorite={true}
                        onClick={() => handleReportClick("Sales Tax Summary")}
                    />
                    <ReportCard 
                        title="Invoice Details" 
                        desc="A detailed history of every invoice you've sent, including status and payments." 
                        icon={FileText}
                        isFavorite={true}
                        onClick={() => handleReportClick("Invoice Details")}
                    />
                </div>
            </div>

            <hr className="border-gray-200" />

            <div>
                <h2 className="text-lg font-bold text-gray-500 uppercase tracking-wide mb-6">Invoices & Expenses</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ReportCard 
                        title="Expense Report" 
                        desc="A detailed breakdown of your business expenses by category." 
                        icon={PieChart}
                        onClick={() => handleReportClick("Expense Report")}
                    />
                    <ReportCard 
                        title="Accounts Aging" 
                        desc="See which clients are taking a long time to pay you." 
                        icon={Clock}
                        onClick={() => handleReportClick("Accounts Aging")}
                    />
                     <ReportCard 
                        title="Item Sales" 
                        desc="Track which items or services are your best sellers." 
                        icon={BarChart3}
                        onClick={() => handleReportClick("Item Sales")}
                    />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-gray-500 uppercase tracking-wide mb-6">Payments</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ReportCard 
                        title="Payments Collected" 
                        desc="Every payment you've received over a specific time period." 
                        icon={CreditCard}
                        onClick={() => handleReportClick("Payments Collected")}
                    />
                    <ReportCard 
                        title="Credit Balance" 
                        desc="Keep track of prepayments and credit balances for your clients." 
                        icon={CreditCard}
                        onClick={() => handleReportClick("Credit Balance")}
                    />
                </div>
            </div>
        </div>
    );
}