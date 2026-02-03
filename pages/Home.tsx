// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Check, ChevronRight, Play, Timer, Globe, Users, CreditCard, ChevronDown } from 'lucide-react';

const RatingsBlock = ({ score, site, icon: Icon }: { score: string, site: string, icon?: any }) => (
    <div className="text-white">
        <div className="flex items-center gap-1 text-fb-yellow mb-1">
            <span className="text-sm font-bold text-white mr-2">{score}</span>
            {[1, 2, 3, 4].map(s => <Star key={s} size={14} className="fill-current" />)}
            <Star size={14} className="fill-current opacity-50" />
        </div>
        <p className="text-sm text-blue-200 font-semibold">{site}</p>
    </div>
);

// Fix: Making children optional to resolve TypeScript property missing error
const FAQItem = ({ question, children }: { question: string, children?: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-fb-gray p-8 rounded-xl border border-transparent hover:border-fb-blue/20 transition-all cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-fb-navy">{question}</span>
                <ChevronDown className={`text-fb-navy transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && <div className="mt-4 text-gray-600 leading-relaxed animate-in fade-in duration-300">{children}</div>}
        </div>
    );
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full font-display">
      {/* Hero Section */}
      <section className="relative bg-fb-navy overflow-hidden pb-24 pt-16 lg:pt-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-white space-y-10 animate-in slide-in-from-left-8 duration-700">
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tight">
              Small business software that makes the hard part easy
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <button 
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto bg-fb-green hover:brightness-110 text-white px-10 py-5 rounded-lg text-xl font-black shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                Buy Now & Save
              </button>
              <p className="text-lg font-bold text-blue-50 leading-snug">
                Get up to $250 back in<br/>payment fees for 60 days.*
              </p>
            </div>
          </div>
          
          <div className="relative animate-in slide-in-from-right-8 duration-700">
            <div className="rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden transform lg:translate-x-12 translate-y-6">
              <img 
                alt="BookFlow Dashboard" 
                className="w-full h-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtFRYrPNjBU-3qjeXLMZotapgtSrqPcItiAlRM7TKXaikAtOjZOey-eGkv7zHHAjBovuOOHmi3bmcmGrho0rkV3yL3JF4aE-eCJC97tgeN35HqGuA8udNc6NNnXtzg4OX7fsEq-FpK22Rka2aYccVijTq_1yuITy_5vdwjTNehTkhi-9zScH3-mAPVBAhNEwI74nLapGDr4b2ddjkhR-CbnkbthByOWGcOrkmEauwsBjf7rdQ-O2tKzcYs5axR7e5e5bc1tpOAxYrS"
              />
            </div>
            <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-80 shadow-2xl rounded-2xl hidden lg:block border-8 border-fb-navy/50">
              <img 
                alt="Invoice UI" 
                className="w-full h-auto rounded-xl" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi5JfQo76F8meoJCcn4DRJfC2Dg-4qMsiOVJElMKKjEO6wpCEHFZZi4gBVSqxQC4TRcpOMYJztFVQVMV6UesABEFTy7VgfpLiQ4iEtcfIQ6MP_9bKljvZVhk-MUkjrpwYF1hZiw3_qxkyVeU9ZPWrHaH5mcpJNYEEF0cKfnZAt_WZgGvVfxEJJ2gppV_pTMx9Pn3kIp2c8W02rvgw2Xj8LR4AdWFustOctDryoR2rwlVDRQSZDtr5SLmSUh906P8eJpcS29HhkgNNN"
              />
            </div>
          </div>
        </div>

        <div className="mt-24 mx-auto max-w-[1440px] px-6 lg:px-12">
            <p className="text-white text-lg font-black mb-10 opacity-90">Customers and experts recommend BookFlow</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
                <RatingsBlock score="4.5 Excellent" site="PCMag.com" />
                <RatingsBlock score="4.5 Excellent" site="G2.com" />
                <RatingsBlock score="4.4 Excellent" site="Capterra.com" />
                <RatingsBlock score="4.5 Excellent" site="GetApp.com" />
            </div>
        </div>
        
        {/* Curved Divider Simulation */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-white curved-transition"></div>
      </section>

      {/* Features Showcase */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="text-center mb-20">
                <h2 className="text-4xl lg:text-6xl font-black text-fb-navy leading-tight">
                    The <span className="text-fb-blue">features</span> you need.<br/>All in one place.
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Invoicing Card */}
                <div className="bg-fb-cream rounded-[40px] p-12 flex flex-col justify-between overflow-hidden relative min-h-[460px] group">
                    <div className="relative z-10 max-w-sm">
                        <h3 className="text-3xl font-black text-fb-navy mb-6">Invoicing</h3>
                        <p className="text-lg text-gray-700 font-medium mb-10 leading-relaxed">Create professional invoices in minutes. Automatically add tracked time and expenses, calculate taxes, and customize your payment options.</p>
                        <a href="#" className="inline-flex items-center gap-2 text-fb-navy font-black hover:underline">
                            Learn about Invoicing <ChevronRight size={18} />
                        </a>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3/5 transform translate-x-12 translate-y-12 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-500">
                        <img alt="Invoicing" className="rounded-tl-2xl shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi5JfQo76F8meoJCcn4DRJfC2Dg-4qMsiOVJElMKKjEO6wpCEHFZZi4gBVSqxQC4TRcpOMYJztFVQVMV6UesABEFTy7VgfpLiQ4iEtcfIQ6MP_9bKljvZVhk-MUkjrpwYF1hZiw3_qxkyVeU9ZPWrHaH5mcpJNYEEF0cKfnZAt_WZgGvVfxEJJ2gppV_pTMx9Pn3kIp2c8W02rvgw2Xj8LR4AdWFustOctDryoR2rwlVDRQSZDtr5SLmSUh906P8eJpcS29HhkgNNN" />
                    </div>
                </div>

                {/* Billing Card */}
                <div className="bg-fb-blue rounded-[40px] p-12 flex flex-col justify-between overflow-hidden relative min-h-[460px] text-white">
                    <div className="relative z-10 max-w-sm">
                        <h3 className="text-3xl font-black mb-6">Billing and Payments</h3>
                        <p className="text-lg text-blue-50 font-medium mb-10 leading-relaxed">Make getting paid the easy part: Get paid faster with automated invoices and billing, secure online payments, and built-in reminders.</p>
                        <a href="#" className="inline-flex items-center gap-1 font-black hover:underline">
                            Learn about Payments <ChevronRight size={18} />
                        </a>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 bg-white rounded-t-3xl p-8 shadow-2xl">
                         <p className="text-fb-navy font-black text-sm mb-6 uppercase tracking-widest">Payment Methods</p>
                         <div className="flex gap-6 items-center">
                            <div className="bg-gray-100 h-10 w-16 rounded shadow-inner"></div>
                            <div className="bg-gray-100 h-10 w-16 rounded shadow-inner"></div>
                            <div className="bg-gray-100 h-10 w-16 rounded shadow-inner"></div>
                            <div className="bg-gray-100 h-10 w-16 rounded shadow-inner"></div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Expenses */}
                <div className="bg-blue-50 rounded-[40px] p-10 flex flex-col justify-between overflow-hidden relative">
                    <div>
                        <h3 className="text-2xl font-black text-fb-navy mb-4">Expenses</h3>
                        <p className="text-gray-600 font-medium mb-8">Keep track of your expenses with mobile receipt scanning and automated expense categorization.</p>
                        <a href="#" className="inline-flex items-center gap-1 text-fb-navy font-black text-sm hover:underline">
                            Learn about Expenses <ChevronRight size={14} />
                        </a>
                    </div>
                    <div className="mt-12">
                        <img alt="Expenses" className="w-2/3 ml-auto shadow-2xl rounded-t-2xl border-4 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi5JfQo76F8meoJCcn4DRJfC2Dg-4qMsiOVJElMKKjEO6wpCEHFZZi4gBVSqxQC4TRcpOMYJztFVQVMV6UesABEFTy7VgfpLiQ4iEtcfIQ6MP_9bKljvZVhk-MUkjrpwYF1hZiw3_qxkyVeU9ZPWrHaH5mcpJNYEEF0cKfnZAt_WZgGvVfxEJJ2gppV_pTMx9Pn3kIp2c8W02rvgw2Xj8LR4AdWFustOctDryoR2rwlVDRQSZDtr5SLmSUh906P8eJpcS29HhkgNNN" />
                    </div>
                </div>

                {/* Payroll */}
                <div className="bg-fb-navy text-white rounded-[40px] p-10 flex flex-col justify-between overflow-hidden relative">
                    <div>
                        <h3 className="text-2xl font-black mb-4">Payroll</h3>
                        <p className="text-blue-100 font-medium mb-8">The simplest way to pay yourself and your team. Seamlessly run payroll and calculate taxes.</p>
                        <a href="#" className="inline-flex items-center gap-1 font-black text-sm hover:underline">
                            Learn about Payroll <ChevronRight size={14} />
                        </a>
                    </div>
                    <div className="mt-12">
                         <img alt="Payroll" className="w-full shadow-2xl rounded-t-2xl border-4 border-white/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtFRYrPNjBU-3qjeXLMZotapgtSrqPcItiAlRM7TKXaikAtOjZOey-eGkv7zHHAjBovuOOHmi3bmcmGrho0rkV3yL3JF4aE-eCJC97tgeN35HqGuA8udNc6NNnXtzg4OX7fsEq-FpK22Rka2aYccVijTq_1yuITy_5vdwjTNehTkhi-9zScH3-mAPVBAhNEwI74nLapGDr4b2ddjkhR-CbnkbthByOWGcOrkmEauwsBjf7rdQ-O2tKzcYs5axR7e5e5bc1tpOAxYrS" />
                    </div>
                </div>

                {/* More Features List */}
                <div className="bg-fb-yellow rounded-[40px] p-10">
                    <div className="bg-fb-blue p-2 w-fit rounded-lg mb-8">
                         <Timer className="text-white" size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-fb-navy mb-8">More features</h3>
                    <div className="space-y-4">
                        {['Accounting', 'Mileage Tracking', 'Reporting', 'Clients', 'Mobile', 'Bookkeeping'].map(feature => (
                            <a key={feature} href="#" className="flex items-center justify-between font-black text-fb-navy border-b border-fb-navy/10 pb-3 hover:translate-x-2 transition-transform duration-300">
                                {feature} <ChevronRight size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Your Way Section */}
      <section className="py-32 bg-fb-cream">
         <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <h2 className="text-4xl lg:text-7xl font-black text-fb-navy leading-[1.1] mb-16 tracking-tight">
                Use BookFlow <br/><span className="text-fb-blue">your way</span>
            </h2>

            <div className="relative rounded-[60px] overflow-hidden aspect-[21/9] mb-[-140px] shadow-2xl">
                <img alt="Professional" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjUO2o_XfUlegnw4vREfRr_1SQzNK67ExMyBjPAGw6XeuaBtEvdFU6T-tExj3jJ4DK72-iLLYSWEeTpivDxV65dlEie951buEEW1-s23-3EIR0cFbPvKRez2UFphIF4zYad1bejrOctDryoR2rwlVDRQSZDtr5SLmSUh906P8eJpcS29HhkgNNN" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:px-12 relative z-20">
                {[
                    { title: 'Freelancers', desc: 'Keep your books in check, your clients happy, and your work on track.' },
                    { title: 'Solopreneurs', desc: 'Invest in software that respects your time so you can spend it building.' },
                    { title: 'Businesses with employees', desc: 'Save time and money by collaborating with your team.' },
                    { title: 'Businesses with contractors', desc: 'Stay organized and informed about your daily operations.' },
                ].map(card => (
                    <div key={card.title} className="bg-fb-navy text-white p-10 rounded-[32px] flex flex-col min-h-[340px] shadow-2xl shadow-fb-navy/30">
                        <h4 className="text-2xl font-black mb-6">{card.title}</h4>
                        <p className="text-blue-100 font-medium leading-relaxed flex-grow">{card.desc}</p>
                        <a href="#" className="font-black border-b-2 border-white w-fit mt-10 hover:text-fb-blue hover:border-fb-blue transition-colors">Learn More</a>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Stats Grid */}
      <section className="py-32 bg-white">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-fb-cream rounded-[40px] p-16 flex flex-col justify-between relative overflow-hidden min-h-[480px]">
                      <div className="relative z-10">
                          <h2 className="text-4xl lg:text-6xl font-black text-fb-navy mb-12 max-w-md leading-tight">More reasons to love BookFlow</h2>
                          <div className="flex flex-wrap gap-6">
                              <button onClick={() => navigate('/pricing')} className="bg-fb-green hover:brightness-110 text-white px-10 py-5 rounded-lg font-black text-lg shadow-xl transition-all">Buy Now & Save</button>
                              <button onClick={() => navigate('/signup')} className="bg-white border-2 border-fb-navy text-fb-navy px-10 py-4 rounded-lg font-black text-lg hover:bg-fb-navy hover:text-white transition-all">Try It Free</button>
                          </div>
                      </div>
                      <div className="absolute -bottom-10 -right-4 opacity-5 pointer-events-none transform rotate-12">
                          <span className="text-[320px] font-black text-fb-navy leading-none">f</span>
                      </div>
                  </div>

                  <div className="lg:col-span-5 bg-fb-blue text-white rounded-[40px] p-16 flex flex-col justify-between min-h-[480px]">
                      <Timer size={48} className="text-blue-200" />
                      <div>
                          <div className="flex items-baseline gap-2">
                              <span className="text-8xl font-black tracking-tighter">553</span>
                              <span className="text-4xl font-black text-blue-200 uppercase">hrs</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-50 mt-6 leading-relaxed">Save up to 553 hours each year by using BookFlow</p>
                      </div>
                  </div>

                  <div className="lg:col-span-4 bg-fb-navy text-white rounded-[40px] p-12 flex flex-col justify-between min-h-[360px]">
                      <Globe size={40} className="text-blue-400" />
                      <div>
                          <span className="text-7xl font-black">160+</span>
                          <p className="text-xl font-bold text-blue-100 mt-4">Countries have used BookFlow</p>
                      </div>
                  </div>

                  <div className="lg:col-span-4 bg-fb-blue text-white rounded-[40px] p-12 flex flex-col justify-between min-h-[360px]">
                      <CreditCard size={40} className="text-blue-200" />
                      <div>
                          <div className="flex items-center">
                              <span className="text-3xl font-black mr-2">$</span>
                              <span className="text-7xl font-black">7000</span>
                          </div>
                          <p className="text-xl font-bold text-blue-50 mt-4">Save up to $7000 in billable hours</p>
                      </div>
                  </div>

                  <div className="lg:col-span-4 bg-fb-navy text-white rounded-[40px] p-12 flex flex-col justify-between min-h-[360px]">
                      <Users size={40} className="text-blue-400" />
                      <div>
                          <span className="text-7xl font-black">30M+</span>
                          <p className="text-xl font-bold text-blue-100 mt-4">Small businesses trust us</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Support Section */}
      <section className="py-32 bg-fb-gray">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                  <div className="bg-white rounded-[40px] p-16 flex flex-col justify-center shadow-xl">
                        <h2 className="text-4xl lg:text-6xl font-black text-fb-navy mb-12 leading-tight">
                            Support that actually supports you <span className="text-red-500">❤️</span>
                        </h2>
                        <div className="flex flex-wrap gap-6">
                            <button className="bg-fb-navy text-white px-10 py-5 rounded-lg font-black text-lg hover:brightness-110 transition-all">Contact Us</button>
                            <button className="border-2 border-fb-navy text-fb-navy px-10 py-4 rounded-lg font-black text-lg hover:bg-fb-navy hover:text-white transition-all">Help Center</button>
                        </div>
                  </div>
                  <div className="rounded-[40px] overflow-hidden shadow-2xl h-[500px]">
                      <img alt="Support" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRnicznbp2Vzk66iD2BsKNRNV4-Otwp2Eod6AthmeFrOv6dSmODxVDBsMZulP8uFlzr2F3eOoizFR9q8eJgmWMDowBp3VeuWZV7fUkMMzE7DRteisN4CHRKn6nHtBycfVe8qRKFwBhqG2fEAESAwZLNwuw0b5KZsh6cPmRQRaCVLCRM6KE-5SXT-eZg2HVYi8FZVCXlCSopZUAOq_y68sBuIOa6ZaBiv37J-k_JvybyajvGcrKQ3y3CA709KGdtpLPMgenEXoxeGjb" />
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      { icon: <Check />, title: 'Knowledgeable Staff', desc: 'Our Support team never transfers you to other departments.' },
                      { icon: <Star />, title: '4.8/5.0 Star Reviews', desc: 'That\'s our team approval rating across 120,000+ reviews.' },
                      { icon: <Globe />, title: 'Global Coverage', desc: 'Over 100 Support staff working across North America.' },
                  ].map(item => (
                      <div key={item.title} className="bg-fb-blue text-white p-12 rounded-[40px] shadow-xl">
                          <div className="mb-8 p-3 bg-white/10 w-fit rounded-full">{item.icon}</div>
                          <h4 className="text-2xl font-black mb-6">{item.title}</h4>
                          <p className="text-blue-100 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-32 bg-white">
          <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-4xl lg:text-6xl font-black text-fb-navy text-center mb-20 tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-4">
                  <FAQItem question="What do I get in my 30-day free trial?">
                      You'll have full access to all BookFlow features for 30 days. No credit card is required. You can send invoices, track time, and manage expenses immediately.
                  </FAQItem>
                  <FAQItem question="Which BookFlow plan is right for me?">
                      It depends on the size of your business and how many clients you bill. The Lite plan is perfect for freelancers with up to 5 clients, while Premium is best for growing teams.
                  </FAQItem>
                  <FAQItem question="How does BookFlow work?">
                      BookFlow is cloud-based, meaning your data is always backed up and accessible from any device. We automate invoicing, bookkeeping, and payroll to save you hours of admin.
                  </FAQItem>
                  <FAQItem question="Is my data safe?">
                      Yes. We use industry-standard SSL encryption and multiple redundant servers to ensure your data is safe and available 24/7.
                  </FAQItem>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="bg-fb-navy py-32 text-white overflow-hidden relative">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-24 relative z-10">
              <div className="animate-in slide-in-from-left duration-700">
                  <h2 className="text-5xl lg:text-8xl font-black mb-16 tracking-tighter leading-none">Ready to get started?</h2>
                  <div className="flex flex-wrap gap-8">
                      <button onClick={() => navigate('/pricing')} className="bg-fb-green hover:brightness-110 text-white px-12 py-6 rounded-xl text-2xl font-black shadow-2xl transition-all">Buy Now & Save</button>
                      <button onClick={() => navigate('/signup')} className="border-2 border-white text-white px-12 py-6 rounded-xl text-2xl font-black hover:bg-white/10 transition-all">Try It Free</button>
                  </div>
              </div>
              
              <div className="relative h-[600px] hidden lg:block animate-in zoom-in duration-1000">
                   {/* Mock UI Elements overlapping */}
                   <div className="absolute top-0 right-0 w-[400px] bg-white rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] p-10 transform -rotate-3 z-30">
                        <div className="flex justify-between items-start mb-8">
                            <span className="text-fb-navy font-black text-lg">Total Profit</span>
                            <span className="text-fb-blue font-black text-4xl">$12.5k</span>
                        </div>
                        <div className="h-40 w-full bg-blue-50 rounded-2xl relative overflow-hidden shadow-inner">
                            <div className="absolute bottom-0 w-full h-1/2 bg-fb-blue/20 blur-xl"></div>
                        </div>
                   </div>
                   
                   <div className="absolute bottom-10 left-0 w-[360px] bg-fb-gray rounded-3xl shadow-2xl p-10 transform rotate-6 z-20">
                        <p className="text-fb-navy font-black text-sm mb-8 uppercase tracking-widest">Billing</p>
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-gray-200 rounded-full"></div>
                            <div className="h-4 w-3/4 bg-gray-200 rounded-full"></div>
                            <div className="h-10 w-full bg-fb-green rounded-lg mt-8 flex items-center justify-center font-black text-white">Paid</div>
                        </div>
                   </div>
              </div>
          </div>
          <div className="absolute top-1/2 left-0 w-[1000px] h-[1000px] bg-fb-blue/10 rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      </section>
    </div>
  );
}