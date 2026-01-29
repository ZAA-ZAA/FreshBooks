
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info, ChevronDown, ChevronUp, Star, Smile, Lock, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

const PlanCard = ({ 
    name, 
    price, 
    clients, 
    features, 
    popular = false, 
    select = false 
}: { 
    name: string, 
    price?: string, 
    clients: string, 
    features: string[], 
    popular?: boolean,
    select?: boolean
}) => {
    const navigate = useNavigate();
    return (
        <div className={`flex flex-col rounded-2xl p-8 transition-all relative ${popular ? 'bg-[#002855] text-white shadow-2xl scale-105 z-10 border-none' : 'bg-white text-fb-slate border border-gray-200'}`}>
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-yellow-400 text-[#002855] text-[10px] font-bold px-3 py-1 rounded-full flex items-center uppercase tracking-wider shadow-sm">
                        <Star size={12} className="mr-1 fill-current" /> Most Popular
                    </div>
                </div>
            )}
            <h3 className="text-2xl font-bold mb-6 text-center">{name}</h3>
            
            {select ? (
                <div className="text-center mb-8 flex-1 flex flex-col justify-center">
                    <div className="text-4xl font-bold mb-2">Let's Talk</div>
                </div>
            ) : (
                <div className="text-center mb-8 flex-1">
                    <div className="flex justify-center items-start">
                        <span className="text-2xl font-bold mt-2">$</span>
                        <span className="text-6xl font-bold">{price}</span>
                        <div className="text-left ml-2">
                            <div className="text-sm font-bold">.00</div>
                            <div className="text-xs opacity-60">USD/mo</div>
                        </div>
                    </div>
                    <div className="mt-4 bg-blue-50 text-fb-blue text-[10px] font-bold py-1 px-3 rounded-full inline-block uppercase tracking-wider">
                        Get up to $250 back*
                    </div>
                </div>
            )}

            <div className="mb-8">
                <button 
                    onClick={() => navigate('/signup')}
                    className={`w-full py-4 rounded-lg font-bold text-base shadow-sm transition-all transform hover:-translate-y-0.5 ${popular || select ? 'bg-fb-green hover:bg-fb-darkGreen text-white' : 'bg-fb-green hover:bg-fb-darkGreen text-white'}`}
                >
                    {select ? 'Talk to a Consultant' : 'Buy Now & Save'}
                </button>
                <div className="text-center mt-3">
                    <span onClick={() => navigate('/signup')} className={`text-sm font-bold cursor-pointer hover:underline ${popular ? 'text-blue-200' : 'text-fb-blue'}`}>
                        or Try It Free
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center text-sm font-bold">
                    Send invoices to <span className={`mx-1 ${popular ? 'text-blue-300' : 'text-fb-blue'}`}>{clients}</span> clients <Info size={14} className="ml-1 opacity-40 cursor-help" />
                </div>
                {features.map((f, i) => (
                    <div key={i} className="flex items-start text-sm opacity-80">
                        <Check size={16} className={`mr-2 mt-0.5 flex-shrink-0 ${popular ? 'text-fb-green' : 'text-fb-green'}`} />
                        <span className="flex-1">{f}</span>
                        <Info size={14} className="ml-1 opacity-40 cursor-help" />
                    </div>
                ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100/10 text-center">
                 <button className={`text-xs font-bold flex items-center justify-center mx-auto hover:underline ${popular ? 'text-blue-200' : 'text-fb-blue'}`}>
                    See all features <ChevronDown size={14} className="ml-1" />
                 </button>
            </div>
        </div>
    );
};

// Fix: Making children optional to resolve TypeScript property missing error
const FAQItem = ({ question, children }: { question: string, children?: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-100 bg-white rounded-xl mb-4 overflow-hidden shadow-sm hover:border-fb-blue transition-colors">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex justify-between items-center text-left transition-colors group"
            >
                <span className="text-lg font-bold text-fb-slate group-hover:text-fb-blue">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-fb-blue" /> : <ChevronDown size={20} className="text-gray-400 group-hover:text-fb-blue" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-gray-600 leading-relaxed border-t border-gray-50 pt-4">{children}</p>
                </div>
            )}
        </div>
    );
};

export default function Pricing() {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="bg-[#fcfcfc] font-sans">
            {/* Promo Header Section */}
            <div className="bg-[#f2f8ff] py-16 md:py-24 text-center px-4 overflow-hidden relative">
                <div className="max-w-[900px] mx-auto relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white px-4 py-1.5 rounded-full text-xs font-bold text-fb-slate shadow-sm border border-blue-100 flex items-center">
                            ✨ Buy now to get this limited-time offer ✨
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-fb-slate mb-6 tracking-tight leading-tight">
                        Up to $250 back on payment fees for 60 days*
                    </h1>
                    <p className="text-lg text-fb-slate font-medium mb-10 max-w-2xl mx-auto">
                        Risk-free. 30-Day money-back guarantee. <span className="text-fb-blue cursor-pointer underline decoration-fb-blue/30 underline-offset-4">Offer Details*</span>
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex justify-center mb-12 relative group">
                        <div className="bg-white p-1 rounded-full border border-gray-200 shadow-sm flex items-center relative">
                            <button 
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all relative z-10 ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500 hover:text-fb-blue'}`}
                            >
                                Monthly
                                {billingCycle === 'monthly' && <span className="absolute inset-0 bg-fb-blue rounded-full shadow-md -z-10 animate-in fade-in zoom-in-95 duration-200"></span>}
                            </button>
                            <button 
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all relative z-10 ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500 hover:text-fb-blue'}`}
                            >
                                Yearly
                                {billingCycle === 'yearly' && <span className="absolute inset-0 bg-fb-blue rounded-full shadow-md -z-10 animate-in fade-in zoom-in-95 duration-200"></span>}
                            </button>
                        </div>
                        <div className="absolute -top-7 right-[calc(50%-140px)] bg-yellow-400 text-[#002855] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm animate-bounce">
                            Extra 10% Off
                        </div>
                    </div>

                    {/* Audience Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16 overflow-x-auto pb-4 max-w-full px-4 scrollbar-hide">
                        {['Show All Plans', 'Freelancers', 'Self-Employed', 'Business With Contractors', 'Business With Employees'].map((tab, i) => (
                            <button 
                                key={tab}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${i === 0 ? 'bg-fb-blue text-white border-fb-blue shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-fb-blue hover:text-fb-blue'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Pricing Grid */}
            <div className="max-w-[1280px] mx-auto px-6 -mt-10 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <PlanCard 
                        name="Lite" 
                        price="23" 
                        clients="5" 
                        features={['Track expenses in real time', 'Create and send estimates', 'Get paid with credit and debit cards', 'Generate tax-time reports']}
                    />
                    <PlanCard 
                        popular={true}
                        name="Plus" 
                        price="43" 
                        clients="50" 
                        features={['Track expenses in real time', 'Create estimates, proposals, and client retainers', 'Get paid with credit and debit cards', 'Generate tax-time reports']}
                    />
                    <PlanCard 
                        name="Premium" 
                        price="70" 
                        clients="unlimited" 
                        features={['Track expenses in real time', 'Create estimates, proposals, and client retainers', 'Get paid with credit and debit cards', 'Generate tax-time reports', 'Track project profitability']}
                    />
                    <PlanCard 
                        select={true}
                        name="Select" 
                        clients="unlimited" 
                        features={['Track expenses in real time', 'Create estimates, proposals, and client retainers', 'Access lower credit card transaction fees', 'Generate tax-time reports']}
                    />
                </div>
            </div>

            {/* Add-ons Comparison Table Placeholder */}
            <div className="max-w-[1000px] mx-auto px-6 mb-32">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-[#002855] text-white p-4 grid grid-cols-5 text-sm font-bold">
                        <div className="col-span-1">Add-ons</div>
                        <div className="text-center">Lite</div>
                        <div className="text-center">Plus</div>
                        <div className="text-center">Premium</div>
                        <div className="text-center">Select</div>
                    </div>
                    <div className="divide-y divide-gray-100 text-sm">
                        {[
                            { name: 'Advanced Payments', price: '$20/mo', included: [false, false, false, true] },
                            { name: 'Team Members (per person)', price: '$11/mo', included: [false, false, false, false] },
                            { name: 'FreshBooks Payroll', price: '$40/mo + $6/user', included: [false, false, false, false] }
                        ].map((row, i) => (
                            <div key={i} className="p-5 grid grid-cols-5 items-center hover:bg-gray-50 transition-colors">
                                <div className="font-medium flex items-center">
                                    {row.name} <Info size={14} className="ml-1 opacity-30" />
                                </div>
                                {row.included.map((inc, j) => (
                                    <div key={j} className="text-center text-gray-500 font-bold">
                                        {j === 3 && inc ? 'Included' : row.price}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-[#002855] py-24 px-6 text-white relative">
                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tight">
                        Don't take our word for it, <span className="text-yellow-400">take theirs</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-[#003d7e] p-10 rounded-2xl border border-blue-400/20 hover:border-blue-400/40 transition-colors group">
                            <div className="flex items-center mb-6">
                                <div className="flex mr-3">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} className="text-yellow-400 fill-current mr-0.5" />)}
                                </div>
                                <span className="font-bold text-blue-100">4.5 Outstanding</span>
                            </div>
                            <p className="text-xl leading-relaxed mb-10 text-blue-50 font-medium">
                                "FreshBooks offers a well-rounded, intuitive, and attractive double-entry accounting experience. It anticipates the needs of freelancers and small businesses well—better than competitors in this class."
                            </p>
                            <div className="text-2xl font-black italic tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity uppercase">PCMAG.COM</div>
                        </div>

                        <div className="bg-[#003d7e] p-10 rounded-2xl border border-blue-400/20 hover:border-blue-400/40 transition-colors group">
                            <div className="flex items-center mb-6">
                                <div className="flex mr-3">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} className="text-yellow-400 fill-current mr-0.5" />)}
                                </div>
                                <span className="font-bold text-blue-100">4.5 Excellent</span>
                            </div>
                            <p className="text-xl leading-relaxed mb-10 text-blue-50 font-medium">
                                "FreshBooks automates daily accounting activities namely invoice creation, payment acceptance, expenses tracking, billable time tracking, and financial reporting."
                            </p>
                            <div className="text-2xl font-black italic tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity uppercase">Capterra</div>
                        </div>

                        <div className="bg-[#003d7e] p-10 rounded-2xl border border-blue-400/20 hover:border-blue-400/40 transition-colors group">
                            <div className="flex items-center mb-6">
                                <div className="flex mr-3">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} className="text-yellow-400 fill-current mr-0.5" />)}
                                </div>
                                <span className="font-bold text-blue-100">4.5 Excellent</span>
                            </div>
                            <p className="text-xl leading-relaxed mb-10 text-blue-50 font-medium">
                                "FreshBooks is an online accounting and invoicing service that saves you time and makes you look professional – Fortune 500 professional."
                            </p>
                            <div className="text-2xl font-black italic tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity uppercase">G2</div>
                        </div>

                        <div className="bg-[#003d7e] p-10 rounded-2xl border border-blue-400/20 hover:border-blue-400/40 transition-colors group">
                            <div className="flex items-center mb-6">
                                <div className="flex mr-3">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} className="text-yellow-400 fill-current mr-0.5" />)}
                                </div>
                                <span className="font-bold text-blue-100">4.7 Excellent</span>
                            </div>
                            <p className="text-xl leading-relaxed mb-10 text-blue-50 font-medium">
                                "FreshBooks makes it easy to stay organized, keep track of payments owed and expenses made, send invoices and accept payments."
                            </p>
                            <div className="text-2xl font-black italic tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity uppercase">Forbes</div>
                        </div>
                    </div>
                </div>

                {/* Abstract waves decorations */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#004694] rounded-full translate-x-1/3 -translate-y-1/3 opacity-30 blur-3xl -z-0"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0066c0] rounded-full -translate-x-1/3 translate-y-1/3 opacity-20 blur-3xl -z-0"></div>
            </div>

            {/* Support/Security/Guarantee */}
            <div className="py-24 max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                <div className="flex flex-col items-center group">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-fb-blue mb-8 group-hover:bg-fb-blue group-hover:text-white transition-all duration-300">
                        <Smile size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-fb-slate mb-4">Award winning support</h3>
                    <p className="text-gray-500 leading-relaxed text-lg">
                        Our support staff is with you every step of the way, starting the moment you make the switch from spreadsheets or any other accounting software.
                    </p>
                </div>
                <div className="flex flex-col items-center group">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-fb-blue mb-8 group-hover:bg-fb-blue group-hover:text-white transition-all duration-300">
                        <Lock size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-fb-slate mb-4">100% safe and secure</h3>
                    <p className="text-gray-500 leading-relaxed text-lg">
                        FreshBooks protects your personal info and your client's info with industry-standard SSL and encryption so everything is always safe and secure.
                    </p>
                </div>
                <div className="flex flex-col items-center group">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-fb-blue mb-8 group-hover:bg-fb-blue group-hover:text-white transition-all duration-300">
                        <ShieldCheck size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-fb-slate mb-4">Satisfaction guarantee</h3>
                    <p className="text-gray-500 leading-relaxed text-lg">
                        Buy a plan or sign up for a free trial. FreshBooks promises that if you aren't satisfied you can contact us anytime within the first 30 days after your purchase for a full refund.
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-24 bg-[#f8fbff]">
                <div className="max-w-[1000px] mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-fb-slate text-center mb-16 tracking-tight">Frequently Asked Questions</h2>
                    
                    <div className="space-y-4">
                        <FAQItem question="How does the 30-day free trial work?">
                            When you sign up, you'll have full access to all FreshBooks features for 30 days. No credit card is required. At the end of your trial, you can choose a plan that fits your business needs.
                        </FAQItem>
                        <FAQItem question="What happens after my free trial?">
                            Your account will be suspended unless you choose a paid plan. Your data remains safe, and you can reactive it anytime by selecting a subscription.
                        </FAQItem>
                        <FAQItem question="Do I need to install any software?">
                            No! FreshBooks is 100% cloud-based. You just need a web browser or our mobile app.
                        </FAQItem>
                        <FAQItem question="Is my data safe?">
                            Yes. We use industry-standard encryption and security protocols to ensure your data is always protected and backed up.
                        </FAQItem>
                        <FAQItem question="What if I need help getting started?">
                            Our award-winning support team is available via chat, email, and phone to help you with any questions.
                        </FAQItem>
                        <FAQItem question="How do client limits work in FreshBooks pricing?">
                            Each plan allows a certain number of active clients. An active client is someone you've sent an invoice or estimate to within the last year.
                        </FAQItem>
                        <FAQItem question="How much does FreshBooks charge per transaction?">
                            Payment processing fees depend on your region and payment method. For US credit cards, it typically starts at 2.9% + $0.30 per transaction.
                        </FAQItem>
                    </div>
                </div>
            </div>

            {/* Compare Strip */}
            <div className="bg-[#002855] py-16 px-6 relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between text-white relative z-10">
                    <div className="mb-10 lg:mb-0 text-center lg:text-left">
                        <h2 className="text-4xl font-bold mb-4">Compare all plans</h2>
                        <span onClick={() => navigate('/signup')} className="text-fb-blue bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-bold cursor-pointer transition-colors text-lg inline-flex items-center">
                            Try it free for 30 days <ArrowRight size={18} className="ml-2" />
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-fb-green hover:bg-fb-darkGreen text-white font-bold py-3.5 px-8 rounded-xl text-sm shadow-lg shadow-black/20">Buy Lite ($23.00)</button>
                        <button className="bg-fb-green hover:bg-fb-darkGreen text-white font-bold py-3.5 px-8 rounded-xl text-sm shadow-lg shadow-black/20">Buy Plus ($43.00)</button>
                        <button className="bg-fb-green hover:bg-fb-darkGreen text-white font-bold py-3.5 px-8 rounded-xl text-sm shadow-lg shadow-black/20">Buy Premium ($70.00)</button>
                        <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-8 rounded-xl text-sm border border-white/20 transition-colors">Request Demo</button>
                    </div>
                </div>
            </div>

            {/* Mega Footer */}
            <div className="bg-white py-20 px-6 border-t border-gray-100">
                <div className="max-w-[1280px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
                        <div className="flex flex-col items-center md:items-start">
                             <div className="w-12 h-12 bg-fb-blue rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6">F</div>
                             <button className="flex items-center space-x-2 text-gray-700 font-bold border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <span>United States</span>
                                <ChevronDown size={16} className="text-gray-400" />
                             </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 text-sm">
                        <div className="space-y-6">
                            <h4 className="font-bold text-fb-slate uppercase tracking-wider text-xs">Company</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">About</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Customer Experience</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Careers</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Diversity and Inclusivity</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Press Center</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Contact</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Blog</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-bold text-fb-slate uppercase tracking-wider text-xs">Product</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Invoice Software</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Expenses and Receipts</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Accounting Software</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Time Tracking</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Managing Projects</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Estimating Software</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Online Payments</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Financial Reports</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-bold text-fb-slate uppercase tracking-wider text-xs">Who It's For</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Freelancers</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Businesses With Contractors</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Businesses With Employees</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Self-Employed Professionals</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Small Businesses</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Accountants</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Construction</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Consultants</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-bold text-fb-slate uppercase tracking-wider text-xs">Partners</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Integrations</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Referral Program</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Affiliate Program</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Reseller Program</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Developers</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-bold text-fb-slate uppercase tracking-wider text-xs">Helpful Links</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Login</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Support</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Sitemap</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">QuickBooks Alternative</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Support Webinars</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Invoice Template</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Accounting Templates</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Tools</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-bold text-fb-slate uppercase tracking-wider text-xs">Policies</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Accessibility</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Privacy</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Terms of Service</li>
                                <li className="hover:text-fb-blue cursor-pointer transition-colors">Security Safeguards</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col lg:flex-row items-center justify-between text-gray-400 text-xs font-medium gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <span>© 2026 FreshBooks</span>
                            <span className="hidden md:block">|</span>
                            <span className="flex items-center"><HelpCircle size={14} className="mr-1" /> Call Toll Free: 1-888-674-3175</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gray-100 w-24 h-8 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">APP STORE</div>
                                <div className="bg-gray-100 w-24 h-8 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">GOOGLE PLAY</div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
                                <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
                                <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
                                <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Chat Widget Simulation */}
            <div className="fixed bottom-6 right-6 z-50">
                 <button className="bg-fb-blue w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform active:scale-95">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.6067 20 9.28827 19.6953 8.11306 19.1491L3 21L4.85089 15.8869C4.30467 14.7117 4 13.3933 4 12C4 7.30558 8.02944 3.5 13 3.5C17.9706 3.5 22 7.30558 22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 12H12.01" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H8.01" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 12H16.01" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                 </button>
            </div>
        </div>
    );
}
